const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
const all=node=>[node,...node.children.flatMap(all)];
(async()=>{
 const ui=await createUI(),{api,get,context,calls}=ui;ui.setAlbumURI('spotify:album:CURRENT');ui.poll();
 context.Spicetify.Player.playUri=async uri=>calls.push(['play',uri]);context.Spicetify.Platform.History={push:route=>calls.push(['navigate',route])};
 await get('album').onclick();assert.deepEqual(calls.at(-1),['play','spotify:album:CURRENT']);
 await get('summary-album').onclick();assert.deepEqual(calls.at(-1),['play','spotify:album:CURRENT']);
 context.Spicetify.CosmosAsync={get:async()=>({name:'Current album',uri:'spotify:album:CURRENT',artists:[],tracks:{items:[]}})};
 api.toggleAlbumDetails();await flush();await flush();const heading=all(get('album-panel-content')).find(node=>node.className==='resonance-album-title-play');assert(heading);await heading.onclick();assert.deepEqual(calls.at(-1),['play','spotify:album:CURRENT']);
 await all(get('album-panel-content')).find(node=>node.id==='resonance-album-open').onclick();assert.deepEqual(calls.at(-1),['play','spotify:album:CURRENT']);
 api.toggleSearch(true);context.Spicetify.CosmosAsync.get=async()=>({albums:{items:[{uri:'spotify:album:SEARCHED',name:'Searched album'}]}});get('search-input').value='searched';await api.setSearchCategory('album');
 const result=all(get('search-results')).find(node=>node.className==='resonance-result-name');await result.onclick();assert.deepEqual(calls.at(-1),['play','spotify:album:SEARCHED']);
 assert(!calls.some(call=>call[0]==='navigate'),'album clicks should play the album context, not navigate');
 context.Spicetify.Player.playUri=async()=>{throw Error('offline')};await api.playAlbum('spotify:album:FAIL');assert.match(get('status').textContent,/album/);
 console.log('Passed: album-context playback from title, bottom summary, about title/action and search, plus failure feedback');
})().catch(error=>{console.error(error);process.exitCode=1});
