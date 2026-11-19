// Check unresolved references before requesting a plan. The model handles broader ambiguity.
export const CLARIFICATION_POLICY='For ambiguous commands, ask ONE short question in the selected language and return needsInput:true, actions:[]. Ask only for the missing detail: which object, reference, distance, direction, axis or order. Use held-object and recent task context before asking. Keep the pending task so a short answer completes it. Do not guess among multiple plausible objects or invent distances/axes. Clear general placement of a named item on the shelf may use any clear spot; do not demand exact coordinates. Creative social gestures may choose a small movement. Never move while asking the user to choose.';

export function referencedObjects(text,scene){
  const aliases={book:/\bred\s*(?:book|one)\b|红(?:色)?(?:的)?(?:书|本)/iu,notebook:/\b(?:blue\s*(?:book|notebook|one)|notebook)\b|蓝(?:色)?(?:的)?(?:书|本|笔记本)|笔记本/iu,pen:/\bpen\b(?!\s*(?:holder|cup))|蓝(?:色)?(?:的)?笔(?!记)|钢笔/iu,pencil:/\bpencil\b|铅笔/iu,'pen-holder':/\b(?:holder|cup)\b|笔筒/iu};
  return (scene.objects||[]).filter(o=>aliases[o.id]?.test(text));
}
export function clarifyReference(question,scene,history,language){
  if(question==='connection_check')return null;
  const q=question.trim(),zh=language==='zh';
  if(!/\b(?:pick|put|place|move|shift|nudge|turn|rotate|stand|lay|take|drop|lift)\b|拿|放|移|挪|转|立|摆/iu.test(q))return null;
  const items=scene.objects||[];
  const mentions=text=>referencedObjects(text,scene);
  const explicit=mentions(q);
  const recent=history.slice(-2).map(m=>m.content.split(/\n(?:Executed actions|Actual scene|Unexecuted request):/)[0]).join(' ');
  const context=mentions(recent),clearReference=!!scene.held||context.length===1;
  const ask=reply=>({reply,actions:[]});
  if(!clearReference&&!explicit.some(o=>['book','notebook'].includes(o.id))&&/\bbook\b|(?<!笔记)本?书/iu.test(q)&&items.some(o=>o.id==='book')&&items.some(o=>o.id==='notebook'))return ask(zh?'你指红书还是蓝色笔记本？':'Which book—the red book or the blue notebook?');
  if(!clearReference&&!explicit.length&&/\b(?:it|this one|that one|this|that)\b|这个|那个|它/iu.test(q))return ask(zh?'你想移动哪个物品？请说出名称或颜色。':'Which item do you mean? Tell me its name or colour.');
  if(/\b(?:rotate|turn)\b|旋转|转动/iu.test(q)&&/\d+\s*(?:degrees?|deg|°|度)/iu.test(q)&&!(/\b(?:[xyz]|joint|j[1-6])\b|[XYZxyz]轴|关节/iu.test(q))&&!/\b[xyz]\b|[XYZxyz]轴/iu.test(recent))return ask(zh?'绕哪个轴旋转：X、Y 还是 Z？':'Around which axis: X, Y or Z?');
  return null;
}
