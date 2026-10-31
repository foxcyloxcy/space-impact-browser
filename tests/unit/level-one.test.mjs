import test from 'node:test'
import assert from 'node:assert/strict'
import {LEVEL_ONE,levelOneTerrainHeight,levelOneCeilingHeight,levelOneTerrainCollision,levelOneEnemyY,levelOneBossPosition,levelOneBossShot,timelineTicks} from '../../game/levels/level-one.mjs'
test('terrain and collision use the same deterministic coordinates',()=>{
 for(let x=0;x<84;x++){assert.ok(levelOneTerrainHeight(x)>7);assert.ok(levelOneTerrainHeight(x)<48);assert.ok(levelOneCeilingHeight(x)>=0)}
 assert.equal(levelOneTerrainCollision({x:10,y:43,w:7,h:5},0),true)
 assert.equal(levelOneTerrainCollision({x:10,y:20,w:7,h:5},0),false)
})
test('enemy trajectories repeat for the same input',()=>{assert.equal(levelOneEnemyY(18,1,1),levelOneEnemyY(18,1,1));assert.equal(levelOneEnemyY(18,0,3),18)})
test('boss attack is repeatable and aims toward player',()=>{
 const b=levelOneBossPosition(3)
 assert.deepEqual(b,levelOneBossPosition(3))
 const shot=levelOneBossShot(b,{x:8,y:35})
 assert.equal(shot.vx,-LEVEL_ONE.projectileSpeed)
 assert.ok(shot.vy>0)
})
test('time conversion is stable across repeatable recordings',()=>{assert.equal(timelineTicks(1.2),72)})
