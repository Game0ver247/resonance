const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');

async function dragCannotSeekReplacementTrack(){
 const ui=await createUI(),bar=ui.get('track');
 bar.onpointerdown();bar.value='90000';bar.oninput();
 ui.setURI('spotify:track:REPLACEMENT');ui.poll();await flush();
 bar.value='90000';bar.oninput();await bar.onchange();
 assert.equal(ui.calls.filter(c=>c[0]==='seek').length,0,'an old drag must not seek the replacement track after polling');
 bar.onpointerdown();bar.value='30000';bar.oninput();await bar.onchange();
 assert.equal(ui.calls.filter(c=>c[0]==='seek').at(-1)[1],30000,'a fresh drag must work');
}
async function canceledDragCannotCommitOnBlur(){
 const ui=await createUI(),bar=ui.get('track');bar.onpointerdown();bar.value='90000';bar.oninput();bar.onblur();await bar.onchange();
 assert.equal(ui.calls.filter(c=>c[0]==='seek').length,0,'blur must cancel the pending drag');
}
async function staleInstrumentalCannotContaminateNewTrack(){
 const ui=await createUI();ui.context.Spicetify.CosmosAsync={get:async()=>{throw Error('Unavailable')}};
 const pending=new Map();ui.context.fetch=async url=>new Promise(resolve=>pending.set(new URLSearchParams(String(url).split('?')[1]).get('track_name'),resolve));
 ui.setURI('spotify:track:RACEA');const a=ui.api.loadLyrics({title:'Race A'},180000);await flush();
 ui.setURI('spotify:track:RACEB');const b=ui.api.loadLyrics({title:'Race B'},180000);await flush();
 pending.get('Race A')({ok:true,json:async()=>({instrumental:true,trackName:'Race A',duration:180})});await a;
 pending.get('Race B')({ok:false});await b;ui.get('lyric-line').animate=undefined;ui.api.drawLyrics();
 assert.equal(ui.get('lyric-line').textContent,'Synced lyrics unavailable for this song');
}
async function firstHeartClickWaitsForKnownLibraryState(){
 const ui=await createUI();let resolveCheck;
 ui.context.Spicetify.Platform.LibraryAPI.contains=()=>new Promise(resolve=>{resolveCheck=resolve});
 ui.setURI('spotify:track:HEARTUNKNOWN');ui.poll();await flush();
 const click=ui.get('like').onclick();await flush();
 assert.equal(ui.calls.filter(c=>c[0]==='save'||c[0]==='remove').length,0,'do not assume an unknown song is unsaved');
 resolveCheck([true]);await click;
 assert.equal(ui.calls.filter(c=>c[0]==='remove').length,1,'a saved song should be removed, not added again');
 assert.equal(ui.get('like').attributes['aria-pressed'],'false');
}
async function staleLibraryCheckCannotUndoSuccessfulSave(){
 const ui=await createUI();let resolveCheck;
 // The opening refresh may race a mutation on an already-known track.
 ui.context.Spicetify.Platform.LibraryAPI.contains=()=>new Promise(resolve=>{resolveCheck=resolve});
 ui.get('launch').onclick();await flush();await ui.get('like').onclick();
 assert.equal(ui.saved(),true);resolveCheck([false]);await flush();
 assert.equal(ui.get('like').attributes['aria-pressed'],'true');
 await ui.get('like').onclick();assert.equal(ui.calls.filter(c=>c[0]==='remove').length,1);
}
async function escapeClosesSettingsBeforeListeningView(){
 const ui=await createUI();ui.get('themes').hidden=true;ui.get('brand').onclick();assert.equal(ui.get('themes').hidden,false);
 ui.pressKey('Escape');assert.equal(ui.get('themes').hidden,true);assert.equal(ui.get('root').hidden,false,'Escape should dismiss settings before closing the whole view');
 ui.pressKey('Escape');assert.equal(ui.get('root').hidden,true);
}
async function heartLookupCanRetryAfterSynchronousFailure(){
 const ui=await createUI();ui.context.Spicetify.Platform.LibraryAPI.contains=()=>{throw Error('Unavailable')};
 ui.setURI('spotify:track:HEARTRETRY');ui.poll();await flush();
 ui.context.Spicetify.Platform.LibraryAPI.contains=async()=>[false];await ui.get('like').onclick();
 assert.equal(ui.calls.filter(c=>c[0]==='save').length,1,'retry should perform a fresh lookup after a synchronous failure');
}
const tests={heartLookupCanRetryAfterSynchronousFailure,escapeClosesSettingsBeforeListeningView,dragCannotSeekReplacementTrack,canceledDragCannotCommitOnBlur,staleInstrumentalCannotContaminateNewTrack,firstHeartClickWaitsForKnownLibraryState,staleLibraryCheckCannotUndoSuccessfulSave};
(async()=>{let failures=0;for(const [name,test] of Object.entries(tests)){try{await test();console.log('PASS '+name)}catch(error){failures++;console.error('FAIL '+name+': '+error.message)}}if(failures)process.exitCode=1;})();
