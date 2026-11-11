import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {enterChallenge,record} from './challenge-browser-helpers.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/number-pad';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4227/beginner-3axis/');await page.locator('#joint-5').waitFor({state:'attached'});
 const pad=page.locator('#number-editor'),entry=page.locator('#pad-value');
 const key=key=>page.locator(`[data-pad-key="${key}"]`).tap();
 const put=async(index,value)=>{await page.locator(`[data-pad-field="${index}"]`).tap();for(const digit of String(value).replace('-',''))await key(digit);if(String(value).startsWith('-'))await key('sign');};
 const fit=async()=>{
  for(const selector of ['#scene','#coordinate-readout','#pad-value','#pad-done','#pad-keyboard','#pad-status','#stop']){
   const r=await page.locator(selector).boundingBox();assert.ok(r&&r.width>0&&r.height>0,selector+' visible');assert.ok(r.y>=0&&r.y+r.height<=page.viewportSize().height+1,selector+' in viewport');
  }
  assert.equal(await pad.evaluate(el=>el.scrollHeight<=el.clientHeight+1),true,'number pad needs no internal scroll on iPad');
  for(const b of await page.locator('#number-editor button').all()){const r=await b.boundingBox();if(r)assert.ok(r.height>=44,'touch button height');}
 };
 await page.locator('[data-mode="easy"]').tap();await record(page);
 const before=await page.locator('#tcp').textContent(),original=await page.locator('#target-tcp').textContent();
 assert.equal(await page.locator('#axis-z').evaluate(e=>e.readOnly&&e.inputMode==='none'),true);
 await page.locator('#axis-z').tap();assert.equal(await pad.isVisible(),true);assert.equal(await entry.evaluate(e=>e.readOnly&&e.inputMode==='none'),true);
 await put(0,'147');await put(1,'-85');await put(2,'130');
 assert.match(await page.locator('#target-tcp').textContent(),/X 147.0.*Y -85.0.*Z 130.0/);assert.equal(await page.locator('#tcp').textContent(),before);assert.equal(await page.locator('#step-count').textContent(),'0');
 await fit();await page.screenshot({path:out+'/xyz-landscape-en.png'});
 await page.locator('#language').selectOption('zh');assert.equal(await page.locator('#pad-title').textContent(),'数字键盘');assert.match(await page.locator('#pad-status').textContent(),/仅更新预览/);
 await page.setViewportSize({width:768,height:1024});await fit();await page.screenshot({path:out+'/xyz-portrait-zh.png'});
 await page.locator('#pad-cancel').tap();assert.equal(await pad.isVisible(),false);assert.equal(await page.locator('#target-tcp').textContent(),original.replace('Planned position','计划位置'));
 await page.locator('#language').selectOption('en');await page.setViewportSize({width:1024,height:768});
 await page.locator('#axis-x').tap();await put(0,'147');await put(1,'-85');await put(2,'80');
 assert.match(await page.locator('#pad-status').textContent(),/first blocked position/);assert.match(await page.locator('#scene canvas').getAttribute('aria-label'),/first blockage/);
 await page.screenshot({path:out+'/collision-preview.png'});
 await put(2,'130.5');await page.locator('#pad-minus').tap();assert.equal(await entry.inputValue(),'129.5');await page.locator('#pad-plus').tap();assert.equal(await entry.inputValue(),'130.5');
 await page.locator('#pad-backspace').tap();assert.equal(await entry.inputValue(),'');assert.equal(await page.locator('#pad-done').isDisabled(),true);await key('1');await key('3');await key('0');await key('.');await key('5');await page.locator('#pad-backspace').tap();assert.equal(await entry.inputValue(),'130.');assert.equal(await page.locator('#axis-z').inputValue(),'130');
 await page.locator('#pad-done').tap();assert.equal(await pad.isVisible(),false);assert.equal(await page.locator('#tcp').textContent(),before);assert.equal(await page.locator('#step-count').textContent(),'0');
 await page.locator('#move').tap();await page.waitForFunction(()=>document.querySelector('#step-count').textContent==='1');assert.match(await page.locator('#tcp').textContent(),/X 147.0.*Y -85.0.*Z 130.0/);
 // All six joints, signed hardware typing and native keyboard fallback.
 await page.locator('[data-mode="explore"]').tap();const exploreBefore=await page.locator('#tcp').textContent();await page.locator('#joint-4').tap();assert.equal(await page.locator('[data-pad-field]').count(),6);assert.match(await page.locator('#pad-context').textContent(),/Arm A.*°/);
 await put(4,'-35.5');await page.locator('#pad-plus').tap();assert.equal(await entry.inputValue(),'-35.4');
 await entry.tap();await page.keyboard.type('-22.5');assert.equal(await entry.inputValue(),'-22.5');
 await page.locator('#pad-keyboard').tap();assert.equal(await entry.evaluate(e=>e.readOnly),false);await entry.fill('-23.75');assert.equal(await page.locator('#joint-4').inputValue(),'-23.75');await page.locator('#pad-keyboard').tap();assert.equal(await entry.evaluate(e=>e.readOnly),true);
 await fit();await page.screenshot({path:out+'/joints-landscape-en.png'});await page.locator('#pad-done').tap();assert.equal(await page.locator('#joint-4').inputValue(),'-23.75');assert.equal(await page.locator('#tcp').textContent(),exploreBefore);
 // A later cancel restores the entire draft and all six fields, not just the active one.
 const jointValues=await page.locator('#joint-inputs input[type="number"]').evaluateAll(els=>els.map(e=>e.value));await page.locator('#joint-0').tap();await put(0,'20');await put(5,'45');await page.locator('#pad-cancel').tap();assert.deepEqual(await page.locator('#joint-inputs input[type="number"]').evaluateAll(els=>els.map(e=>e.value)),jointValues);
 // Hard mode retains the selected robot identity and never records an edit.
 await enterChallenge(page,'hard');await page.locator('[data-arm="B"]').tap();const armBefore=await page.locator('#tcp').textContent();await page.locator('#joint-0').tap();assert.match(await page.locator('#pad-context').textContent(),/Arm B/);await put(0,'10');await page.locator('#language').selectOption('zh');assert.match(await page.locator('#pad-context').textContent(),/B臂/);await page.setViewportSize({width:768,height:1024});await fit();await page.screenshot({path:out+'/arm-b-portrait-zh.png'});await page.locator('#pad-cancel').tap();assert.equal(await page.locator('#tcp').textContent(),armBefore.replace('Robot now','机械臂当前位置').replace('Arm B','B臂'));assert.equal(await page.locator('#step-count').textContent(),'0');
 // Reset/reload closes the editor and preserves the fresh-Explore contract.
 await page.locator('#joint-2').tap();await put(2,'55');await page.reload();await page.locator('#joint-5').waitFor();assert.equal(await pad.isVisible(),false);assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#language').inputValue(),'en');
 await page.setViewportSize({width:390,height:844});await page.locator('#joint-2').tap();await page.locator('#pad-done').scrollIntoViewIfNeeded();assert.equal(await page.locator('#pad-done').isVisible(),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 // Desktop keeps normal direct typing and provides an explicit 123 editor button.
 const desktop=await browser.newPage({viewport:{width:1280,height:800}});desktop.on('pageerror',e=>errors.push(e.message));await desktop.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4227/beginner-3axis/');await desktop.locator('#joint-5').waitFor();assert.equal(await desktop.locator('#joint-0').evaluate(e=>e.readOnly),false);await desktop.locator('#joint-0').fill('10');await desktop.locator('#open-number-pad').click();await desktop.locator('#pad-value').focus();await desktop.keyboard.type('20');await desktop.keyboard.press('Escape');assert.equal(await desktop.locator('#joint-0').inputValue(),'10');assert.equal(await desktop.locator('#number-editor').isVisible(),false);await desktop.close();
 assert.deepEqual(errors,[]);console.log('Number pad PASS: touch keyboard suppression, XYZ/J1–J6, EN/ZH, iPad layouts, signed decimal/fine entry, hardware/native fallback, cancel/done, red preview, recording isolation, Arm B, reload, phone scrolling and desktop typing.');
}finally{await browser.close();}
