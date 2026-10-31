// Framework-independent gameplay rules shared by browser code and Node tests.
export const WORLD = Object.freeze({width:84,height:48,hud:7})
export const STAGE_COUNT = 8
export const START_LIVES = 3
export const START_SPECIAL = 3
export const FIRE_INTERVAL = 0.16
export const INVULNERABILITY_SECONDS = 1.8
export function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
export function intersects(a,b){return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y}
export function playerWithinBounds(x,y,w=7,h=5){return {x:clamp(x,1,WORLD.width-w-1),y:clamp(y,WORLD.hud+1,WORLD.height-h-2)}}
export function advanceStage(current){return current>=STAGE_COUNT?{stage:STAGE_COUNT,won:true}:{stage:current+1,won:false}}
export function canTakeDamage(lives,invulnerability){return lives>0 && invulnerability<=0}
export function damage(lives,invulnerability){return canTakeDamage(lives,invulnerability)?{lives:lives-1,invulnerability:INVULNERABILITY_SECONDS}:{lives,invulnerability}}
export function useSpecial(ammo){return ammo>0?{ammo:ammo-1,fired:true}:{ammo,fired:false}}
export function nextFireTimer(fireHeld,timer){return fireHeld && timer<=0 ? {fired:true,timer:FIRE_INTERVAL}:{fired:false,timer}}
export function makeRandom(seed=1){let state=seed>>>0;return ()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296}}
export function fixedAdvance(accumulator,delta,step=1/60,maxSteps=5){let left=Math.min(accumulator+Math.max(0,delta),step*maxSteps),steps=0;while(left>=step-1e-10 && steps<maxSteps){steps++;left-=step}return {steps,accumulator:Math.max(0,left)}}
