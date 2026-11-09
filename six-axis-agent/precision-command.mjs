// Complete, explicit precision commands are interpreted locally. Conversational
// and compound requests still go through the normal assistant.
const number='([+-]?\\d+(?:\\.\\d+)?)';
const jointEn=new RegExp('^(?:please )?(?:rotate|turn) (?:joint|j)\\s*([1-6])\\s+(?:by )?'+number+'\\s*(?:degrees?|deg|°)?\\s*(counter[- ]?clockwise|anti[- ]?clockwise|clockwise|ccw|cw)[.!]?$','i');
const jointZh=new RegExp('^(?:把|将)?\\s*(?:关节\\s*([1-6])|(?:第)?\\s*([1-6])\\s*(?:号)?关节)\\s*(顺时针|逆时针)\\s*(?:旋转|转动|转)?\\s*'+number+'\\s*(?:度|°)?[。！]?$');
const items={
  'red book':{id:'book',en:'red book',zh:'红书'},
  'blue notebook':{id:'notebook',en:'blue notebook',zh:'蓝色笔记本'},
  'pen holder':{id:'pen-holder',en:'pen holder',zh:'笔筒'},
  'blue pen':{id:'pen',en:'blue pen',zh:'蓝色笔'},
  'pencil':{id:'pencil',en:'pencil',zh:'铅笔'},
};
const english={...items,'blue book':items['blue notebook'],pen:items['blue pen']};
const chinese=Object.fromEntries(Object.values(items).map(item=>[item.zh,item]));
Object.assign(chinese,{'红色书本':items['red book'],'蓝色书本':items['blue notebook']});
const enObject='('+Object.keys(english).join('|')+')';
const zhObject='('+Object.keys(chinese).join('|')+')';
const coordinate='[\\s,，]*x\\s*=?\\s*'+number+'\\s*(?:mm|毫米)?[\\s,，]+y\\s*=?\\s*'+number+'\\s*(?:mm|毫米)?(?:[\\s,，]+(?:yaw|偏航角)\\s*=?\\s*'+number+'\\s*(?:degrees?|deg|度|°)?)?[.!。！]?$';
const placeEn=new RegExp('^(?:please )?(?:place|put) (?:the )?'+enObject+' (?:flat )?(?:on the shelf )?at\\s*'+coordinate,'i');
const placeZh=new RegExp('^(?:把|将)\\s*'+zhObject+'\\s*(?:平)?(?:放在|放到)\\s*(?:搁板上)?'+coordinate,'i');
export function precisionCommand(question,joints,language){
  const text=question.trim();
  if(/^(?:go home|return (?:to )?home|回到初始姿势|回到原位)[.!。！]?$/iu.test(text))return {
    reply:language==='zh'?'我会回到初始姿势。':'I’ll return to the home pose.',
    after:language==='zh'?'已回到初始姿势。':'Returned to the home pose.',actions:[{type:'home'}],
  };
  const en=jointEn.exec(text),zh=jointZh.exec(text);
  if(en||zh){
    const joint=Number(en?.[1]??(zh[1]||zh[2])),angle=Number(en?.[2]??zh[4]);
    if(!(angle>0))return null;
    const clockwise=en?/^(clockwise|cw)$/i.test(en[3]):zh[3]==='顺时针',q=[...joints];
    q[joint-1]+=clockwise?-angle:angle;
    const direction=language==='zh'?(clockwise?'顺时针':'逆时针'):(clockwise?'clockwise':'counterclockwise');
    return {
      reply:language==='zh'?`我会将关节 ${joint} ${direction}旋转 ${angle}°。`:`I’ll rotate joint ${joint} ${angle}° ${direction}.`,
      after:language==='zh'?`关节 ${joint} 已${direction}旋转 ${angle}°。`:`Joint ${joint} rotated ${angle}° ${direction}.`,
      actions:[{type:'pose',joints:q}],
    };
  }
  const place=placeEn.exec(text)||placeZh.exec(text);
  if(!place)return null;
  const [,subject,x,y,yaw]=place,item=english[subject.toLowerCase()]||chinese[subject];
  const action={type:'transfer',object:item.id,position:[Number(x),Number(y)]};
  if(yaw!==undefined)action.orientation=[0,0,Number(yaw)];
  return {
    reply:language==='zh'?'我会把'+item.zh+'放在 X '+x+'，Y '+y+(yaw===undefined?'。':'，偏航角 '+yaw+'°。'):'I’ll place the '+item.en+' at X '+x+', Y '+y+(yaw===undefined?'.':', yaw '+yaw+'°.'),
    actions:[action],
  };
}
