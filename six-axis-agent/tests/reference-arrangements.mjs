const transfer=(object,target,posture)=>({type:'transfer',object,target,...(posture?{posture}:{})});
const right=(object,distance)=>({type:'shift',object,direction:'right',distance,unit:'mm'});

// The reference images show the result of these checked moves from the reset desk.
export const referenceArrangements={
  easy:[
    transfer('book','shelf-left'),
    transfer('notebook','shelf-right'),
  ],
  medium:[
    transfer('book','shelf-left','short-edge'),
    transfer('notebook','shelf-right'),
    transfer('pen','pen-holder'),
  ],
  hard:[
    transfer('notebook','shelf-left','spine'),
    transfer('book','shelf-right','face-down'),
    right('pen-holder',20),
    transfer('pencil','pen-holder'),
    right('pen',20),
    {type:'shift',object:'pen',direction:'back',distance:30,unit:'mm'},
    {...transfer('pen','current'),orientation:[0,0,90]},
  ],
};
