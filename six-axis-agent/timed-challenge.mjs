import { HOMES, ORGANIZER } from './world.mjs?v=desk-targets-20261109-1';

// Locations are visual guides, not a score or a constraint on the arm's pose.
const shelfTop=ORGANIZER.position[2]+ORGANIZER.size[2]/2;
const shelf=(id,space)=>({id,space,support:'shelf',xy:HOMES[space].position.slice(0,2),z:shelfTop});
export const deskTargets={
  easy:[
    shelf('book','shelf-left'),
    shelf('notebook','shelf-right'),
  ],
  medium:[
    shelf('book','shelf-left'),
    shelf('notebook','shelf-middle'),
    shelf('pen','shelf-right'),
  ],
  hard:[
    {id:'book',support:'shelf',xy:[154,152],z:shelfTop},
    {id:'notebook',support:'shelf',xy:[236,150],z:shelfTop},
    {id:'pen-holder',support:'desk',xy:[160,65],z:0},
    {id:'pen',support:'desk',xy:[95,-90],z:0},
    {id:'pencil',support:'desk',xy:[105,5],z:0},
  ],
};

export function createTimedChallenge(now=()=>performance.now()){
  let level='easy';
  const recordings=new Map();
  const current=()=>recordings.get(level);
  const elapsed=(start,finish)=>Math.max(0,(finish??now())-start);
  return {
    get level(){return level;},
    get recording(){return current()?.finish===null;},
    get replaying(){return current()?.replay?.finish===null;},
    select(id){if(this.recording||this.replaying||!Object.hasOwn(deskTargets,id))return false;level=id;return true;},
    start(scene){
      if(this.recording||this.replaying)return false;
      recordings.set(level,{scene:structuredClone(scene),moves:[],start:now(),finish:null,replay:null});
      return true;
    },
    append(steps){if(this.recording&&steps.length)current().moves.push(structuredClone(steps));},
    finish(){if(this.recording)current().finish=now();},
    beginReplay(){
      const run=current();
      if(!run?.moves.length||this.recording||this.replaying)return null;
      run.replay={start:now(),finish:null,stopped:false};
      return {scene:structuredClone(run.scene),steps:structuredClone(run.moves.flat())};
    },
    endReplay({stopped=false}={}){
      if(!this.replaying)return;
      const replay=current().replay;replay.finish=now();replay.stopped=stopped;
    },
    summary(){
      const run=current(),replay=run?.replay;
      return {
        level, recording:this.recording, replaying:this.replaying,
        moves:run?.moves.length??0, attemptMs:run?elapsed(run.start,run.finish):null,
        replayMs:replay?elapsed(replay.start,replay.finish):null,
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
