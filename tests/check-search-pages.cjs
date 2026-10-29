const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
const all=node=>[node,...node.children.flatMap(all)];
(async()=>{
 const ui=await createUI(),{context,api,get,calls}=ui;let requests=0,resolveMore;
 context.Spicetify.Player.playUri=async uri=>calls.push(['play',uri]);
 context.Spicetify.Platform.History={push:route=>calls.push(['route',route])};
 context.Spicetify.GraphQL={Definitions:{searchModalResults:{}},Request:async(def,vars)=>{
  requests++;
  return {data:{searchV2:{topResultsV2:{itemsV2:Array.from({length:vars.numberOfTopResults},(_,i)=>({item:{data:{uri:'spotify:'+(i===0?'album':'track')+':ITEM'+i,name:'Result '+i}}}))}}}};
 }};
 api.toggleSearch(true);get('search-input').value='music';await api.runSearch('music');assert.equal(get('search-results').children.length,6);
 const first=get('search-results').children[0];await first.onclick({target:first});assert.equal(calls.at(-1)[1],'spotify:album:ITEM0');get('launch').onclick();api.toggleSearch(true);get('search-input').value='music';await api.runSearch('music');
 const initialRequests=requests;get('search-results').scrollTop=260;get('search-results').clientHeight=300;get('search-results').scrollHeight=600;
 await get('search-results').onscroll();assert(requests>initialRequests);assert(get('search-results').children.length>6);assert.equal(new Set(get('search-results').children.map(row=>all(row).find(n=>n.className==='resonance-result-name').textContent)).size,get('search-results').children.length);
 const pending=api.loadMoreSearch();const count=requests;await api.loadMoreSearch();assert.equal(requests,count,'only one pagination request at once');await pending;
 // Late pages must not reopen a closed panel or append results.
 context.Spicetify.GraphQL.Request=()=>new Promise(resolve=>{resolveMore=resolve});const late=api.loadMoreSearch();api.toggleSearch(false);resolveMore({data:{searchV2:{topResultsV2:{itemsV2:[{item:{data:{uri:'spotify:track:LATE',name:'Late'}}}]}}}});await late;assert.equal(get('search-results').children.length,0);
 console.log('Passed: lazy search expansion, deduplication, album-row playback, serialized requests and stale-page dismissal');
})().catch(error=>{console.error(error);process.exitCode=1});
