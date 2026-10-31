// Audited reference status: stage wave timing is a reconstruction placeholder.
// These stage definitions are deliberately data-driven so footage observations can replace
// individual events without modifying the game loop. They are NOT transcribed Nokia ROM data.
export const STAGE_SCRIPTS = Object.freeze([
  {scene:'surface',duration:76,events:[[3,0,12],[7,1,23],[11,0,30],[15,2,18],[19,0,10],[23,1,26],[27,2,32],[31,0,14],[35,1,20],[39,2,30],[44,0,18],[49,1,11],[54,2,25],[59,0,33],[64,1,17]]},
  {scene:'surface',duration:52,events:[[2,1,14],[6,0,26],[10,2,31],[14,1,11],[18,0,22],[22,2,16],[27,1,28],[32,0,13],[37,2,30],[42,1,19]]},
  {scene:'cavern',duration:64,events:[[3,2,29],[7,1,12],[12,0,22],[17,2,30],[22,1,18],[27,0,11],[33,2,28],[39,1,23],[45,2,13],[52,0,31]]},
  {scene:'cavern',duration:83,events:[[3,1,24],[9,2,13],[15,0,30],[21,1,17],[27,2,26],[33,0,12],[40,1,32],[47,2,19],[55,0,28],[63,1,13],[71,2,25]]},
  {scene:'surface',duration:104,events:[[3,0,14],[9,1,30],[15,2,19],[21,0,26],[27,1,12],[33,2,31],[40,0,20],[48,1,27],[56,2,15],[64,0,30],[73,1,18],[82,2,26],[91,1,12]]},
  {scene:'cavern',duration:80,events:[[2,2,26],[8,1,12],[14,2,31],[20,0,18],[26,1,24],[32,2,11],[39,0,28],[46,1,18],[53,2,29],[60,0,14],[68,2,23]]},
  {scene:'cavern',duration:86,events:[[3,2,20],[9,2,31],[15,1,12],[21,0,24],[28,2,17],[35,1,29],[42,2,12],[49,0,25],[56,1,16],[64,2,30],[73,2,19]]},
  {scene:'final',duration:25,events:[[2,2,30],[6,1,14],[10,0,27],[14,2,20],[19,1,12]]}
])
export function eventsDue(stage,index,elapsed){
 const data=STAGE_SCRIPTS[stage-1]
 const due=[]
 if(!data)return {events:due,index}
 while(index<data.events.length && elapsed>=data.events[index][0]){
  const [time,kind,y]=data.events[index]
  due.push({time,kind,y})
  index++
 }
 return {events:due,index}
}
