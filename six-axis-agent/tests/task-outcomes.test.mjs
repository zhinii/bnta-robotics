import test from 'node:test';
import assert from 'node:assert/strict';
import {taskGoal,enforceTaskGoal,checkTaskOutcome,dropCompletion} from '../task-intent.mjs';
import {initialState,snapshot,planActions,validateActions,outsideCandidates,DESK} from '../world.mjs';
import {askAgent,parseResponse} from '../agent.mjs';

const fresh=()=>initialState(0,'desk');
test('off-desk intent survives drop without coordinates and pick-plus-release model output',()=>{
 for(const actions of [[{type:'pick',object:'notebook'},{type:'drop',object:'notebook',clearOf:'desk'}],[{type:'pick',object:'notebook'},{type:'release'}],[{type:'transfer',object:'notebook',target:'current'}]]){
  const state=fresh(),before=structuredClone(state),scene=snapshot(state),goal=taskGoal('pick up the blue book and drop it off the desk',scene);
  const response=enforceTaskGoal({reply:'I will drop it.',actions},goal,scene);
  const plan=planActions(state,response.actions),result=snapshot(plan.result);
  checkTaskOutcome(goal,result);assert.equal(result.objects.find(o=>o.id==='notebook').location,'floor');
  assert.deepEqual(state,before,'planning cannot move the visible scene');
  assert.match(dropCompletion(response.actions,result),/landed on the floor/);
 }
});

test('the planner itself honours clearOf when no target or coordinates were supplied',()=>{
 const actions=[{type:'pick',object:'notebook'},{type:'drop',object:'notebook',clearOf:'desk'}];
 assert.equal(validateActions(actions)[1].target,'current');
 const result=snapshot(planActions(fresh(),actions).result);
 assert.equal(result.objects.find(o=>o.id==='notebook').location,'floor');
});

test('automatic outside placement works for every movable classroom item without coordinates',()=>{
 for(const id of ['book','notebook','pen','pencil','pen-holder']){
  const result=snapshot(planActions(fresh(),[{type:'drop',object:id,clearOf:'desk'}]).result);
  assert.equal(result.objects.find(o=>o.id===id).location,'floor',id);
 }
});

test('a named wall-side edge explains the actual fixed blocker before searching irrelevant grips',()=>{
 const state=fresh(),before=structuredClone(state);
 assert.throws(()=>planActions(state,[{type:'drop',object:'book',clearOf:'desk',edge:'back'}]),error=>error.message==='blocked'&&error.detail.blocker==='wall'&&error.detail.stage==='destination');
 assert.deepEqual(state,before);
});

test('the observed model edge field is normalised before strict action validation',()=>{
 const scene=snapshot(fresh()),goal=taskGoal('drop the blue book off the desk',scene);
 const response=parseResponse(JSON.stringify({reply:'I will drop it.',actions:[{type:'drop',object:'notebook',target:'desk',edge:'front'}]}),{goal,scene,language:'en'});
 checkTaskOutcome(goal,snapshot(planActions(fresh(),response.actions).result));
});

test('geometry uses the entire rotated footprint and retains the requested edge',()=>{
 for(const object of fresh().objects)for(const rpy of [[0,0,0],[90,0,90],[0,0,45]])for(const [edge,axis,sign] of [['front',1,-1],['back',1,1],['left',0,-1],['right',0,1]]){
  const choices=outsideCandidates(fresh(),object,rpy,{edge});assert.ok(choices.length);
  for(const c of choices){assert.equal(c.edge,edge);assert.ok(sign<0?c.position[axis]<DESK.min[axis]:c.position[axis]>DESK.max[axis]);}
 }
 const scene=snapshot(fresh()),goal=taskGoal('drop the red book off the front edge of the desk',scene);
 assert.equal(goal.edge,'front');
 const wrong=planActions(fresh(),[{type:'drop',object:'book',clearOf:'desk',edge:'left'}]);
 assert.throws(()=>checkTaskOutcome(goal,snapshot(wrong.result)),/taskMismatch/);
});

test('Chinese, pronouns and held-object context preserve the same spatial outcome',()=>{
 const state=fresh(),scene=snapshot(state);
 const goal=taskGoal('拿起蓝色的书，把它从桌子前沿扔下去。',scene);
 assert.deepEqual(goal,{kind:'outside-surface',surface:'desk',edge:'front',objects:['notebook']});
 const held=planActions(state,[{type:'pick',object:'notebook'}]).result,heldScene=snapshot(held);
 const contextual=taskGoal('now drop it off the desk',heldScene);
 const response=enforceTaskGoal({reply:'Okay',actions:[{type:'release'}]},contextual,heldScene);
 checkTaskOutcome(contextual,snapshot(planActions(held,response.actions).result));
 assert.equal(taskGoal('drop it off the desk',scene,[{role:'user',content:'pick up the blue book'}]).objects[0],'notebook');
});

test('here, negations, hypothetical questions and clarifications are never silently turned into edge drops',()=>{
 const scene=snapshot(fresh());
 for(const question of ['drop the blue book here','drop the blue book on the front edge of the desk',"Don't drop the blue book off the desk. Put it on the shelf.",'What would happen if I drop the blue book off the desk?','不要把蓝色的书扔到桌子外面，把它放在书架上。'])assert.equal(taskGoal(question,scene),null,question);
 assert.deepEqual(taskGoal('drop the blue book off the desk near the red book',scene).objects,['notebook'],'a reference object is not permission to move that object');
 const goal=taskGoal('drop the blue book off the desk',scene),question={reply:'Which edge?',actions:[]};
 assert.deepEqual(enforceTaskGoal(question,goal,scene),question);
 assert.throws(()=>enforceTaskGoal({reply:'Okay',actions:[{type:'pick',object:'book'},{type:'release'}]},goal,scene),/taskMismatch/);
 assert.throws(()=>checkTaskOutcome(goal,scene),/taskMismatch/,'a schema-valid action is not proof of success');
});

test('release here reports the actual landing surface, even when the model claimed the floor',()=>{
 const held=planActions(fresh(),[{type:'pick',object:'notebook'}]).result;
 const result=snapshot(planActions(held,[{type:'release'}]).result);
 assert.match(dropCompletion([{type:'release'}],result,'en','notebook'),/landed on the desk/);
 const moved=planActions(held,[{type:'move',position:[180,-180,150]}]).result;
 const here=moved.objects.find(o=>o.id==='notebook').position.slice(0,2);
 const released=planActions(moved,[{type:'drop',object:'notebook'}]).result;
 assert.deepEqual(released.objects.find(o=>o.id==='notebook').position.slice(0,2),here,'a named drop without a destination releases here, not back at the pickup spot');
});

test('contradictory proposals are repaired once with the original goal and scene',async()=>{
 let calls=0;const state=fresh(),scene=snapshot(state);
 const response=await askAgent({hosted:true},{question:'Drop the blue book off the desk',language:'en',history:[],scene},undefined,async(url,init)=>{
  const task=JSON.parse(JSON.parse(init.body).messages.at(-1).content);assert.equal(task.taskGoal.objects[0],'notebook');
  const actions=++calls===1?[{type:'pick',object:'book'}]:[{type:'drop',object:'notebook',clearOf:'desk'}];
  return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({reply:'I will move it.',actions})}}]})};
 });
 assert.equal(calls,2);checkTaskOutcome(response.goal,snapshot(planActions(state,response.actions).result));
});

test('a shelf surface and neighbouring object are one coherent placement, including occupied shelves',()=>{
 const state=planActions(fresh(),[{type:'transfer',object:'notebook',target:'shelf'}]).result;
 const action={type:'transfer',object:'book',target:'shelf',beside:'notebook',relation:'right'};
 const normalized=validateActions([action])[0];assert.equal(normalized.surface,'shelf');assert.equal(normalized.target,undefined);
 const result=snapshot(planActions(state,[action]).result);
 for(const id of ['book','notebook'])assert.equal(result.objects.find(o=>o.id===id).onShelf,true,id);
 assert.ok(result.objects.find(o=>o.id==='book').position[0]>result.objects.find(o=>o.id==='notebook').position[0]);
 assert.deepEqual(result.objects.find(o=>o.id==='notebook').position,snapshot(state).objects.find(o=>o.id==='notebook').position,'do not move the neighbour');
 assert.deepEqual(validateActions([{type:'transfer',object:'book',target:'shelf',position:[200,150]}])[0],{type:'transfer',object:'book',surface:'shelf',position:[200,150]});
 assert.throws(()=>validateActions([{...action,surface:'desk'}]),/destination/,'conflicting surfaces remain ambiguous');
});
