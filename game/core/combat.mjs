// Standalone combat collision and projectile lifecycle for the 84x48 game.
// Values are independently authored approximations, not Nokia firmware constants.
export const SHOT_TYPES=Object.freeze({
 primary:{w:2,h:1,damage:1,speed:53,ttl:2},
 bomb:{w:3,h:3,damage:3,speed:29,ttl:4},
 rocket:{w:4,h:2,damage:4,speed:39,ttl:4},
 laser:{w:8,h:1,damage:6,speed:65,ttl:4}
})
export function shotBounds(shot){
 const t=SHOT_TYPES[shot.type]||SHOT_TYPES.primary
 return {x:shot.x,y:shot.y,w:t.w,h:t.h}
}
export function intersectsBox(a,b){
 return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y
}
export function sweptShotHit(shot,enemy,dt){
 const b=shotBounds(shot)
 // Swept AABB over the current update, preventing thin fast projectiles
 // from passing clean through an enemy at 60Hz.
 const vx=(shot.vx||0)*dt,vy=(shot.vy||0)*dt
 const swept={x:Math.min(b.x,b.x+vx),y:Math.min(b.y,b.y+vy),
  w:b.w+Math.abs(vx),h:b.h+Math.abs(vy)}
 return intersectsBox(swept,enemy)
}
export function applyHit(enemy,shot){
 const damage=(SHOT_TYPES[shot.type]||SHOT_TYPES.primary).damage
 const hp=Math.max(0,enemy.hp-damage)
 return {hp,destroyed:hp===0,damage}
}
export function createProjectile(type,x,y){
 const cfg=SHOT_TYPES[type]||SHOT_TYPES.primary
 return {x,y,vx:cfg.speed,vy:0,
  ...(type==='primary'?{}:{type,special:true}),ttl:cfg.ttl}
}
export function advanceProjectile(shot,dt){
 return {...shot,x:shot.x+shot.vx*dt,y:shot.y+shot.vy*dt,
  ttl:shot.ttl===undefined?undefined:shot.ttl-dt}
}
export function activeProjectile(shot,width=84,height=48,hud=7){
 const b=shotBounds(shot)
 return (shot.ttl===undefined||shot.ttl>0)&&b.x<width&&b.x+b.w>0&&
  b.y+b.h>hud&&b.y<height
}
