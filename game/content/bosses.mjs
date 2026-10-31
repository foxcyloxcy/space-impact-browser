// Eight distinct independent boss designs for the playable browser adaptation.
// NOT ROM sprites or verified representations of original Nokia boss artwork.
const SHAPES=[
 ['..###....','########.','##.######','#########','.##.##.##','..#####..','...#.#...'],
 ['.##.##...','########.','##.##.###','#########','###..####','.######..','..#..#...'],
 ['..#####..','.#######.','##.#.#.##','#########','###.#.###','.#######.','##.###.##'],
 ['.#.....#.','###...###','#########','##.###.##','#########','###...###','.#.....#.'],
 ['...###...','.#######.','#########','###.#.###','#########','.##.#.##.','..#...#..'],
 ['##.....##','#########','.#######.','###.#.###','#########','.#.###.#.','##.....##'],
 ['...###...','.##.#.##.','#########','##.###.##','#########','###...###','..##.##..'],
 ['##.###.##','#########','.#######.','#########','##.###.##','#########','##.....##']
]
const SETTINGS=[
 {hp:25,speed:1.4,cadence:2.1,shots:1,pattern:'aim'},
 {hp:32,speed:1.7,cadence:1.8,shots:2,pattern:'spread'},
 {hp:37,speed:1.1,cadence:1.7,shots:1,pattern:'aim'},
 {hp:44,speed:1.8,cadence:1.5,shots:3,pattern:'spread'},
 {hp:49,speed:1.3,cadence:1.5,shots:2,pattern:'spread'},
 {hp:55,speed:2.0,cadence:1.25,shots:3,pattern:'spread'},
 {hp:62,speed:1.6,cadence:1.2,shots:2,pattern:'aim'},
 {hp:75,speed:2.3,cadence:.9,shots:3,pattern:'spread'}
]
export const BOSS_PROFILES=Object.freeze(SETTINGS.map((s,i)=>Object.freeze({...s,id:i+1,sprite:Object.freeze(SHAPES[i]),w:18,h:21})))
export function bossProfile(stage){return BOSS_PROFILES[Math.max(0,Math.min(7,stage-1))]}
export function bossPosition(stage,age){
 const b=bossProfile(stage)
 return {x:63+Math.sin(age*.5)*2,y:17+Math.sin(age*b.speed)*Math.min(9,4+stage)}
}
export function bossProjectiles(stage,boss,player){
 const b=bossProfile(stage)
 const aim=Math.max(-15,Math.min(15,(player.y-(boss.y+10))*.3))
 return Array.from({length:b.shots},(_,i)=>({
  x:boss.x,y:boss.y+10,vx:-22-stage*1.3,
  vy:aim+(b.pattern==='spread'?(i-(b.shots-1)/2)*8:0)
 }))
}
export function bossSprite(stage){return bossProfile(stage).sprite}
