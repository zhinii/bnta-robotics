const allowedOrigins = new Set(['https://zhinii.github.io', 'http://127.0.0.1:4226']);
const endpoints = new Set([
  'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1',
  'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
  'https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  'https://dashscope.aliyuncs.com/compatible-mode/v1',
  'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
]);
function headers(origin:string) { return { 'Access-Control-Allow-Origin':origin, 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, X-Alibaba-Base', 'Vary':'Origin', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' }; }
export async function OPTIONS(request:Request) {
  const origin=request.headers.get('origin')||'';
  return new Response(null,{status:allowedOrigins.has(origin)?204:403,headers:allowedOrigins.has(origin)?headers(origin):{}});
}
export async function POST(request:Request) {
  const origin=request.headers.get('origin')||'';
  if(!allowedOrigins.has(origin))return Response.json({error:'origin'},{status:403});
  const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:headers(origin)});
  const base=request.headers.get('x-alibaba-base')||'';
  const authorization=request.headers.get('authorization')||'';
  if(!endpoints.has(base)||!/^Bearer [^\s]{1,512}$/.test(authorization))return reply({error:'configuration'},400);
  if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return reply({error:'content_type'},400);
  let stage='body';
  try {
    const reader=request.body?.getReader();if(!reader)return reply({error:'body'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>48000){await reader.cancel();return reply({error:'size'},413);}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const body=JSON.parse(new TextDecoder().decode(bytes));
    if(!/^[\w.\-]{1,100}$/.test(body.model)||!Array.isArray(body.messages)||body.messages.length>14||body.messages.some((m:any)=>!['system','assistant','user'].includes(m.role)||typeof m.content!=='string'||m.content.length>12000))return reply({error:'request'},400);
    stage='provider';
    const upstream=await fetch(base+'/chat/completions',{method:'POST',redirect:'manual',signal:AbortSignal.timeout(25000),headers:{'Content-Type':'application/json',Authorization:authorization},body:JSON.stringify({model:body.model,messages:body.messages,max_tokens:900,temperature:.2,stream:false,enable_thinking:false})});
    // No request bodies, authorization values, or provider diagnostics are logged or stored.
    if(!upstream.ok)return reply({error:'provider'},[400,401,403,404,429].includes(upstream.status)?upstream.status:502);
    stage='parse';
    const data:any=await upstream.json();
    const content=data?.choices?.[0]?.message?.content;
    if(typeof content!=='string'||content.length>12000)return reply({error:'response'},502);
    return reply({choices:[{message:{content}}]});
  } catch(error) { return reply({error:'connection',stage,kind:error instanceof TypeError?'type':error instanceof SyntaxError?'json':'transport'},502); }
}
