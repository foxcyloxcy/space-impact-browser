<template>
  <main class="shell">
    <header class="heading"><div><p class="eyebrow">RETRO ARCADE / BROWSER EDITION</p><h1>SPACE IMPACT</h1><p class="sub">A closer Nokia 3310-style LCD experience: tiny pixels, classic HUD, eight stages and keypad-inspired controls.</p></div><div class="edition">NUXT / CANVAS<br>2026 EDITION</div></header>
    <section class="machine" aria-label="Space Impact game">
      <div class="screen-wrap">
        <canvas ref="canvas" width="84" height="48" aria-label="Space Impact playfield" role="img"></canvas>
        <div v-if="mode !== 'playing'" class="overlay">
          <h2>{{ mode === 'gameover' ? 'GAME OVER' : mode === 'paused' ? 'PAUSED' : mode === 'won' ? 'MISSION COMPLETE' : 'SPACE IMPACT' }}</h2>
          <p>{{ mode === 'gameover' ? 'Final score: ' + score : mode === 'won' ? 'All eight sectors cleared!' : mode === 'paused' ? 'Take a break, pilot.' : 'Eight sectors. Eight bosses. One ship.' }}</p>
          <button @click="start">{{ mode === 'paused' ? 'RESUME' : mode === 'ready' ? 'START GAME' : 'PLAY AGAIN' }}</button>
        </div>
      </div>
      <div class="toolbar"><span>BEST {{ String(best).padStart(5,'0') }}</span><span>STAGE {{ stage }}/8</span><span>NEXT {{ specialTypes[selectedSpecial] }}</span><button @click="toggleSound" :aria-label="muted ? 'Unmute sound' : 'Mute sound'">{{ muted ? 'SOUND OFF' : 'SOUND ON' }}</button><button @click="togglePause" :disabled="mode === 'ready' || mode === 'gameover' || mode === 'won'">{{ mode === 'paused' ? 'RESUME' : 'PAUSE' }}</button></div>
      <div class="pad" aria-label="Touch controls">
        <div class="dpad">
          <button class="up" aria-label="Move up" @pointerdown.prevent="press('up',$event)" @pointerup="release('up')" @pointercancel="release('up')" @pointerleave="release('up')">▲</button>
          <button class="left" aria-label="Move left" @pointerdown.prevent="press('left',$event)" @pointerup="release('left')" @pointercancel="release('left')" @pointerleave="release('left')">◀</button>
          <button class="right" aria-label="Move right" @pointerdown.prevent="press('right',$event)" @pointerup="release('right')" @pointercancel="release('right')" @pointerleave="release('right')">▶</button>
          <button class="down" aria-label="Move down" @pointerdown.prevent="press('down',$event)" @pointerup="release('down')" @pointercancel="release('down')" @pointerleave="release('down')">▼</button>
        </div>
        <div class="actions"><button aria-label="Fire primary weapon" @pointerdown.prevent="press('fire',$event)" @pointerup="release('fire')" @pointercancel="release('fire')" @pointerleave="release('fire')">FIRE</button><button aria-label="Fire limited special weapon" class="special" @pointerdown.prevent="special">SPECIAL</button></div>
      </div>
    </section>
    <footer><p><strong>Keyboard:</strong> Arrows or WASD to move · Tap Space / 1 / 3 to fire · X / 4 / 6 for special · P or Escape to pause.</p><p>Custom recreation of Nokia-era pixel graphics; original stage patterns and sound are still being researched. An unofficial fan-inspired browser project, not affiliated with Nokia.</p></footer>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { numberPixels, HUD_POSITIONS } from './game/render/pixel-font.mjs'
import { intersects, advanceStage, useSpecial, damage, fixedAdvance } from './game/core/rules.mjs'
import { STAGE_SCRIPTS, eventsDue } from './game/content/stages.mjs'
import { bossProfile, bossPosition, bossProjectiles, bossSprite } from './game/content/bosses.mjs'
import { sceneForStage, sceneryAt } from './game/content/scenery.mjs'
import { PLAYER_SPRITE, ENEMY_SPRITES, rockyTerrainY } from './game/content/classic-sprites.mjs'
import { createAudioFeedback } from './game/audio/feedback.mjs'
import { createProjectile, sweptShotHit, applyHit, activeProjectile, advanceProjectile } from './game/core/combat.mjs'
import { LEVEL_ONE, levelOneTerrainCollision, levelOneEnemyY, levelOneBossPosition, levelOneBossShot } from './game/levels/level-one.mjs'

type Actor = { x:number; y:number; w:number; h:number; hp:number; speed:number; kind?:number; phase?:number; originY?:number; age?:number; shotTimer?:number }
type Shot = { x:number; y:number; vx:number; vy:number; special?:boolean; type?:'bomb'|'rocket'|'laser'; ttl?:number }
type Drop = { x:number; y:number; kind:'life'|'ammo' }
const canvas = ref<HTMLCanvasElement|null>(null)
const mode = ref<'ready'|'playing'|'paused'|'gameover'|'won'>('ready')
const score = ref(0), best = ref(0), stage = ref(1), muted = ref(false)
const W=84,H=48, TOP=7
const held = new Set<string>()
let ctx: CanvasRenderingContext2D | null = null
let frame=0, last=0, accumulator=0, elapsed=0, spawnTimer=0, fireTimer=0, invulnerable=0, lives=3, ammo=3, bossSpawned=false, stageTime=0
let player:Actor={x:9,y:24,w:7,h:5,hp:1,speed:29}
let enemies:Actor[]=[], shots:Shot[]=[], hostile:Shot[]=[], drops:Drop[]=[]
const stars = Array.from({length:12},(_,i)=>({x:(i*23)%W,y:TOP+2+((i*11)%(H-TOP-5)),size:1}))
const audioFeedback=createAudioFeedback()
function toggleSound(){muted.value=!muted.value;audioFeedback.setMuted(muted.value)}
const specialTypes=['bomb','rocket','laser'] as const
const selectedSpecial=ref(0)
function reset() {
  held.clear();accumulator=0;selectedSpecial.value=0;score.value=0;stage.value=1; lives=3;ammo=3;player={x:9,y:24,w:7,h:5,hp:1,speed:29};stageReset();mode.value='playing'
}
function stageReset(){enemies=[];shots=[];hostile=[];drops=[];elapsed=0;spawnTimer=.7;fireTimer=0;bossSpawned=false;spawnIndex=0;stageTime=0;invulnerable=1.5}
function start(){audioFeedback.unlock();if(mode.value==='paused'){mode.value='playing';return}reset()}
function togglePause(){if(mode.value==='playing')mode.value='paused';else if(mode.value==='paused')mode.value='playing'}
function press(key:string,e?:PointerEvent){if(key==='fire'){if(mode.value==='playing')firePrimary();return}if(e?.currentTarget instanceof Element && 'setPointerCapture' in e.currentTarget){try{(e.currentTarget as Element).setPointerCapture(e.pointerId)}catch{}}held.add(key)}
function release(key:string){held.delete(key)}
function special(){
 if(mode.value!=='playing'||ammo<=0)return
 audioFeedback.special()
 ammo=useSpecial(ammo).ammo
 const type=specialTypes[selectedSpecial.value]
 shots.push(createProjectile(type,player.x+6,player.y+2))
 selectedSpecial.value=(selectedSpecial.value+1)%specialTypes.length
}
function keydown(e:KeyboardEvent){
 const map:Record<string,string>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',' ':'fire','1':'fire','3':'fire'}
 if(map[e.key]){e.preventDefault();if(map[e.key]==='fire'){if(!e.repeat && mode.value==='playing')firePrimary()}else held.add(map[e.key])}
 if(!e.repeat && ['x','X','4','6'].includes(e.key))special()
 if(!e.repeat && ['p','P','Escape'].includes(e.key))togglePause()
 if(!e.repeat && e.key==='Enter' && mode.value!=='playing')start()
}
function keyup(e:KeyboardEvent){const map:Record<string,string>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',' ':'fire','1':'fire','3':'fire'};if(map[e.key] && map[e.key]!=='fire')held.delete(map[e.key])}
function overlap(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number}){return intersects(a,b)}
function hit(){
 if(invulnerable>0)return
 const result=damage(lives,invulnerable);lives=result.lives;invulnerable=result.invulnerability
 audioFeedback.damage()
 if(lives<=0){mode.value='gameover';saveBest()}
}
function saveBest(){if(score.value>best.value){best.value=score.value;try{localStorage.setItem('space-impact-best',String(best.value))}catch{}}}
// The observed game uses authored enemy paths; these events are provisional reconstructions.
let spawnIndex=0
function enemySpawn(kind:number,y:number){
 enemies.push({x:W+3,y,w:kind===2?7:6,h:5,hp:kind===2?3:1,speed:stage.value===1?LEVEL_ONE.enemySpeed:11+stage.value*.55,kind,phase:spawnIndex*.8,originY:y,age:0})
}
function firePrimary(){
 if(mode.value!=='playing'||fireTimer>0)return
 audioFeedback.fire()
 shots.push(createProjectile('primary',player.x+7,player.y+2));fireTimer=.19
}
function bossSpawn(){
 bossSpawned=true
 enemies=enemies.filter(e=>e.x<W && e.kind!==9)
 enemies.push({x:W+3,y:14,w:stage.value===1?23:18,h:stage.value===1?25:14,hp:bossProfile(stage.value).hp,speed:7,kind:9,phase:0,age:0,shotTimer:bossProfile(stage.value).cadence})
}
function update(dt:number){
 elapsed+=dt;stageTime+=dt;invulnerable=Math.max(0,invulnerable-dt);fireTimer-=dt
 const dx=Number(held.has('right'))-Number(held.has('left')),dy=Number(held.has('down'))-Number(held.has('up'))
 const next={x:Math.max(1,Math.min(W-player.w-1,player.x+dx*player.speed*dt)),y:Math.max(TOP+1,Math.min(H-player.h-2,player.y+dy*player.speed*dt))}
 player.x=next.x;player.y=next.y
 // 3310 behavior: primary fire is tapped, not held for unlimited autofire.
 if(!bossSpawned){const due=eventsDue(stage.value,spawnIndex,stageTime);for(const event of due.events)enemySpawn(event.kind,event.y);spawnIndex=due.index}
 if(!bossSpawned && stageTime>=STAGE_SCRIPTS[stage.value-1].duration)bossSpawn()
 // Projectile collisions are checked along the full motion path below.
 hostile.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt})
 drops.forEach(d=>d.x-=35*dt)
 for(const enemy of enemies){
  enemy.phase=(enemy.phase||0)+dt
  enemy.age=(enemy.age||0)+dt
  enemy.x-=enemy.speed*dt
  if(stage.value===1 && enemy.kind!==9)enemy.y=levelOneEnemyY(enemy.originY??enemy.y,enemy.kind||0,enemy.age)
  if(stage.value!==1 && enemy.kind===1)enemy.y+=Math.sin(enemy.phase*5)*5*dt
  if(enemy.kind===9){
   const pos=stage.value===1?levelOneBossPosition(enemy.age||0):bossPosition(stage.value,enemy.age||0)
   enemy.x=pos.x;enemy.y=pos.y
   const profile=bossProfile(stage.value)
   enemy.shotTimer=(enemy.shotTimer??profile.cadence)-dt
   if(enemy.shotTimer<=0){
    hostile.push(...(stage.value===1?[levelOneBossShot(enemy,player)]:bossProjectiles(stage.value,enemy,player)))
    enemy.shotTimer+=profile.cadence
   }
  }else if(enemy.kind===2 && Math.random()<dt*.35)hostile.push({x:enemy.x,y:enemy.y+3,vx:-26,vy:0})
  if(invulnerable<=0 && overlap(player,enemy))hit()
 }
 for(const s of shots){
  // Bombs steer gently toward the closest onscreen target, retaining forward travel.
  if(s.type==='bomb'){
   const target=enemies.filter(e=>e.hp>0&&e.x>=s.x).sort((a,b)=>(a.x-s.x)-(b.x-s.x))[0]
   if(target){const delta=(target.y+target.h/2)-s.y;s.vy=Math.max(-16,Math.min(16,delta*2))}
  }
  for(const enemy of enemies){if(enemy.hp>0 && sweptShotHit(s,enemy,dt)){
   enemy.hp=applyHit(enemy,s).hp;s.x=W+100
   if(enemy.hp<=0){audioFeedback.enemy();score.value+=enemy.kind===9?500:enemy.kind===2?30:10
    if(enemy.kind!==9 && Math.random()<.085)drops.push({x:enemy.x,y:enemy.y,kind:Math.random()<.25?'life':'ammo'})
    saveBest()
   }break
  }}
 }
 for(const shot of shots){if(shot.x<=W)Object.assign(shot,advanceProjectile(shot,dt))}
 if(stage.value===1 && LEVEL_ONE.terrainDamage && levelOneTerrainCollision(player,elapsed*LEVEL_ONE.scrollSpeed))hit()
 for(const s of hostile){if(overlap({x:s.x,y:s.y,w:2,h:1},player)){hit();s.x=-100}}
 for(const d of drops){if(overlap({x:d.x,y:d.y,w:4,h:4},player)){if(d.kind==='life')lives=Math.min(3,lives+1);else ammo=Math.min(9,ammo+2);d.x=-100}}
 enemies=enemies.filter(e=>e.hp>0&&e.x+e.w>0);shots=shots.filter(s=>activeProjectile(s,W,H,TOP));hostile=hostile.filter(s=>s.x>-10&&s.y>TOP&&s.y<H);drops=drops.filter(d=>d.x>-10)
 if(bossSpawned && !enemies.some(e=>e.kind===9)){const result=advanceStage(stage.value);if(result.won){mode.value='won';audioFeedback.stage();saveBest()}else{audioFeedback.stage();stage.value=result.stage;stageReset()}}
}
function rect(x:number,y:number,w:number,h:number){ctx?.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function drawHudNumber(value:number,position:{x:number;y:number;digits:number}){for(const [px,py] of numberPixels(value,position))rect(px,py,1,1)}
function sprite(x:number,y:number,rows:readonly string[],scale=1){
 if(!ctx)return
 rows.forEach((line,j)=>{for(let i=0;i<line.length;i++)if(line[i]==='#')rect(x+i*scale,y+j*scale,scale,scale)})
}
// Level 1 is the first clean-room visual study. This silhouette is independently
// drawn and approximate, NOT extracted firmware art; the others remain placeholders.
const firstBossArt=[
'....######.............',
'..##########...........',
'.############..........',
'#######..######........',
'########..########.....',
'..##################...',
'....#####..##########..',
'...########..#########.',
'..####################.',
'.############.########.',
'#####...####..#########',
'###.....###############',
'####...#######..#######',
'.#############..######.',
'..##################...',
'....##############.....',
'.....####....####......',
'......##......##.......',
'.......##....##........',
'........######.........',
'.........####..........',
'..........##...........',
'.......................',
'.......................',
'.......................'
]
const bossArt=[
 '..######...............',
 '.#########.............',
 '####..######...........',
 '###############........',
 '..###.####..####.......',
 '....##############.....',
 '...######..########....',
 '..##########.#######...',
 '.########.######.#####.',
 '#######..#######...###.',
 '###..###########....###',
 '..########..###########',
 '...##..###..##########.',
 '..####..###########.##.',
 '...#############...##..',
 '....###.######.....##..',
 '.....######..###........',
 '.......#########........',
 '........##..###.........',
 '.........##..##.........',
 '..........####..........',
 '...........##...........',
 '...........##...........',
 '.......................',
 '.......................'
]
function drawTerrain(){
 if(!ctx)return
 const scene=sceneForStage(stage.value)
 const scroll=Math.floor(elapsed*(scene.speed||5))
 ctx.fillStyle='#17291e'
 // Sparse low polyline during the first stage and pronounced rocky peaks later.
 for(let x=0;x<W;x++){
  const world=x+scroll
  const floor=rockyTerrainY(stage.value,world)
  rect(x,floor,1,H-floor)
  if(stage.value>=3&&scene.ceiling){
   const cap=7+Math.max(0,Math.round(4*Math.abs(Math.sin(world/15+stage.value))))
   rect(x,TOP,1,cap-TOP)
  }
 }
}
function draw(){
 if(!ctx)return
 ctx.fillStyle='#91b89b';ctx.fillRect(0,0,W,H)
 ctx.fillStyle='#17291e'
 if(stage.value!==1)for(const star of stars)rect(((star.x-elapsed*(2+stage.value*.3))%W+W)%W,star.y,1,1)
 drawTerrain()
 // The original Nokia HUD uses small pictograms plus two-digit level and a five-digit score.
 ctx.fillStyle='#17291e'
 for(let i=0;i<lives;i++)sprite(1+i*5,0,['#.#','###','.#.'])
 sprite(23,1,['##','#.','##'])
 // Draw every glyph as a whole LCD pixel: never use antialiased Canvas text here.
 drawHudNumber(stage.value,HUD_POSITIONS.stage)
 rect(42,1,3,3)
 drawHudNumber(ammo,HUD_POSITIONS.ammo)
 drawHudNumber(score.value,HUD_POSITIONS.score)
 if(invulnerable===0||Math.floor(elapsed*8)%2===0)sprite(player.x,player.y,PLAYER_SPRITE)
 for(const e of enemies){if(e.kind===9)sprite(e.x,e.y,stage.value===1?firstBossArt:bossSprite(stage.value),stage.value===1?1:2);else sprite(e.x,e.y,ENEMY_SPRITES[e.kind||0])}
 for(const s of shots){if(s.type==='bomb'){ctx.strokeStyle='#17291e';ctx.strokeRect(Math.round(s.x),Math.round(s.y),3,3)}else rect(s.x,s.y,s.type==='laser'?8:s.type==='rocket'?4:2,1)}
 for(const s of hostile)rect(s.x,s.y,2,1)
 for(const d of drops){ctx.strokeStyle='#17291e';ctx.strokeRect(Math.round(d.x),Math.round(d.y),4,4);rect(d.x+1,d.y+1,2,2)}
 if(bossSpawned){const b=enemies.find(e=>e.kind===9);if(b){ctx.fillStyle='#17291e';rect(61,6,Math.max(1,Math.round(21*b.hp/bossProfile(stage.value).hp)),1)}}
}
function loop(t:number){const dt=Math.min((t-last)/1000||0,.1);last=t;if(mode.value==='playing'){const steps=fixedAdvance(accumulator,dt);accumulator=steps.accumulator;for(let i=0;i<steps.steps&&mode.value==='playing';i++)update(1/60)}else{accumulator=0}draw();frame=requestAnimationFrame(loop)}
function blur(){held.clear();if(mode.value==='playing')mode.value='paused'}
onMounted(()=>{ctx=canvas.value?.getContext('2d')||null;if(ctx)ctx.imageSmoothingEnabled=false;try{best.value=Number(localStorage.getItem('space-impact-best'))||0}catch{};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);frame=requestAnimationFrame(loop)})
onUnmounted(()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);held.clear();audioFeedback.dispose()})
</script>

<style>
:root{color-scheme:dark;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}*{box-sizing:border-box}body{margin:0;background:#0c1712;color:#d2e6ca}.shell{max-width:780px;margin:0 auto;padding:25px 20px 35px}.heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}h1{font-size:clamp(30px,6vw,58px);line-height:1;margin:9px 0;letter-spacing:.06em}.eyebrow{font-size:11px;letter-spacing:.2em;color:#a0ba96}.sub{font-size:12px;line-height:1.6;color:#a8b9a3}.edition{text-align:right;font-size:10px;line-height:1.7;white-space:nowrap;color:#93b18a}.machine{border:2px solid #4e7152;border-radius:20px;padding:18px;background:#263d30;box-shadow:0 18px 60px #0008}.screen-wrap{position:relative;overflow:hidden;border:12px solid #15291e;border-radius:9px;aspect-ratio:84/48;background:#a4c49a}.screen-wrap canvas{display:block;width:100%;height:100%;image-rendering:pixelated}.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#a4c49ae8;color:#1d3628;padding:12px}.overlay h2{font-size:clamp(20px,5vw,42px);letter-spacing:.06em;margin:0}.overlay p{font-size:clamp(9px,2vw,14px)}button{cursor:pointer;font:inherit;font-weight:800;touch-action:none}.overlay button{background:#1d3628;color:#c0d9ad;border:0;padding:12px 20px;margin-top:8px}.toolbar{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:15px 3px}.toolbar button{border:1px solid #8eae87;border-radius:5px;background:transparent;color:inherit;padding:7px 12px}.toolbar button:disabled{opacity:.4}.pad{display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:130px}.dpad{display:grid;grid-template-columns:repeat(3,43px);grid-template-rows:repeat(3,38px);gap:3px}.dpad button,.actions button{border:1px solid #8baa88;background:#14261b;color:#c4e5b8;border-radius:8px;user-select:none;-webkit-user-select:none}.dpad button:active,.actions button:active{background:#527453}.up{grid-column:2;grid-row:1}.left{grid-column:1;grid-row:2}.right{grid-column:3;grid-row:2}.down{grid-column:2;grid-row:3}.actions{display:flex;gap:10px}.actions button{width:88px;height:64px}.actions .special{border-color:#d1c28e;color:#efe0a0}footer{font-size:11px;line-height:1.7;color:#a1b39f;margin-top:17px}footer p{margin:8px 0}@media(min-width:800px){.machine{padding:25px 35px}.pad{justify-content:space-around}}@media(max-width:470px){.shell{padding:15px 10px}.edition{display:none}.machine{padding:9px;border-radius:12px}.screen-wrap{border-width:6px}.actions{gap:5px}.actions button{width:65px;height:56px;font-size:10px}.toolbar{font-size:10px}.dpad{grid-template-columns:repeat(3,36px);grid-template-rows:repeat(3,34px)}}
</style>