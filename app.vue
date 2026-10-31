<template>
  <main class="shell">
    <header class="heading"><div><p class="eyebrow">RETRO ARCADE / BROWSER EDITION</p><h1>SPACE IMPACT</h1><p class="sub">A monochrome, side-scrolling space shooter inspired by the classic feature-phone game.</p></div><div class="edition">NUXT / CANVAS<br>2026 EDITION</div></header>
    <section class="machine" aria-label="Space Impact game">
      <div class="screen-wrap">
        <canvas ref="canvas" width="320" height="200" aria-label="Space Impact playfield" role="img"></canvas>
        <div v-if="mode !== 'playing'" class="overlay">
          <h2>{{ mode === 'gameover' ? 'GAME OVER' : mode === 'paused' ? 'PAUSED' : mode === 'won' ? 'MISSION COMPLETE' : 'SPACE IMPACT' }}</h2>
          <p>{{ mode === 'gameover' ? 'Final score: ' + score : mode === 'won' ? 'All eight sectors cleared!' : mode === 'paused' ? 'Take a break, pilot.' : 'Eight sectors. Eight bosses. One ship.' }}</p>
          <button @click="start">{{ mode === 'paused' ? 'RESUME' : mode === 'ready' ? 'START GAME' : 'PLAY AGAIN' }}</button>
        </div>
      </div>
      <div class="toolbar"><span>BEST {{ String(best).padStart(5,'0') }}</span><span>STAGE {{ stage }}/8</span><button @click="togglePause" :disabled="mode === 'ready' || mode === 'gameover' || mode === 'won'">{{ mode === 'paused' ? 'RESUME' : 'PAUSE' }}</button></div>
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
    <footer><p><strong>Keyboard:</strong> Arrows or WASD to move · Space / 1 / 3 to fire · X / 4 / 6 for special · P or Escape to pause.</p><p>Original pixel-style art and gameplay implementation. An unofficial fan-inspired browser project, not affiliated with Nokia.</p></footer>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Actor = { x:number; y:number; w:number; h:number; hp:number; speed:number; kind?:number; phase?:number }
type Shot = { x:number; y:number; vx:number; vy:number; special?:boolean }
type Drop = { x:number; y:number; kind:'life'|'ammo' }
const canvas = ref<HTMLCanvasElement|null>(null)
const mode = ref<'ready'|'playing'|'paused'|'gameover'|'won'>('ready')
const score = ref(0), best = ref(0), stage = ref(1)
const W=320,H=200, TOP=20
const held = new Set<string>()
let ctx: CanvasRenderingContext2D | null = null
let frame=0, last=0, elapsed=0, spawnTimer=0, fireTimer=0, invulnerable=0, lives=3, ammo=3, bossSpawned=false, stageTime=0
let player:Actor={x:28,y:99,w:12,h:9,hp:1,speed:105}
let enemies:Actor[]=[], shots:Shot[]=[], hostile:Shot[]=[], drops:Drop[]=[]
const stars = Array.from({length:35},(_,i)=>({x:(i*83)%W,y:TOP+((i*47)%(H-TOP)),size:i%4===0?2:1}))
const themes=['DUST','ORBIT','CRATER','VOID','ASTEROID','NEBULA','ECLIPSE','CORE']
function reset() {
  score.value=0;stage.value=1; lives=3;ammo=3;player={x:28,y:99,w:12,h:9,hp:1,speed:105};stageReset();mode.value='playing'
}
function stageReset(){enemies=[];shots=[];hostile=[];drops=[];elapsed=0;spawnTimer=.7;fireTimer=0;bossSpawned=false;stageTime=0;invulnerable=1.5}
function start(){if(mode.value==='paused'){mode.value='playing';return}reset()}
function togglePause(){if(mode.value==='playing')mode.value='paused';else if(mode.value==='paused')mode.value='playing'}
function press(key:string,e?:PointerEvent){if(e?.currentTarget instanceof Element && 'setPointerCapture' in e.currentTarget) (e.currentTarget as Element).setPointerCapture(e.pointerId);held.add(key)}
function release(key:string){held.delete(key)}
function special(){
 if(mode.value!=='playing'||ammo<=0)return
 ammo--
 for(const offset of [-.35,0,.35])shots.push({x:player.x+11,y:player.y+4,vx:190,vy:offset*190,special:true})
}
function keydown(e:KeyboardEvent){
 const map:Record<string,string>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',' ':'fire','1':'fire','3':'fire'}
 if(map[e.key]){e.preventDefault();held.add(map[e.key])}
 if(!e.repeat && ['x','X','4','6'].includes(e.key))special()
 if(!e.repeat && ['p','P','Escape'].includes(e.key))togglePause()
 if(!e.repeat && e.key==='Enter' && mode.value!=='playing')start()
}
function keyup(e:KeyboardEvent){const map:Record<string,string>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',' ':'fire','1':'fire','3':'fire'};if(map[e.key])held.delete(map[e.key])}
function overlap(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number}){return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y}
function hit(){
 if(invulnerable>0)return
 lives--;invulnerable=1.8
 if(lives<=0){mode.value='gameover';saveBest()}
}
function saveBest(){if(score.value>best.value){best.value=score.value;try{localStorage.setItem('space-impact-best',String(best.value))}catch{}}}
function enemySpawn(){const kind=Math.floor(Math.random()*3);const y=TOP+12+Math.random()*(H-TOP-28);enemies.push({x:W+12,y,w:kind===2?16:12,h:kind===2?13:9,hp:kind===2?3:1,speed:35+stage.value*5+Math.random()*12,kind,phase:Math.random()*6})}
function bossSpawn(){bossSpawned=true;enemies.push({x:W+10,y:85,w:43,h:36,hp:18+stage.value*7,speed:25,kind:9,phase:0})}
function update(dt:number){
 elapsed+=dt;stageTime+=dt;invulnerable=Math.max(0,invulnerable-dt);fireTimer-=dt
 const dx=Number(held.has('right'))-Number(held.has('left')),dy=Number(held.has('down'))-Number(held.has('up'))
 player.x=Math.max(2,Math.min(W-player.w-2,player.x+dx*player.speed*dt))
 player.y=Math.max(TOP+2,Math.min(H-player.h-2,player.y+dy*player.speed*dt))
 if(held.has('fire') && fireTimer<=0){shots.push({x:player.x+12,y:player.y+4,vx:185,vy:0});fireTimer=.16}
 if(!bossSpawned && stageTime<23){spawnTimer-=dt;if(spawnTimer<=0){enemySpawn();spawnTimer=Math.max(.42,1.2-stage.value*.065)}}
 if(!bossSpawned && stageTime>=23)bossSpawn()
 shots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt})
 hostile.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt})
 drops.forEach(d=>d.x-=35*dt)
 for(const enemy of enemies){
  enemy.phase=(enemy.phase||0)+dt
  enemy.x-=enemy.speed*dt
  if(enemy.kind===1)enemy.y+=Math.sin(enemy.phase*5)*18*dt
  if(enemy.kind===9){enemy.x=Math.max(263,enemy.x);enemy.y=90+Math.sin(enemy.phase*1.4)*49
   if(Math.random()<dt*(.7+stage.value*.12))hostile.push({x:enemy.x,y:enemy.y+18,vx:-76-stage.value*4,vy:(player.y-enemy.y)*.27})
  }else if(enemy.kind===2 && Math.random()<dt*.35)hostile.push({x:enemy.x,y:enemy.y+5,vx:-85,vy:0})
  if(invulnerable<=0 && overlap(player,enemy))hit()
 }
 for(const s of shots){
  for(const enemy of enemies){if(enemy.hp>0 && overlap({x:s.x,y:s.y,w:s.special?6:4,h:s.special?4:2},enemy)){
   enemy.hp-=s.special?4:1;s.x=W+100
   if(enemy.hp<=0){score.value+=enemy.kind===9?500:enemy.kind===2?30:10
    if(enemy.kind!==9 && Math.random()<.085)drops.push({x:enemy.x,y:enemy.y,kind:Math.random()<.25?'life':'ammo'})
    saveBest()
   }break
  }}
 }
 for(const s of hostile){if(overlap({x:s.x,y:s.y,w:4,h:3},player)){hit();s.x=-100}}
 for(const d of drops){if(overlap({x:d.x,y:d.y,w:9,h:9},player)){if(d.kind==='life')lives=Math.min(5,lives+1);else ammo=Math.min(9,ammo+2);d.x=-100}}
 enemies=enemies.filter(e=>e.hp>0&&e.x+e.w>0);shots=shots.filter(s=>s.x<W+10&&s.y>TOP&&s.y<H);hostile=hostile.filter(s=>s.x>-10&&s.y>TOP&&s.y<H);drops=drops.filter(d=>d.x>-10)
 if(bossSpawned && !enemies.some(e=>e.kind===9)){if(stage.value===8){mode.value='won';saveBest()}else{stage.value++;stageReset()}}
}
function rect(x:number,y:number,w:number,h:number){ctx?.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
function sprite(x:number,y:number,rows:string[],scale=1){if(!ctx)return;rows.forEach((line,j)=>{for(let i=0;i<line.length;i++)if(line[i]==='#')rect(x+i*scale,y+j*scale,scale,scale)})}
const ship=['...##....','..####...','########.','#########','..####...','...##....']
const alien=['..##..##..','.########.','##########','##.####.##','...#..#...']
function draw(){
 if(!ctx)return
 ctx.fillStyle='#a4c49a';ctx.fillRect(0,0,W,H)
 ctx.fillStyle='#1d3628'
 for(const star of stars)rect((star.x-elapsed*(7+stage.value*2)*(star.size===2?1.5:1)+W*100)%W,star.y,star.size,star.size)
 // Ground silhouette for recognizable scrolling terrain
 for(let x=0;x<W;x+=3){const v=Math.sin((x+elapsed*20)/24)*7+Math.sin((x+elapsed*20)/10)*3;rect(x,H-7-v,3,8+v)}
 ctx.fillStyle='#1d3628';rect(0,0,W,TOP);ctx.fillStyle='#a4c49a'
 ctx.font='bold 9px monospace';ctx.fillText('♥'.repeat(lives),5,13);ctx.fillText('W '+String(stage.value).padStart(2,'0'),82,13);ctx.fillText('S '+ammo,144,13);ctx.fillText(String(score.value).padStart(5,'0'),270,13)
 if(invulnerable===0||Math.floor(elapsed*8)%2===0){ctx.fillStyle='#1d3628';sprite(player.x,player.y,ship,1.5)}
 ctx.fillStyle='#1d3628'
 for(const e of enemies){if(e.kind===9){sprite(e.x,e.y,['..########..','.##########.','############','###..##..###','############','..##.##.##..','...######...','..##....##..'],3)}else sprite(e.x,e.y,alien,e.w/10)}
 for(const s of shots)rect(s.x,s.y,s.special?7:5,s.special?3:2)
 for(const s of hostile)rect(s.x,s.y,4,3)
 for(const d of drops){ctx.strokeStyle='#1d3628';ctx.strokeRect(d.x,d.y,9,9);ctx.fillText(d.kind==='life'?'+':'S',d.x+2,d.y+7)}
 if(bossSpawned){const b=enemies.find(e=>e.kind===9);if(b){rect(92,17,135,2);ctx.fillStyle='#a4c49a';rect(93,17,133*(b.hp/(18+stage.value*7)),2)}}
}
function loop(t:number){const dt=Math.min((t-last)/1000||0,.05);last=t;if(mode.value==='playing')update(dt);draw();frame=requestAnimationFrame(loop)}
function blur(){held.clear();if(mode.value==='playing')mode.value='paused'}
onMounted(()=>{ctx=canvas.value?.getContext('2d')||null;if(ctx)ctx.imageSmoothingEnabled=false;try{best.value=Number(localStorage.getItem('space-impact-best'))||0}catch{};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);frame=requestAnimationFrame(loop)})
onUnmounted(()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);held.clear()})
</script>

<style>
:root{color-scheme:dark;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}*{box-sizing:border-box}body{margin:0;background:#0c1712;color:#d2e6ca}.shell{max-width:900px;margin:0 auto;padding:25px 20px 35px}.heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}h1{font-size:clamp(30px,6vw,58px);line-height:1;margin:9px 0;letter-spacing:.06em}.eyebrow{font-size:11px;letter-spacing:.2em;color:#a0ba96}.sub{font-size:12px;line-height:1.6;color:#a8b9a3}.edition{text-align:right;font-size:10px;line-height:1.7;white-space:nowrap;color:#93b18a}.machine{border:2px solid #4e7152;border-radius:20px;padding:18px;background:#263d30;box-shadow:0 18px 60px #0008}.screen-wrap{position:relative;overflow:hidden;border:12px solid #15291e;border-radius:9px;aspect-ratio:8/5;background:#a4c49a}.screen-wrap canvas{display:block;width:100%;height:100%;image-rendering:pixelated}.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#a4c49ae8;color:#1d3628;padding:12px}.overlay h2{font-size:clamp(20px,5vw,42px);letter-spacing:.06em;margin:0}.overlay p{font-size:clamp(9px,2vw,14px)}button{cursor:pointer;font:inherit;font-weight:800;touch-action:none}.overlay button{background:#1d3628;color:#c0d9ad;border:0;padding:12px 20px;margin-top:8px}.toolbar{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:15px 3px}.toolbar button{border:1px solid #8eae87;border-radius:5px;background:transparent;color:inherit;padding:7px 12px}.toolbar button:disabled{opacity:.4}.pad{display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:130px}.dpad{display:grid;grid-template-columns:repeat(3,43px);grid-template-rows:repeat(3,38px);gap:3px}.dpad button,.actions button{border:1px solid #8baa88;background:#14261b;color:#c4e5b8;border-radius:8px;user-select:none;-webkit-user-select:none}.dpad button:active,.actions button:active{background:#527453}.up{grid-column:2;grid-row:1}.left{grid-column:1;grid-row:2}.right{grid-column:3;grid-row:2}.down{grid-column:2;grid-row:3}.actions{display:flex;gap:10px}.actions button{width:88px;height:64px}.actions .special{border-color:#d1c28e;color:#efe0a0}footer{font-size:11px;line-height:1.7;color:#a1b39f;margin-top:17px}footer p{margin:8px 0}@media(min-width:800px){.machine{padding:25px 35px}.pad{justify-content:space-around}}@media(max-width:470px){.shell{padding:15px 10px}.edition{display:none}.machine{padding:9px;border-radius:12px}.screen-wrap{border-width:6px}.actions{gap:5px}.actions button{width:65px;height:56px;font-size:10px}.toolbar{font-size:10px}.dpad{grid-template-columns:repeat(3,36px);grid-template-rows:repeat(3,34px)}}
</style>