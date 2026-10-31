import test from 'node:test'
import assert from 'node:assert/strict'
import {validateObservation,compareEvents,STAGE_EVIDENCE,DISPLAY} from '../../game/reference/verification.mjs'
test('all eight original stages require independent evidence',()=>{
 assert.equal(STAGE_EVIDENCE.length,8)
 assert.ok(STAGE_EVIDENCE.every(s=>s.frameFixtures===0&&s.waves==='unverified'))
 assert.deepEqual(DISPLAY,{width:84,height:48,hudHeight:7})
})
test('reject unsourced or unreviewed exactness claims',()=>{
 const o={stage:1,frame:12,sourceUrl:'https://example.org/video',confidence:'verified',kind:'enemy',notes:'Observed entering from the right',bounds:{x:70,y:16,w:7,h:5}}
 assert.deepEqual(validateObservation(o),['verified observations need independent review'])
 assert.deepEqual(validateObservation({...o,independentReview:true}),[])
 assert.ok(validateObservation({...o,bounds:{x:82,y:3,w:7,h:5}}).length)
})
test('detect extra/missing events without silently accepting incorrect sequences',()=>{
 const a=[{kind:'enemy',id:'alpha',frame:100},{kind:'boss',id:'boss-1',frame:900}]
 assert.equal(compareEvents(a,[{kind:'enemy',id:'alpha',frame:101},{kind:'boss',id:'boss-1',frame:900}]).passed,true)
 assert.equal(compareEvents(a,[{kind:'enemy',id:'alpha',frame:120}]).passed,false)
})
