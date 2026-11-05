import {readFile} from 'node:fs/promises';
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
 const details=page.locator('.program-files');
 if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
 const downloaded=page.waitForEvent('download');await page.locator('#export').click();
 const program=JSON.parse(await readFile(await (await downloaded).path(),'utf8'));
 await page.locator('[data-tab="controls"]').click();
 return program;
}
