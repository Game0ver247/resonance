const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,get,context,timeouts}=ui;
 const expire=async(before)=>{await flush();const timer=timeouts.slice(before).find(t=>t.ms===7000);assert(timer,'Spotify operation must have a deadline');timer.fn();await flush();};
 context.Spicetify.Platform.LibraryAPI.contains=()=>new Promise(()=>{});
 ui.setURI('spotify:track:STALL');let before=timeouts.length;ui.poll();await expire(before);assert.equal(get('like').disabled,false,'timed-out library check must release heart');
 context.Spicetify.Player.setShuffle=()=>new Promise(()=>{});before=timeouts.length;const shuffle=get('shuffle').onclick();await expire(before);await shuffle;assert.equal(get('shuffle').disabled,false);
 context.Spicetify.Player.setRepeat=()=>new Promise(()=>{});before=timeouts.length;const repeat=get('repeat').onclick();await expire(before);await repeat;assert.equal(get('repeat').disabled,false);
 console.log('Passed: stalled library lookup, shuffle and repeat release controls after deadline');
})().catch(e=>{console.error(e);process.exitCode=1});
