// Independently synthesized arcade feedback. No Nokia audio is imported.
// AudioContext is started only after a user interaction.
export function createAudioFeedback(){
 let audio=null
 let muted=false
 const AudioConstructor=()=>globalThis.AudioContext||globalThis.webkitAudioContext
 function unlock(){
  if(muted)return
  const Ctor=AudioConstructor()
  if(!Ctor)return
  if(!audio)audio=new Ctor()
  if(audio.state==='suspended')void audio.resume()
 }
 function tone(frequency,duration=0.07,shape='square',volume=.025,delay=0){
  if(muted)return
  try{
   unlock()
   if(!audio)return
   const osc=audio.createOscillator(),gain=audio.createGain()
   const time=audio.currentTime+delay
   osc.type=shape;osc.frequency.setValueAtTime(frequency,time)
   gain.gain.setValueAtTime(volume,time)
   gain.gain.exponentialRampToValueAtTime(.0001,time+duration)
   osc.connect(gain);gain.connect(audio.destination)
   osc.start(time);osc.stop(time+duration+.01)
  }catch{} // Browsers may deny audio in background tabs.
 }
 return {
  unlock,
  fire:()=>tone(580,.045),
  special:()=>{tone(340,.09);tone(220,.12,'square',.02,.075)},
  enemy:()=>tone(150,.075,'triangle',.03),
  damage:()=>{tone(120,.12);tone(75,.13,'square',.02,.1)},
  boss:()=>{tone(210,.12);tone(260,.12,'square',.02,.12);tone(310,.16,'square',.02,.24)},
  stage:()=>{tone(330,.08);tone(440,.08,'square',.02,.1);tone(550,.15,'square',.02,.2)},
  setMuted(value){muted=Boolean(value);if(muted&&audio?.state==='running')void audio.suspend()},
  get muted(){return muted},
  dispose(){if(audio)void audio.close();audio=null}
 }
}
