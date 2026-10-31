import test from 'node:test'
import assert from 'node:assert/strict'
import {STAGE_SCRIPTS,eventsDue} from '../../game/content/stages.mjs'
test('eight documented stage scripts have ordered events',()=>{
 assert.equal(STAGE_SCRIPTS.length,8)
 for(const stage of STAGE_SCRIPTS){assert.ok(stage.duration>0);assert.ok(stage.events.length>0);for(let i=1;i<stage.events.length;i++)assert.ok(stage.events[i][0]>stage.events[i-1][0]);assert.ok(stage.events.at(-1)[0]<stage.duration)}
})
test('due events fire exactly once when indexed',()=>{
 const first=eventsDue(1,0,12)
 assert.equal(first.events.length,3)
 const same=eventsDue(1,first.index,12)
 assert.equal(same.events.length,0)
 assert.equal(eventsDue(1,same.index,200).index,STAGE_SCRIPTS[0].events.length)
})
