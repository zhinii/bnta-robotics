const levels=['easy','medium','hard'];

export function createTimedChallenge(now=()=>performance.now()){
  let level='easy';
  const recordings=new Map();
  const current=()=>recordings.get(level);
  const elapsed=(start,finish)=>Math.max(0,(finish??now())-start);
  return {
    get level(){return level;},
    get recording(){return current()?.finish===null;},
    get replaying(){return current()?.replay?.finish===null;},
    get paused(){return this.replaying&&current().replay.paused;},
    select(id){if(this.recording||this.replaying||!levels.includes(id))return false;level=id;return true;},
    start(scene){
      if(this.recording||this.replaying)return false;
      recordings.set(level,{scene:structuredClone(scene),finalScene:null,moves:[],totalMs:0,start:now(),solveMs:0,finish:null,replay:null});
      return true;
    },
    append(steps){
      if(!this.recording||!steps.length)return;
      current().moves.push(structuredClone(steps));
      current().totalMs+=steps.reduce((ms,step)=>ms+(step.seconds??(step.type==='preshape'?.08:0))*1000,0);
    },
    finish(scene){
      if(!this.recording)return;
      const run=current();run.finish=now();
      if(scene)run.finalScene=structuredClone(scene);
    },
    savedScene(){return structuredClone(current()?.finalScene??null);},
    edit(){
      const run=current();
      if(!run?.finalScene||this.recording||this.replaying)return null;
      run.solveMs+=elapsed(run.start,run.finish);
      run.start=now();run.finish=null;run.replay=null;
      return structuredClone(run.finalScene);
    },
    clear(){if(this.recording||this.replaying)return false;recordings.delete(level);return true;},
    beginReplay(){
      const run=current();
      if(!run?.moves.length||this.recording||this.replaying)return null;
      run.replay={finish:null,stopped:false,paused:false,elapsed:0,command:1};
      return {scene:structuredClone(run.scene),steps:structuredClone(run.moves.flat()),commands:structuredClone(run.moves)};
    },
    pauseReplay(){if(this.replaying)current().replay.paused=!current().replay.paused;},
    replayCommand(command){if(this.replaying)current().replay.command=command;},
    advanceReplay(ms){if(this.replaying&&!this.paused)current().replay.elapsed=Math.min(current().totalMs,current().replay.elapsed+Math.max(0,ms));},
    endReplay({stopped=false}={}){
      if(!this.replaying)return;
      const replay=current().replay;replay.finish=now();replay.stopped=stopped;replay.paused=false;
      if(!stopped)replay.elapsed=current().totalMs;
    },
    summary(){
      const run=current(),replay=run?.replay;
      return {
        level, recording:this.recording, replaying:this.replaying, paused:this.paused,
        moves:run?.moves.length??0, attemptMs:run?run.solveMs+elapsed(run.start,run.finish):null,
        replayMs:replay?.elapsed??null, totalMs:run?.totalMs??0,command:replay?.command??0,
        canEdit:!!run?.finalScene&&!this.recording&&!this.replaying,
        replayComplete:!!replay&&replay.finish!==null&&!replay.stopped,replayStopped:replay?.stopped??false,
      };
    },
  };
}

export function formatChallengeTime(ms){
  if(ms===null)return '—';
  const tenths=Math.floor(ms/100);
  return `${String(Math.floor(tenths/600)).padStart(2,'0')}:${String(Math.floor(tenths/10)%60).padStart(2,'0')}.${tenths%10}`;
}
