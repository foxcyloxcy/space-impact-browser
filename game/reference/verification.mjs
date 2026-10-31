// Provenance schema for clean-room, stage-by-stage recreation.
// Only independently observed events may be marked verified. No ROM-derived
// image/audio data is stored here.
export const FIDELITY_STATES = Object.freeze(['unverified','approximate','verified'])
export const DISPLAY = Object.freeze({width:84,height:48,hudHeight:7})
export function validateObservation(o){
 const errors=[]
 if(!Number.isInteger(o.stage)||o.stage<1||o.stage>8)errors.push('invalid stage')
 if(!Number.isInteger(o.frame)||o.frame<0)errors.push('invalid frame')
 if(typeof o.sourceUrl!=='string'||!/^https:\/\//.test(o.sourceUrl))errors.push('source URL required')
 if(!FIDELITY_STATES.includes(o.confidence))errors.push('invalid confidence')
 if(!['enemy','terrain','boss','weapon','hud','audio','transition'].includes(o.kind))errors.push('invalid kind')
 if(typeof o.notes!=='string'||!o.notes.trim())errors.push('observation notes required')
 if(o.bounds){
  const b=o.bounds
  if(![b.x,b.y,b.w,b.h].every(Number.isFinite)||b.w<=0||b.h<=0||b.x<0||b.y<0||b.x+b.w>DISPLAY.width||b.y+b.h>DISPLAY.height)errors.push('bounds outside Nokia display')
 }
 if(o.confidence==='verified' && !o.independentReview)errors.push('verified observations need independent review')
 return errors
}
export function compareEvents(reference,actual,toleranceFrames=1){
 const missing=[],unexpected=[],matched=[]
 const available=[...actual]
 for(const expected of reference){
  const index=available.findIndex(a=>a.kind===expected.kind&&a.id===expected.id&&Math.abs(a.frame-expected.frame)<=toleranceFrames)
  if(index<0)missing.push(expected)
  else matched.push({reference:expected,actual:available.splice(index,1)[0]})
 }
 unexpected.push(...available)
 return {matched,missing,unexpected,passed:missing.length===0&&unexpected.length===0}
}
export const STAGE_EVIDENCE=Object.freeze(Array.from({length:8},(_,i)=>({
 stage:i+1,terrain:'unverified',waves:'unverified',boss:'unverified',audio:'unverified',frameFixtures:0
})))
