import test from 'node:test'
import assert from 'node:assert/strict'
import {WORLD,STAGE_COUNT,intersects,playerWithinBounds,advanceStage,damage,useSpecial,nextFireTimer,makeRandom,fixedAdvance} from '../../game/core/rules.mjs'
test('world and level baseline',()=>{assert.equal(WORLD.width,84);assert.equal(STAGE_COUNT,8)})
test('clamps player inside visible playfield',()=>{assert.deepEqual(playerWithinBounds(-50,-50),{x:1,y:8});assert.deepEqual(playerWithinBounds(999,999),{x:76,y:41})})
test('AABB collision excludes only-touching edges',()=>{assert.equal(intersects({x:0,y:0,w:10,h:10},{x:10,y:0,w:2,h:2}),false);assert.equal(intersects({x:0,y:0,w:10,h:10},{x:9,y:9,w:2,h:2}),true)})
test('lives decrement once per invulnerability window',()=>{const first=damage(3,0);assert.deepEqual(first,{lives:2,invulnerability:1.8});assert.deepEqual(damage(first.lives,first.invulnerability),first)})
test('special consumes one charge only when available',()=>{assert.deepEqual(useSpecial(1),{ammo:0,fired:true});assert.deepEqual(useSpecial(0),{ammo:0,fired:false})})
test('fire cooldown prevents excess shots',()=>{assert.equal(nextFireTimer(true,0).fired,true);assert.equal(nextFireTimer(true,.1).fired,false);assert.equal(nextFireTimer(false,-.1).fired,false)})
test('bosses advance and final stage wins without stage nine',()=>{assert.deepEqual(advanceStage(7),{stage:8,won:false});assert.deepEqual(advanceStage(8),{stage:8,won:true})})
test('seeded random sequence repeats deterministically',()=>{let a=makeRandom(42),b=makeRandom(42);assert.deepEqual(Array.from({length:10},a),Array.from({length:10},b))})
test('fixed step caps catch-up after tab inactivity',()=>{assert.equal(fixedAdvance(0,5).steps,5);assert.equal(fixedAdvance(0,1/30).steps,2)})
