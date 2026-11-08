import {readFile} from 'node:fs/promises';
import {initialWorld,pose} from '../challenge-model.mjs';
import {referenceProgram} from './challenge-fixtures.mjs';

// Earn real session unlocks: startup deliberately no longer accepts storage seeds.
export async function enterChallenge(page,mode){
 const modes=['easy','medium','hard'];
 for(let i=0;i<modes.indexOf(mode);i++){
  if(await page.locator(`[data-mode="${modes[i+1]}"]`).isEnabled())continue;
  const steps=referenceProgram(modes[i]);
  await page.locator('#file').setInputFiles({name:'prerequisite.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:modes[i],steps}))});
  await page.waitForFunction(n=>document.querySelector('#step-count').textContent===String(n),steps.length);
  await page.locator('#run').click();
  await page.locator('#completion').waitFor({state:'visible',timeout:60000});
 }
 await page.locator(`[data-mode="${mode}"]`).click();
}

export async function exportProgram(page){
 await page.locator('[data-tab="program"]').click();
 const downloaded=page.waitForEvent('download');await page.locator('#export').click();
 const program=JSON.parse(await readFile(await (await downloaded).path(),'utf8'));
 await page.locator('[data-tab="controls"]').click();
 return program;
}

// Test journeys use real visible controls; the app has no command/Guide interface.
export async function replay(page){await page.locator('[data-tab="program"]').click();await page.locator('#run').click();}
export async function record(page){await page.locator('[data-tab="controls"]').click();await page.locator('#record').click();}
export async function operate(page,request){
 const alias={'探索':'explore','简单':'easy','中等':'medium','困难':'hard','控制':'controls','程序':'program','中文':'language zh','英语':'language en'};
 const s=alias[request]||request;
 if(['explore','easy','medium','hard'].includes(s)){const b=page.locator(`[data-mode="${s}"]`);if(await b.isEnabled())await b.click();return;}
 if(s==='controls'||s==='program'){await page.locator(`[data-tab="${s}"]`).click();return;}
 if(s.startsWith('language ')){await page.locator('#language').selectOption(s.split(' ')[1]);return;}
 if(/^(robot|机器人) /.test(s)){await operate(page,'explore');await page.locator(`[data-robot-axes="${s.split(' ')[1]}"]`).click();return;}
 if(s.startsWith('arm ')||s.startsWith('机械臂 ')){await page.locator(`[data-arm="${s.split(' ')[1].toUpperCase()}"]`).click();return;}
 if(s==='run')return replay(page);if(s==='pause'){await operate(page,'program');await page.locator('#pause').click();return;}
 if(s==='stop'||s==='reset'){await page.locator('#'+s).click();return;}
 if(s==='record on'||s==='record off'){if((await page.locator('#record').getAttribute('aria-pressed')==='true')!==s.endsWith('on'))await record(page);return;}
 if(s.startsWith('add ')){
  if(s==='add move'){await operate(page,'controls');await page.locator('#add-move').click();}
  else{const wasControls=await page.locator('[data-tab="controls"]').getAttribute('aria-pressed')==='true';await operate(page,'program');await page.locator('#append-action').selectOption(s.slice(4));await page.locator('#append').click();if(wasControls)await operate(page,'controls');}return;
 }
 if(['move','open','close'].includes(s)){await operate(page,'controls');await page.locator(s==='move'?'#move':`[data-action="${s}"]`).click();return;}
 let match=s.match(/^(target|move|joints) (.+)$/);
 if(match){await operate(page,'controls');let kind=match[1],values=match[2].split(/[\s,]+/).map(Number);
  if(kind==='joints'&&values.length===3){values=pose(initialWorld('easy').arms[0],values).tip;kind='target';}
  const mode=kind==='joints'?'joints':'xyz',toggle=page.locator(`[data-control="${mode}"]`);if(await toggle.isVisible())await toggle.click();
  for(const [i,value] of values.entries())await page.locator(kind==='joints'?'#joint-'+i:'#axis-'+['x','y','z'][i]).fill(String(value));
  if(kind==='move')await page.locator('#move').click();return;
 }
 throw Error('Unsupported test action: '+request);
}
