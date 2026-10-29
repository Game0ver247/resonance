const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
const all=n=>[n,...n.children.flatMap(all)];
(async()=>{
 const {api,get,context,calls}=await createUI();
 assert.equal(typeof api.setSearchCategory,'function','category tabs must select their own result type');
 context.Spicetify.Platform.UserAPI={getUser:async()=>({username:'me'})};
 context.Spicetify.GraphQL={Definitions:{searchTracks:{type:'track'},searchAlbums:{type:'album'},searchPlaylists:{type:'playlist'}},Request:async(def,vars)=>{
  calls.push(['search',def.type,vars]);
  if(def.type==='playlist')return {data:{searchV2:{playlists:{items:[
   {data:{uri:'spotify:playlist:OTHER',name:'Jazz other',ownerV2:{data:{username:'other'}}}},
   {data:{uri:'spotify:playlist:MINE',name:'Jazz mine',ownerV2:{data:{username:'me'}}}},
   {data:{uri:'spotify:playlist:SPOT',name:'Jazz Spotify',ownerV2:{data:{username:'spotify'}}}}
  ],pagingInfo:{nextOffset:null}}}}};
  return {data:{searchV2:{[def.type==='track'?'tracksV2':'albumsV2']:{items:[{item:{data:{uri:'spotify:'+def.type+':ONE',name:'Jazz result'}}}],pagingInfo:{nextOffset:null}}}}};
 }};
 api.toggleSearch(true);get('search-input').value='jazz';await api.setSearchCategory('playlist');
 const names=all(get('search-results')).filter(n=>n.className==='resonance-result-name').map(n=>n.textContent);
 assert.deepEqual(names,['Jazz other','Jazz mine','Jazz Spotify']);
 context.Spicetify.Player.playUri=async uri=>calls.push(['play',uri]);
 await all(get('search-results')).find(n=>n.textContent==='Jazz mine').onclick();assert.equal(calls.at(-1)[1],'spotify:playlist:MINE');
 api.toggleSearch(true);get('search-input').value='jazz';await api.setSearchCategory('album');assert.equal(calls.filter(c=>c[0]==='search').at(-1)[1],'album');
 assert.equal(all(get('search-results')).filter(n=>n.className==='resonance-result-name').length,1);
 await api.searchArtist('The Marías');assert.equal(get('search-input').value,'The Marías');assert.equal(get('search-panel').hidden,false);assert.equal(calls.filter(c=>c[0]==='search').at(-1)[1],'track');
 // Other people's playlists are allowed when no Spotify/personal match exists.
 context.Spicetify.GraphQL.Request=async()=>({data:{searchV2:{playlists:{items:[{data:{uri:'spotify:playlist:OTHER',name:'Fan list',ownerV2:{data:{username:'fan'}}}}],pagingInfo:{nextOffset:null}}}}});
 await api.setSearchCategory('playlist');assert(all(get('search-results')).some(n=>n.textContent==='Fan list'));
 // Preferred rows beyond a filtered-out page remain reachable.
 let limits=[];context.Spicetify.GraphQL.Request=async(def,vars)=>{limits.push(vars.limit);return {data:{searchV2:{playlists:{items:Array.from({length:vars.limit},(_,i)=>({data:{uri:'spotify:playlist:P'+i,name:'List '+i,ownerV2:{data:{username:i===0||i===25?'spotify':'fan'}}}})),pagingInfo:{nextOffset:vars.limit}}}}};};
 get('search-input').value='lists';await api.runSearch('lists');await api.loadMoreSearch();assert.equal(get('search-more').hidden,false);await api.loadMoreSearch();assert(all(get('search-results')).some(n=>n.textContent==='List 25'));
 console.log('Passed: category queries, Spotify playlist result order, playlist playback and artist search');
})().catch(e=>{console.error(e);process.exitCode=1});
