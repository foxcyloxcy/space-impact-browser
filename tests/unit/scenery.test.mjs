import test from 'node:test'
import assert from 'node:assert/strict'
import {SCENES,sceneForStage,sceneryAt} from '../../game/content/scenery.mjs'
test('all eight scenes are distinct and fit the Nokia playfield',()=>{
 assert.equal(SCENES.length,8)
 assert.equal(new Set(SCENES.map(x=>x.id)).size,8)
 for(let stage=1;stage<=8;stage++){
  assert.equal(sceneForStage(stage),SCENES[stage-1])
  for(let x=0;x<300;x+=7){
   const t=sceneryAt(stage,x)
   assert.ok(t.floor>=34 && t.floor<=48)
   assert.ok(t.ceiling>=7 && t.ceiling<=16)
   assert.ok(t.floor>t.ceiling)
   assert.deepEqual(t,sceneryAt(stage,x))
  }
 }
})
test('level one maintains the historically indicated open background',()=>{
 assert.equal(sceneForStage(1).floor,false)
 assert.deepEqual(sceneryAt(1,50),{floor:48,ceiling:7})
})
