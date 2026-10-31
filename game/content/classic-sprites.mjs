// Original, independently authored 84x48 monochrome silhouettes, informed by
// photographs of Nokia 3310 Space Impact (not copied from ROM or other games).
// '#' is an opaque LCD pixel; '.' is transparent.
export const PLAYER_SPRITE=Object.freeze([
'...##......',
'.#.###.....',
'###..##....',
'##.#######',
'###..##....',
'.#.###.....',
'...##......'
])
export const ENEMY_SPRITES=Object.freeze([
 Object.freeze(['...#.....','..###..#.','.#######.','#########','.#######.','..###..#.','...#.....']),
 Object.freeze(['..#...#..','.###.###.','#########','###.#.###','.#######.','..#.#.#..']),
 Object.freeze(['...###....','..#####...','###.#.##..','#########.','###.#.##..','..#####...','...###....'])
])
export const TERRAIN_MOTIFS=Object.freeze([
 Object.freeze([43,42,41,42,42,44,44,43,42,40,39,39,40,42,43,42,41,40,42,44,45,43,42,41]),
 Object.freeze([43,41,39,37,36,38,40,43,43,40,37,35,36,39,42,44,42,40,39,41,43,44]),
 Object.freeze([43,42,41,38,35,33,35,39,42,43,42,41,37,35,34,37,41,43,42,39,37,40]),
 Object.freeze([43,42,39,35,34,36,42,44,42,40,37,34,35,38,42,43,42,39,37,39]),
 Object.freeze([44,42,40,39,40,42,44,43,42,39,37,38,41,43,44,41,40,39,41,43]),
 Object.freeze([43,39,35,34,36,41,43,42,40,37,35,38,42,43,41,39,37,36,40,42]),
 Object.freeze([44,42,40,36,35,38,41,43,42,38,35,34,38,42,44,42,39,36,40,43]),
 Object.freeze([44,41,38,35,34,36,40,42,43,41,38,34,33,36,41,44,42,39,36,40])
])
export function spriteDimensions(rows){return {w:Math.max(...rows.map(row=>row.length)),h:rows.length}}
export function rockyTerrainY(stage,worldX){
 const motif=TERRAIN_MOTIFS[Math.max(0,Math.min(7,stage-1))]
 return motif[((Math.floor(worldX)%motif.length)+motif.length)%motif.length]
}
