import test from 'node:test'
import assert from 'node:assert/strict'
import {BOSS_PROFILES,bossProfile,bossPosition,bossProjectiles,bossSprite} from '../../game/content/bosses.mjs'
test('each of eight stages has a distinct boss sprite',()=>{
 assert.equal(BOSS_PROFILES.length,8)
 assert.equal(new Set(BOSS_PROFILES.map(x=>x.sprite.join('/'))).size,8)
 for(let i=1;i<=8;i++){
  const profile=bossProfile(i)
  assert.ok(profile.hp>0 && profile.cadence>0)
  assert.ok(profile.sprite.length>=7)
  assert.ok(profile.sprite.every(row=>row.length===9))
  assert.equal(bossSprite(i),profile.sprite)
 }
})
test('later bosses have distinct attack cadence and increasing health',()=>{
 for(let i=2;i<=8;i++)assert.ok(bossProfile(i).hp>bossProfile(i-1).hp)
 assert.ok(bossProfile(8).cadence<bossProfile(1).cadence)
})
test('boss trajectories and projectiles are reproducible',()=>{
 for(let stage=1;stage<=8;stage++){
  const pos=bossPosition(stage,2)
  assert.deepEqual(pos,bossPosition(stage,2))
  const shots=bossProjectiles(stage,pos,{x:12,y:25})
  assert.equal(shots.length,bossProfile(stage).shots)
  assert.deepEqual(shots,bossProjectiles(stage,pos,{x:12,y:25}))
 }
})
