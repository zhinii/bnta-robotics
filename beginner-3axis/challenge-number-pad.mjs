// A preview-only editor. The caller owns robot state, validation and cancellation.
const numeric=value=>/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)&&Number.isFinite(Number(value));
export function createNumberPad({host,t,onInput,onClose}){
 host.innerHTML=`<div class="pad-heading"><strong id="pad-title"></strong><span id="pad-context"></span></div>
 <div id="pad-fields" role="group"></div>
 <div class="pad-entry"><input id="pad-value" type="text" inputmode="none" readonly autocomplete="off" spellcheck="false" maxlength="24"><span id="pad-unit"></span><button id="pad-backspace" type="button">⌫</button></div>
 <div id="pad-keys">${['7','8','9','4','5','6','1','2','3','sign','0','.'].map(key=>`<button type="button" data-pad-key="${key}">${key==='sign'?'±':key}</button>`).join('')}</div>
 <div class="pad-adjust"><button id="pad-keyboard" type="button"></button><button id="pad-minus" type="button"></button><button id="pad-plus" type="button"></button></div>
 <div class="pad-finish"><button id="pad-cancel" type="button"></button><button id="pad-done" class="primary" type="button"></button></div>
 <p id="pad-status" role="status" aria-live="polite"></p>`;
 host.setAttribute('role','region');host.setAttribute('aria-labelledby','pad-title');
 const $=id=>host.querySelector('#'+id),entry=$('pad-value');
 let state=null,context='',warning='',error=false;
 function draw(){
  if(!state)return;
  const field=state.fields[state.index];
  $('pad-title').textContent=t('numberPad');$('pad-context').textContent=context;
  $('pad-fields').setAttribute('aria-label',t('padChoose'));
  [...$('pad-fields').children].forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===state.index));b.firstChild.textContent=state.fields[i].short;b.lastChild.textContent=state.values[i]||'—';b.setAttribute('aria-label',state.fields[i].label()+' '+(state.values[i]||t('padEmpty'))+' '+state.fields[i].unit);});
  if(entry.value!==state.values[state.index])entry.value=state.values[state.index];
  entry.readOnly=!state.native;entry.inputMode=state.native?'decimal':'none';entry.setAttribute('aria-label',context+' · '+field.label()+' ('+field.unit+')');entry.setAttribute('aria-invalid',String(!numeric(entry.value)));
  entry.classList.toggle('replace-value',state.replace);$('pad-unit').textContent=field.unit;
  $('pad-keys').hidden=state.native;host.classList.toggle('native-entry',state.native);document.body.classList.toggle('number-native',state.native);
  $('pad-keyboard').textContent=t(state.native?'numberPad':'padKeyboard');$('pad-keyboard').setAttribute('aria-pressed',String(state.native));
  $('pad-backspace').setAttribute('aria-label',t('padBackspace'));host.querySelector('[data-pad-key="."]').setAttribute('aria-label',t('padDecimal'));host.querySelector('[data-pad-key="sign"]').setAttribute('aria-label',t('padSign'));
  $('pad-minus').textContent='−'+field.step+' '+field.unit;$('pad-plus').textContent='+'+field.step+' '+field.unit;
  $('pad-minus').setAttribute('aria-label',t('padDecrease',{step:field.step,unit:field.unit}));$('pad-plus').setAttribute('aria-label',t('padIncrease',{step:field.step,unit:field.unit}));
  $('pad-cancel').textContent=t('padCancel');$('pad-done').textContent=t('padDone');$('pad-done').disabled=!state.values.every(numeric);
  const valid=state.values.every(numeric);$('pad-status').textContent=!valid?t('numbers'):error?warning:t('padHint');$('pad-status').className=!valid||error?'error':'';
 }
 // Keep partial text in the editor, but give number inputs canonical finite values
 // (HTML number inputs otherwise discard a valid editing buffer such as "130.").
 function apply(value){state.values[state.index]=value;onInput(state.values.map(v=>numeric(v)?String(Number(v)):''));draw();}
 function key(key){
  if(!state)return;let value=state.values[state.index];
  if(key==='sign')value=value.startsWith('-')?value.slice(1):'-'+value;
  else if(key==='backspace')value=state.replace?'':value.slice(0,-1);
  else if(key==='clear')value='';
  else if(key==='.')value=state.replace?'0.':value.includes('.')?value:(value===''||value==='-'?value+'0.':value+'.');
  else if(/^\d$/.test(key))value=state.replace?key:value+key;
  else return;
  if(value.length>24)return;state.replace=false;apply(value);
 }
 function choose(index){state.index=index;state.replace=true;draw();entry.focus({preventScroll:true});if(state.native)entry.select();}
 function dismiss(){state=null;host.hidden=true;document.body.classList.remove('number-editing','number-native');}
 function finish(cancelled){if(!state||(!cancelled&&!state.values.every(numeric)))return;const source=state.fields[state.index].input;dismiss();onClose(cancelled);if(source.isConnected&&!source.disabled)source.focus({preventScroll:true});}
 function adjust(sign){if(!state)return;const n=Number(state.values[state.index]);if(!numeric(state.values[state.index]))return;state.replace=true;apply(String(Number((n+sign*state.fields[state.index].step).toFixed(10))));}
 host.querySelectorAll('[data-pad-key]').forEach(b=>b.onclick=()=>key(b.dataset.padKey));
 $('pad-backspace').onclick=()=>key('backspace');$('pad-minus').onclick=()=>adjust(-1);$('pad-plus').onclick=()=>adjust(1);
 $('pad-cancel').onclick=()=>finish(true);$('pad-done').onclick=()=>finish(false);
 $('pad-keyboard').onclick=()=>{state.native=!state.native;state.replace=true;draw();entry.focus({preventScroll:true});entry.select();if(state.native)entry.scrollIntoView({block:'nearest'});};
 entry.onclick=()=>{state.replace=true;draw();if(state.native)entry.select();};
 entry.oninput=()=>{if(!state?.native)return;state.replace=false;apply(entry.value.replace(',','.'));};
 host.addEventListener('keydown',event=>{
  if(!state||event.isComposing)return;
  if(event.key==='Escape'){event.preventDefault();finish(true);return;}
  if(event.target!==entry)return;
  if(event.key==='Enter'){event.preventDefault();finish(false);return;}
  if(state.native||event.ctrlKey||event.metaKey||event.altKey)return;
  if(entry.selectionStart===0&&entry.selectionEnd===entry.value.length&&entry.value.length)state.replace=true;
  if(event.key==='-'&&state.replace){event.preventDefault();state.replace=false;apply('-');return;}
  const mapped=event.key==='Backspace'?'backspace':event.key==='Delete'?'clear':event.key==='-'?'sign':event.key===','?'.':event.key;
  if(/^\d$/.test(mapped)||['.','sign','clear','backspace'].includes(mapped)){event.preventDefault();key(mapped);}
 });
 return {
  get active(){return !!state;},
  open(fields,index){state={fields,index,values:fields.map(f=>f.input.value),replace:true,native:false};
   $('pad-fields').replaceChildren(...fields.map((field,i)=>{const b=document.createElement('button');b.type='button';b.dataset.padField=String(i);b.append(document.createElement('span'),document.createElement('strong'));b.onclick=()=>choose(i);return b;}));
   host.hidden=false;document.body.classList.add('number-editing');draw();entry.focus({preventScroll:true});host.scrollTop=0;
  },
  update(info){({context,warning,error}=info);draw();},dismiss,
 };
}
