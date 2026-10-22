import { planActions, reverseSteps } from './world.mjs?v=holder-20261022-1';

self.onmessage=({data})=>{
  try{const plan=planActions(data.state,data.actions);self.postMessage({plan,inverse:reverseSteps(data.state,plan.steps)});}
  catch(error){self.postMessage({error:{code:error.message,detail:error.detail,action:error.action,preview:error.preview}});}
};
