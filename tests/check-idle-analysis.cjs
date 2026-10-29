const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,context}=ui;let requests=0;
 context.Spicetify.getAudioData=async()=>{requests++;return {segments:[],beats:[],sections:[]}};
 api.setVisualStyle('off');api.setBeatUI('off');api.setArtworkMode('cover');
 ui.setURI('spotify:track:QUIET');ui.poll();await flush();assert.equal(requests,0,'no visual consumers should mean no analysis requests');
 api.setVisualStyle('waves');ui.poll();await flush();assert.equal(requests,1,'enabling a consumer lazily requests current analysis');
 console.log('Passed: unused track analysis skipped and lazily loaded when visual effects return');
})().catch(e=>{console.error(e);process.exitCode=1});
