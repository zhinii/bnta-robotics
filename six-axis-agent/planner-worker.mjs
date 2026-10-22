import { planActions, reverseSteps } from './world.mjs?v=shelf-20261022-2';

self.onmessage=({data})=>{
  try{const started=performance.now(),plan=planActions(data.state,data.actions);self.postMessage({plan,inverse:reverseSteps(data.state,plan.steps,{maxPlanningMs:Math.max(250,40000-(performance.now()-started))})});}
  catch(error){self.postMessage({error:{code:error.message,detail:error.detail,action:error.action,preview:error.preview}});}
};
