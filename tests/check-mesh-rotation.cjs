const assert=require('node:assert/strict');const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{const {api,get}=await createUI();assert.equal(typeof api.setMeshRotation,'function');
 const state={elapsed:0,beat:null};assert.equal(api.meshStep(state,6,0,'time'),false);assert.equal(api.meshStep(state,6,1,'time'),true);
 const beats={elapsed:0,beat:null};api.meshStep(beats,.1,0,'beats');for(let i=1;i<32;i++)assert.equal(api.meshStep(beats,.1,i,'beats'),false);assert.equal(api.meshStep(beats,.1,32,'beats'),true);
 assert.equal(api.meshStep(beats,.1,100,'beats'),false,'seeking must not rush palette changes');
 api.setMeshRotation('beats');assert.equal(get('root').dataset.meshRotation,'beats');console.log('Passed: gradual time/beat mesh cycle and seek protection');})().catch(e=>{console.error(e);process.exitCode=1});
