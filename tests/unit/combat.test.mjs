import test from 'node:test'
import assert from 'node:assert/strict'
import {SHOT_TYPES,createProjectile,sweptShotHit,applyHit,advanceProjectile,activeProjectile} from '../../game/core/combat.mjs'
test('weapon configuration has distinct speeds and damage',()=>{
 assert.ok(SHOT_TYPES.laser.speed>SHOT_TYPES.rocket.speed)
 assert.ok(SHOT_TYPES.rocket.damage>SHOT_TYPES.primary.damage)
 assert.ok(SHOT_TYPES.bomb.damage>SHOT_TYPES.primary.damage)
})
test('fast laser cannot tunnel through small enemies',()=>{
 const shot=createProjectile('laser',10,20)
 assert.equal(sweptShotHit(shot,{x:19,y:20,w:3,h:4},1/60),true)
 assert.equal(sweptShotHit(shot,{x:40,y:20,w:3,h:4},1/60),false)
})
test('damage is bounded and defeat reports once',()=>{
 const shot=createProjectile('rocket',10,20)
 assert.deepEqual(applyHit({hp:3},shot),{hp:0,destroyed:true,damage:4})
 assert.deepEqual(applyHit({hp:7},shot),{hp:3,destroyed:false,damage:4})
})
test('spent shots expire and do not survive the playfield',()=>{
 const shot=createProjectile('bomb',10,20)
 const moved=advanceProjectile(shot,1)
 assert.equal(activeProjectile(moved),true)
 assert.equal(activeProjectile(advanceProjectile(shot,4)),false)
 assert.equal(activeProjectile(createProjectile('primary',10,20)),true)
 assert.equal(activeProjectile({...shot,x:90}),false)
 for(const type of ['bomb','rocket','laser']){
  const special=createProjectile(type,10,20)
  assert.equal(activeProjectile(advanceProjectile(special,.5)),true)
 }
})
