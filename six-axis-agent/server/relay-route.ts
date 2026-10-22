import { ROBOT_SYSTEM } from './relay-system.mjs';
const allowedOrigins = new Set(['https://zhinii.github.io', 'http://127.0.0.1:4226']);
const endpoints = new Set([
  'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1',
  'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
  'https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  'https://dashscope.aliyuncs.com/compatible-mode/v1',
  'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
]);
const clients=new Map<string,{minute:number,count:number}>();
let windowMinute=0,windowCount=0,inFlight=0;
function headers(origin:string) { return { 'Access-Control-Allow-Origin':origin, 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, X-Alibaba-Base', 'Vary':'Origin', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' }; }
function configuration(){
  const key=(process.env.ALIBABA_API_KEY||'').trim();
  const base=process.env.ALIBABA_BASE_URL||'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1';
  const model=process.env.ALIBABA_MODEL||'qwen3.8-flash';
  const visionModel=process.env.ALIBABA_VISION_MODEL||'qwen3.7-plus';
  return key&&!/\s/.test(key)&&key.length<=512&&endpoints.has(base)&&/^[\w.\-]{1,100}$/.test(model)&&/^[\w.\-]{1,100}$/.test(visionModel)?{key,base,model,visionModel}:null;
}
export async function GET(request:Request){
  const origin=request.headers.get('origin')||'';
  return Response.json({service:'Robot Lab connection',configured:!!configuration()},{headers:allowedOrigins.has(origin)?headers(origin):{'Cache-Control':'no-store'}});
}
export async function OPTIONS(request:Request) {
  const origin=request.headers.get('origin')||'';
  return new Response(null,{status:allowedOrigins.has(origin)?204:403,headers:allowedOrigins.has(origin)?headers(origin):{}});
}
export async function POST(request:Request) {
  const origin=request.headers.get('origin')||'';
  if(!allowedOrigins.has(origin))return Response.json({error:'origin'},{status:403});
  const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:headers(origin)});
  const config=configuration();if(!config)return reply({error:'server_configuration'},503);
  if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return reply({error:'content_type'},400);
  let stage='body',admitted=false;
  try {
    const reader=request.body?.getReader();if(!reader)return reply({error:'body'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>112000){await reader.cancel();return reply({error:'size'},413);}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const body=JSON.parse(new TextDecoder().decode(bytes));
    if(!Array.isArray(body.messages)||!body.messages.length||body.messages.length>14||body.messages.some((m:any)=>!['system','assistant','user'].includes(m.role)||typeof m.content!=='string'||m.content.length>12000))return reply({error:'request'},400);
    const last=body.messages.at(-1);if(last.role!=='user')return reply({error:'request'},400);
    let task;try{task=JSON.parse(last.content);}catch{
      // Older pages sent the schema-repair sentence without its scene envelope.
      // Accept only that bounded, known retry shape with the preceding scene.
      if(!/^Your response (?:was cut off before completion|did not match the allowed action schema)\./.test(last.content)||body.messages.at(-2)?.role!=='assistant'||body.messages.at(-3)?.role!=='user')return reply({error:'scene_required'},400);
      try{task=JSON.parse(body.messages.at(-3).content);}catch{return reply({error:'scene_required'},400);}
    }
    if(typeof task.question!=='string'||task.question.length>1600||!['en','zh'].includes(task.language)||!Array.isArray(task.scene?.objects))return reply({error:'scene_required'},400);
    const image=body.scene_image;
    if(image&&(!Number.isInteger(image.width)||!Number.isInteger(image.height)||image.width<1||image.height<1||image.width>512||image.height>512||typeof image.data!=='string'||image.data.length>64000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(image.data)))return reply({error:'image'},400);
    const minute=Math.floor(Date.now()/60000);
    if(windowMinute!==minute){windowMinute=minute;windowCount=0;for(const [ip,value] of clients)if(value.minute!==minute)clients.delete(ip);}
    const ip=request.headers.get('cf-connecting-ip')||'unknown',entry=clients.get(ip)||{minute,count:0};
    // Bounded per-worker safeguards. Provider account quotas remain the hard spending boundary.
    if(inFlight>=3||windowCount>=60||entry.count>=12)return reply({error:'rate_limit'},429);
    entry.count++;clients.set(ip,entry);windowCount++;inFlight++;admitted=true;
    const messages:any[]=[{role:'system',content:ROBOT_SYSTEM},...body.messages.filter((m:any)=>m.role!=='system').slice(-13)];
    const text=messages.at(-1).content;
    if(image)messages.at(-1).content=[{type:'text',text},{type:'image_url',image_url:{url:image.data}}];
    stage='provider';
    const signal=AbortSignal.timeout(25000),call=(model:string)=>fetch(config.base+'/chat/completions',{method:'POST',redirect:'manual',signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.key},body:JSON.stringify({model,messages,max_tokens:2000,response_format:{type:'json_object'},temperature:body.temperature===.6?.6:.2,stream:false,enable_thinking:false})});
    let upstream=await call(image?config.visionModel:config.model),imageStatus=image?'seen':null;
    if(image&&[400,403,404].includes(upstream.status)){
      // A plan without vision access still works with exact scene geometry.
      // Do not repeatedly send unsupported images or call this a bad API key.
      await upstream.body?.cancel();messages.at(-1).content=text;imageStatus='unavailable';upstream=await call(config.model);
    }
    if(!upstream.ok)return reply({error:'provider'},[400,401,403,404,429].includes(upstream.status)?upstream.status:502);
    stage='parse';
    const data:any=await upstream.json();let content=data?.choices?.[0]?.message?.content;
    if(typeof content!=='string'||content.length>12000)return reply({error:'response'},502);
    // A newly deployed relay must still speak the action schema understood by
    // an already-open older page. This is the same flat 180-degree orientation.
    try{const parsed=JSON.parse(content);if(Array.isArray(parsed.actions)){parsed.actions=parsed.actions.map((a:any)=>{const legacySpine=a.posture==='spine'&&!body.messages.some((m:any)=>m.role==='system'&&m.content.includes('posture:"spine"')),legacyFlip=a.posture==='face-down'&&!body.messages.some((m:any)=>m.role==='system'&&m.content.includes('posture:"face-down"'));if(!legacySpine&&!legacyFlip)return a;const result={...a,orientation:legacySpine?[0,-90,0]:[180,0,0]};delete result.posture;return result;});content=JSON.stringify(parsed);}}catch{}
    return reply({choices:[{message:{content},finish_reason:data.choices[0].finish_reason==='length'?'length':'stop'}],...(imageStatus?{perception:{imageStatus}}:{})});
  } catch(error) { return reply({error:'connection',stage,kind:error instanceof TypeError?'type':error instanceof SyntaxError?'json':'transport'},502); }
  finally{if(admitted)inFlight--;}
}
