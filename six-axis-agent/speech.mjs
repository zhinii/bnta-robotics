export function createSpeech({Recognition,language,onText,onState,onMessage}) {
  let session=null,active=false;
  function abort(){const previous=session;session=null;active=false;previous?.abort();onState(false);}
  function start(prefix=''){
    if(active){session?.stop();return;}
    if(!Recognition){onMessage('speechUnavailable');return;}
    const recognition=new Recognition();session=recognition;active=true;let heard=false,failed=false;
    recognition.lang=language()==='zh'?'zh-CN':'en-US';recognition.continuous=false;recognition.interimResults=true;recognition.maxAlternatives=1;
    recognition.onresult=event=>{
      if(session!==recognition)return;
      const words=Array.from(event.results).map(result=>result[0].transcript).join(' ').trim();
      if(words){heard=true;onText((prefix.trim()+' '+words).trim().slice(0,1600));}
    };
    recognition.onerror=event=>{
      if(session!==recognition)return;failed=true;
      onMessage(['not-allowed','service-not-allowed'].includes(event.error)?'speechDenied':event.error==='no-speech'?'speechEmpty':event.error==='audio-capture'?'speechDevice':'speechNetwork');
    };
    recognition.onend=()=>{if(session!==recognition)return;session=null;active=false;onState(false);if(heard&&!failed)onMessage('speechReady');};
    onState(true);
    try{recognition.start();}catch{session=null;active=false;onState(false);onMessage('speechDevice');}
  }
  return {start,abort,get active(){return active;}};
}
