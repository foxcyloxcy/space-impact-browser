import test from 'node:test'
import assert from 'node:assert/strict'
import {DIGITS,HUD_POSITIONS,numberPixels} from '../../game/render/pixel-font.mjs'

test('all ten LCD digits are unique integer-aligned 3x5 bitmaps',()=>{
 assert.equal(Object.keys(DIGITS).length,10)
 assert.equal(new Set(Object.values(DIGITS).map(rows=>rows.join('/'))).size,10)
 for(const rows of Object.values(DIGITS)){
  assert.equal(rows.length,5)
  assert.ok(rows.every(row=>row.length===3&&/^[.#]+$/.test(row)))
 }
})
test('score, level, and ammo occupy separate readable HUD regions',()=>{
 const regions=[
  numberPixels(8,HUD_POSITIONS.stage),
  numberPixels(3,HUD_POSITIONS.ammo),
  numberPixels(80,HUD_POSITIONS.score)
 ]
 const used=new Set()
 for(const region of regions)for(const [x,y] of region){
  assert.ok(Number.isInteger(x)&&Number.isInteger(y))
  assert.ok(x>=0&&x<84&&y>=0&&y<7)
  const key=`${x},${y}`
  assert.ok(!used.has(key),'HUD digits overlap at '+key)
  used.add(key)
 }
 assert.equal(Math.max(...regions[2].map(([x])=>x)),80)
})
test('numbers keep leading zeros, and depleted special displays 0',()=>{
 const zero=numberPixels(0,HUD_POSITIONS.ammo)
 assert.ok(zero.length>0)
 const scoreZero=numberPixels(0,HUD_POSITIONS.score)
 const scoreOne=numberPixels(1,HUD_POSITIONS.score)
 assert.notDeepEqual(scoreZero,scoreOne)
 const max=numberPixels(99999,HUD_POSITIONS.score)
 assert.equal(Math.max(...max.map(([x])=>x)),80)
 assert.deepEqual(numberPixels(100000,HUD_POSITIONS.score),scoreZero)
})
