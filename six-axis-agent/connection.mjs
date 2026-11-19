// The service connection has its own request lifetime. Robot tasks never own
// these controllers; a recording or scene reset cannot disconnect the page.
export async function initializeConnection(check,{onAttempt=()=>{},attempts=3,timeoutMs=30000,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
  for(let attempt=1;attempt<=attempts;attempt++){
    onAttempt(attempt,attempts);
    const controller=new AbortController();let timer;
    try{
      return await Promise.race([
        Promise.resolve().then(()=>check(controller.signal)),
        new Promise((_,reject)=>{timer=setTimeout(()=>{reject(Error('connectionTimeout'));controller.abort();},timeoutMs);}),
      ]);
    }catch(error){
      const transient=error instanceof TypeError||['provider','connectionTimeout'].includes(error.message);
      if(!transient||attempt===attempts)throw error;
    }finally{clearTimeout(timer);}
    // Hosting verification/cold starts need a fresh attempt after a pause,
    // rather than two immediate requests followed by an abandoned startup.
    await wait(attempt*2000);
  }
}
