import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,snapshot,objectLocation,shelfSpace,shelfCandidates,relativeBounds} from '../world.mjs';
import {askAgent,spatialReply,SYSTEM} from '../agent.mjs';
import {objectBounds,objectShapes,objectGeometry} from '../shapes.mjs';
import {at,overlaps,xyz} from '../collision.mjs';

test('live support facts distinguish desk, shelf, stacked objects, held items and holder contents',()=>{
 const s=initialState(0,'desk'),book=s.objects.find(o=>o.id==='book'),notebook=s.objects.find(o=>o.id==='notebook'),holder=s.objects.find(o=>o.container),pencil=s.objects.find(o=>o.id==='pencil');
 assert.equal(objectLocation(s,book).location,'desk');assert.equal(shelfSpace(s,book),null);
 book.position=[245,160,37];assert.deepEqual(objectLocation(s,book),{location:'shelf',support:'organizer',onShelf:true});
 notebook.position=[245,160,56];assert.deepEqual(objectLocation(s,notebook),{location:'on-object',support:'book',onShelf:true});
 holder.position=[145,160,50];pencil.position=[137,152,76];pencil.rpy=[90,0,0];
 assert.deepEqual(objectLocation(s,pencil),{location:'inside-holder',support:'pen-holder',onShelf:true});
 s.held='notebook';assert.deepEqual(objectLocation(s,notebook),{location:'gripper',support:null,onShelf:false});
});

test('surface clearances measure actual transformed item edges and the nearest blocker',()=>{
 const s=initialState(0,'desk'),book=s.objects.find(o=>o.id==='book'),holder=s.objects.find(o=>o.container);
 book.position=[245,160,37];assert.deepEqual(shelfSpace(s,book).front,{mm:21,blocker:'shelf-edge'});
 book.rpy=[0,0,90];book.position=[245,185,37];holder.position=[245,141,50];
 assert.deepEqual(shelfSpace(s,book).front,{mm:5.5,blocker:'pen-holder'});
 holder.position[0]=140;assert.deepEqual(shelfSpace(s,book).front,{mm:57,blocker:'shelf-edge'});
 const facts=snapshot(s).objects.find(o=>o.id==='book');assert.equal(facts.onShelf,true);assert.deepEqual(facts.bounds,objectBounds(book));
});

test('the exact screenshot question uses current measurements despite stale history, without calling the model',async()=>{
 const s=initialState(0,'desk');s.objects.find(o=>o.id==='book').position=[245,160,37];
 const scene=snapshot(s),question='how much space is in front of the red book on the shelf, the front being the edge closest to the computer';
 const answer=await askAgent({hosted:true},{question,language:'en',scene,history:[{role:'assistant',content:'The red book is on the desk.'}]},undefined,()=>{throw Error('must not call model');});
 assert.deepEqual(answer.actions,[]);assert.match(answer.reply,/red book is on the shelf/);assert.match(answer.reply,/21 mm \(2.1 cm\)/);assert.match(answer.reply,/toward the laptop/);
 s.objects.find(o=>o.id==='book').position=[245,150,37];assert.match(spatialReply(question,snapshot(s)).reply,/11 mm/);
 assert.match(spatialReply('红色书本前方有多少空间',snapshot(s),'zh').reply,/11 毫米/);
 assert.equal(spatialReply('put the red book in the first available space',scene),null,'an instruction is not a measurement question');
 assert.match(SYSTEM,/CURRENT location, support and onShelf/);assert.ok(SYSTEM.length<12000);
 assert.ok(JSON.stringify({question,language:'en',scene}).length<12000,'the relay accepts the full live scene envelope');
});

test('shelf candidates include a narrow clear front strip beyond the former three fixed rows',()=>{
 const s=initialState(0,'desk'),book=s.objects.find(o=>o.id==='book'),blocker=s.objects.find(o=>o.id==='notebook'),orientation=[90,0,0];
 blocker.size=[220,78,20];blocker.position=[230,171,38];s.objects=s.objects.filter(o=>['book','notebook'].includes(o.id));
 const geometry=objectGeometry(book),bounds=relativeBounds(book,orientation),clear=shelfCandidates(s,book,orientation).filter(([x,y])=>!at(geometry,[x,y,28-bounds.low[2]],xyz(orientation)).some(a=>objectShapes(blocker).some(b=>overlaps(a,b,.5))));
 assert.ok(clear.length>0);assert.ok(clear.every(([,y])=>y<132),'only the front strip is free');
 assert.ok(clear.some(([,y])=>Math.abs(y-121)<.01),'a shelf-edge candidate fills the clear strip');
 assert.ok(clear.every(([x,y])=>x+bounds.low[0]>=122&&x+bounds.high[0]<=338&&y+bounds.low[1]>=112&&y+bounds.high[1]<=208));
});
