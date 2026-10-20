import { planActions, reverseSteps } from './world.mjs?v=dorm-20261021-2';

self.onmessage=({data})=>{
  try{const plan=planActions(data.state,data.actions);self.postMessage({plan,inverse:reverseSteps(data.state,plan.steps)});}
  catch(error){self.postMessage({error:{code:error.message,detail:error.detail,action:error.action}});}
};
