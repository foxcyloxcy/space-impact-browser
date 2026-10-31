// Independently authored, deterministic Level 1 mechanics.
// Values are tunable approximations until original hardware frames are reviewed.
export const LEVEL_ONE = Object.freeze({
  scrollSpeed:5, terrainDamage:true, bossCadence:1.2,
  enemySpeed:11.5, bossHealth:25, bossY:14,
  projectileSpeed:25, bossAimFactor:.23
})
export function levelOneTerrainHeight(worldX){
  return 42-(Math.floor(worldX/11)%4)*2-(Math.floor(worldX/7)%2)
}
export function levelOneCeilingHeight(worldX){
  return Math.floor(worldX/29)%3===1 && worldX%29<8
    ? Math.max(1,4-Math.abs(worldX%29-4)):0
}
export function levelOneTerrainCollision(box,scroll){
  const left=Math.max(0,Math.floor(box.x)),right=Math.min(83,Math.ceil(box.x+box.w)-1)
  for(let x=left;x<=right;x++){
    const world=x+Math.floor(scroll)
    if(box.y+box.h>levelOneTerrainHeight(world))return true
    if(box.y<8+levelOneCeilingHeight(world)&&box.y+box.h>8&&levelOneCeilingHeight(world)>0)return true
  }
  return false
}
export function levelOneEnemyY(startY,kind,age){
  if(kind===1)return startY+Math.sin(age*5)*2
  if(kind===2)return startY+Math.sin(age*3)*3
  return startY
}
export function levelOneBossPosition(age){
  return {x:60,y:14+Math.sin(age*1.4)*7}
}
export function levelOneBossShot(boss,player){
  return {x:boss.x,y:boss.y+11,vx:-LEVEL_ONE.projectileSpeed,vy:(player.y-boss.y)*LEVEL_ONE.bossAimFactor}
}
export function timelineTicks(seconds,fps=60){return Math.round(seconds*fps)}
