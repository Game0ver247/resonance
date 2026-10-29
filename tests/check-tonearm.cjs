const assert=require('node:assert/strict');const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{const ui=await createUI(),{api,get}=ui;api.setArtworkMode('vinyl');
 const drawAt=(position,time)=>{ui.setProgress(position);ui.poll();return get('tonearm').style.transform;};
 const start=drawAt(0,1000);assert.equal(start,'rotate(8deg)','needle starts near outer groove');
 const middle=drawAt(90000,1100);assert.equal(middle,'rotate(18deg)');
 assert.equal(drawAt(180000,1200),'rotate(28deg)');assert.equal(drawAt(45000,1300),'rotate(13deg)','seek moves arm back to playback position');
 ui.setPaused(true);assert.equal(drawAt(45000,1400),'rotate(13deg)','pause does not park the arm');
 console.log('Passed: tonearm progress, seeking and paused position');})().catch(e=>{console.error(e);process.exitCode=1});
