import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
import {enterChallenge,exportProgram,replay} from './challenge-browser-helpers.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/ipad-redesign/layout';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4225/beginner-3axis/');await page.locator('#joint-5').waitFor();
 assert.equal(await page.locator('#command,#command-form').count(),0);
 const fits=async id=>{const b=await page.locator(id).boundingBox(),v=page.viewportSize();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=v.width+1&&b.y+b.height<=v.height+1,id+' fits viewport');};
 // Let ResizeObserver resize the WebGL canvas and the next frame paint it before capture.
 const screenshot=async name=>{await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await page.locator('#scene canvas').evaluate(canvas=>canvas.getContext('webgl2').isContextLost()),false);await page.screenshot({path:out+'/'+name});};
 for(const axes of ['3','6']){
  await page.locator(`[data-robot-axes="${axes}"]`).click();
  for(const [width,height] of [[1024,768],[768,1024],[1180,820],[820,1180]])for(const lang of ['en','zh']){
   await page.setViewportSize({width,height});await page.locator('#language').selectOption(lang);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for(const id of ['#stop','#record','#move','#add-move','#locations','#feedback'])await fits(id);
   assert.ok((await page.locator('#scene').boundingBox()).height>=200);
   const panel=await page.locator('#panel-scroll').boundingBox();
   for(const field of axes==='6'?Array.from({length:6},(_,i)=>'#joint-'+i):['#axis-x','#axis-y','#axis-z']){
    const b=await page.locator(field).boundingBox();assert.ok(b.y>=panel.y&&b.y+b.height<=panel.y+panel.height+1,field+' is fully visible');assert.ok(b.height>=44);
   }
   assert.equal(await page.locator('#task-card').isVisible(),false);const position=await page.locator('#tcp').textContent();await page.locator('#task-toggle').click();assert.equal(await page.locator('#task-card').isVisible(),true);assert.equal(await page.locator('#tcp').textContent(),position);await fits('#locations');await page.locator('#task-toggle').click();
   await screenshot(`explore-${axes}-${width}-${lang}.png`);
  }
 }
 await page.setViewportSize({width:1024,height:768});await page.locator('#language').selectOption('en');
 const steps=referenceProgram('explore',3);await page.locator('#file').setInputFiles({name:'three-axis.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:'explore',axes:3,steps}))});await page.waitForFunction(()=>document.querySelector('#step-count').textContent==='6');
 assert.equal(await page.locator('#coordinate-readout').isVisible(),false);assert.equal(await page.locator('#steps .step-details:visible').count(),0);
 const panel=await page.locator('#panel-scroll').boundingBox(),last=await page.locator('#steps li').last().boundingBox();assert.ok(last.y+last.height<=panel.y+panel.height,'all six compact steps fit');
 // The compact menu retains preview, reorder and remove, using touch-accessible buttons.
 await page.locator('#steps li').first().locator('.step-menu').click();await page.getByRole('button',{name:'Move step later 1',exact:true}).click();
 await page.locator('#steps li').nth(1).locator('.step-menu').click();await page.getByRole('button',{name:'Move step earlier 2',exact:true}).click();
 assert.deepEqual((await exportProgram(page)).steps,steps);
 await page.locator('[data-tab="program"]').click();const actual=await page.locator('#tcp').textContent();await page.locator('#steps li').nth(1).locator('.step-menu').click();await page.getByRole('button',{name:'Preview 2',exact:true}).click();assert.equal(await page.locator('#tcp').textContent(),actual);assert.equal(await page.locator('[data-tab="controls"]').getAttribute('aria-pressed'),'true');
 await page.locator('#add-move').click();await page.locator('[data-tab="program"]').click();await page.locator('#steps li').last().locator('.step-menu').click();await page.getByRole('button',{name:'Remove step 7',exact:true}).click();assert.equal(await page.locator('#step-count').textContent(),'6');
 await replay(page);await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFinished');
 for(const [width,height] of [[1024,768],[768,1024]])for(const lang of ['en','zh']){
  await page.setViewportSize({width,height});await page.locator('#language').selectOption(lang);for(const id of ['#playback-panel','#run','#pause','#export','#import','#feedback'])await fits(id);await screenshot(`program-${width}-${lang}.png`);
 }
 await page.locator('#language').selectOption('en');await enterChallenge(page,'hard');
 for(const [width,height] of [[1024,768],[768,1024]])for(const lang of ['en','zh']){
  await page.setViewportSize({width,height});await page.locator('#language').selectOption(lang);await fits('#arm-picker');assert.equal(await page.locator('#arm-picker').evaluate(el=>el.parentElement.id),'panel');
  await page.locator('[data-arm="B"]').click();assert.match(await page.locator('#tcp').textContent(),/B/);const p=await page.locator('#panel-scroll').boundingBox();for(let i=0;i<6;i++){const b=await page.locator('#joint-'+i).boundingBox();assert.ok(b.y>=p.y&&b.y+b.height<=p.y+p.height+1,'Hard J'+(i+1)+' fits');}
  await page.locator('#task-toggle').click();await fits('#locations');await page.locator('#task-toggle').click();await screenshot(`hard-${width}-${lang}.png`);
 }
 assert.deepEqual(errors,[]);console.log('Layout PASS: Guide absent; all controls and six joints visible in EN/ZH on four iPad sizes; task disclosure keeps locations visible; six compact rows, preview/reorder/remove, playback results and separate arm selector.');
}finally{await browser.close();}
