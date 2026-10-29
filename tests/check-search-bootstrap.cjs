const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const {api,context,get}=await createUI();let reads=0,queried='';
 context.fetch=async url=>{assert.equal(url,'/xpui-routes-search.js');reads++;return {ok:true,text:async()=> 'let a=new x.y("searchTracks","query","'+ 'a'.repeat(64)+'",null),b=new x.y("searchPlaylists","query","'+'b'.repeat(64)+'",null)'};};
 context.Spicetify.GraphQL={Definitions:{searchModalResults:{}},Request:async(def)=>{queried=def.name;return {data:{searchV2:{tracksV2:{items:[{item:{data:{uri:'spotify:track:ONE',name:'One'}}}],pagingInfo:{nextOffset:null}}}}};}};
 api.toggleSearch(true);get('search-input').value='music';await api.runSearch('music');assert.equal(queried,'searchTracks','lazy Spotify route must supply its category query before modal fallback');
 get('search-input').value='again';await api.runSearch('again');assert.equal(reads,1,'local route definitions loaded only once');
 console.log('Passed: lazy category definition bootstrap and one-time local source read');
})().catch(e=>{console.error(e);process.exitCode=1});
