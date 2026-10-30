const assert=require('node:assert/strict');const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,context,get}=ui;let requests=[],status=401;
 context.Spicetify.CosmosAsync={get:async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{words:'Hello world',startTimeMs:'1000',endTimeMs:'4000'}]}})};
 const qq='<QrcInfos><LyricInfo><Lyric_1 LyricContent="[1000,3000]Hello (1000,1000)world(2500,1500)"/></LyricInfo></QrcInfos>';
 context.fetch=async url=>{requests.push(url);if(url.includes('/qq/getLyrics'))return {ok:true,status:200,json:async()=>({provider:'qq',lyrics:qq})};return {ok:false,status,headers:{get:()=> '120'}};};
 ui.setURI('spotify:track:QQONE');await api.loadLyrics({title:'One'},180000);ui.setProgress(1500);api.drawLyrics();
 assert.match(get('lyric-note').textContent,/QQ.*Word sync/,'TTML authorization failure must still yield QQ word timing');
 assert.equal(get('lyric-line').children.length,2);
 ui.setURI('spotify:track:QQTWO');await api.loadLyrics({title:'Two'},180000);
 assert.equal(requests.filter(u=>u.includes('/getLyrics?')&&!u.includes('/qq/')).length,2,'401 for one query cannot suppress cached TTML for another song');
 status=429;requests=[];ui.setURI('spotify:track:LIMIT');await api.loadLyrics({title:'Limit'},180000);
 assert.equal(requests.filter(u=>u.includes('/qq/')).length,0,'429 shared service limit blocks QQ too');
 console.log('Passed: QQ fallback after 401, per-query auth and shared rate limit');
})().catch(e=>{console.error(e);process.exitCode=1});
