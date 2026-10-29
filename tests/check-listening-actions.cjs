const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
const all=n=>[n,...n.children.flatMap(all)];
(async()=>{
 const ui=await createUI(),{api,context,get,calls}=ui;
 context.Spicetify.Player.playUri=async(...args)=>calls.push(['play',...args]);
 context.Spicetify.CosmosAsync={get:async url=>url.includes('/albums/')?{name:'Chosen album',uri:'spotify:album:CHOSEN',artists:[],tracks:{items:[{uri:'spotify:track:TWO',name:'Second song',duration_ms:120000}]}}:{}};
 await api.playAlbum('spotify:album:CHOSEN');await flush();await flush();
 assert.equal(get('album-panel').hidden,false,'album click opens its drawer');
 assert(all(get('album-panel-content')).some(n=>n.textContent==='Chosen album'),'drawer uses selected album, not stale playing album');
 await all(get('album-panel-content')).find(n=>n.textContent==='Second song').onclick();
 assert.equal(calls.at(-1)[1],'spotify:album:CHOSEN');assert.equal(calls.at(-1)[3].skipTo.uri,'spotify:track:TWO');
 api.toggleSearch(true);context.Spicetify.CosmosAsync.get=async()=>({playlists:{items:[{uri:'spotify:playlist:LIST',name:'List',owner:{id:'fan'}}]}});get('search-input').value='list';await api.setSearchCategory('playlist');
 await all(get('search-results')).find(n=>n.className==='resonance-result-name').onclick();assert.equal(get('queue').hidden,false);assert.equal(calls.at(-1)[1],'spotify:playlist:LIST');
 context.Spicetify.Player.next=()=>calls.push(['next']);api.renderUpNext(175000,180000);assert.equal(get('up-next').hidden,false);get('up-next').onclick();assert.equal(calls.at(-1)[0],'next');
 console.log('Passed: selected album drawer/context track playback, playlist queue and Up Next skip');
})().catch(e=>{console.error(e);process.exitCode=1});
