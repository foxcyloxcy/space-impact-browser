// Level 1: a clean-room, evidence-informed approximation.
// A published retrospective describes a largely blank first-stage background and
// a vertically moving boss near the right edge. Numerical tuning is unverified.
// Source: https://www.sohu.com/a/815236246_492137
export const LEVEL_ONE = Object.freeze({
  scrollSpeed:0, terrainDamage:false, bossCadence:2.1,
  enemySpeed:11.5, bossHealth:25, bossY:14,
  projectileSpeed:25, bossAimFactor:.23
})
export function levelOneTerrainHeight(_worldX){return 48}
export function levelOneCeilingHeight(_worldX){return 0}
export function levelOneTerrainCollision(_box,_scroll){return false}
export function levelOneEnemyY(startY,kind,age){
  if(kind===1)return startY+Math.sin(age*5)*2
  if(kind===2)return startY+Math.sin(age*3)*3
  return startY
}
export function levelOneBossPosition(age){return {x:60,y:14+Math.sin(age*1.4)*7}}
export function levelOneBossShot(boss,player){
  return {x:boss.x,y:boss.y+11,vx:-LEVEL_ONE.projectileSpeed,vy:(player.y-boss.y)*LEVEL_ONE.bossAimFactor}
}
export function timelineTicks(seconds,fps=60){return Math.round(seconds*fps)}
