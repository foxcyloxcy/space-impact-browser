import test from 'node:test'
import assert from 'node:assert/strict'
import {PLAYER_SPRITE,ENEMY_SPRITES,TERRAIN_MOTIFS,spriteDimensions,rockyTerrainY} from '../../game/content/classic-sprites.mjs'
test('classic player silhouette fits LCD and has an extended forward nose',()=>{
 assert.deepEqual(spriteDimensions(PLAYER_SPRITE),{w:11,h:7})
 assert.equal(PLAYER_SPRITE[3].at(-1),'#')
 assert.ok(PLAYER_SPRITE.every(row=>/^[.#]+$/.test(row)))
})
test('three varied enemy silhouettes remain within sprite hitboxes',()=>{
 assert.equal(ENEMY_SPRITES.length,3)
 assert.equal(new Set(ENEMY_SPRITES.map(rows=>rows.join('|'))).size,3)
 for(const rows of ENEMY_SPRITES){const d=spriteDimensions(rows);assert.ok(d.w<=9&&d.h<=7)}
})
test('rocky terrain is consistently bounded and wraps in every stage',()=>{
 assert.equal(TERRAIN_MOTIFS.length,8)
 for(let stage=1;stage<=8;stage++){
  const motif=TERRAIN_MOTIFS[stage-1]
  for(let x=-30;x<100;x++)assert.equal(rockyTerrainY(stage,x),rockyTerrainY(stage,x+motif.length))
  assert.ok(motif.every(y=>y>=33&&y<=45))
 }
})
