const assert=require('node:assert/strict');
const {createUI,flush}=require('./helpers/ui-harness.cjs');
const settle=async()=>{for(let i=0;i<8;i++)await flush();};
(async()=>{
 // A failed analysis request must not be remembered as "no analysis" for that track.
 {const ui=await createUI(),{api,context}=ui;let requests=0,fail=true;
  context.Spicetify.getAudioData=async()=>{requests++;if(fail)throw Error('Analysis timeout');return {track:{tempo:100},segments:[{start:0,duration:1,loudness_max:-10}],beats:[],sections:[]};};
  ui.setURI('spotify:track:RETRY');await api.loadAnalysis();ui.setURI('spotify:track:OTHER');await api.loadAnalysis();
  fail=false;ui.setURI('spotify:track:RETRY');await api.loadAnalysis();assert.equal(requests,3,'a track whose analysis failed should be requested again later');
  ui.setURI('spotify:track:OTHER');await api.loadAnalysis();ui.setURI('spotify:track:RETRY');await api.loadAnalysis();assert.equal(requests,4,'successful analysis stays cached');}
 // Definite "no lyrics" answers are remembered briefly; timeouts and server errors are not.
 {const ui=await createUI(),{api,context}=ui;let spotify=0,lrclib=0,status=404;
  context.Spicetify.CosmosAsync={get:async()=>{spotify++;return {lyrics:{syncType:'UNSYNCED',lines:[]}};}};
  context.fetch=async()=>{lrclib++;return {ok:false,status};};
  const visit=async uri=>{ui.setURI(uri);await api.loadLyrics({title:'Song '+uri},180000);};
  await visit('spotify:track:NOLYR');await visit('spotify:track:OTHER');await visit('spotify:track:NOLYR');
  assert.equal(spotify,2,'definite no-lyrics results should not be re-requested on revisit');assert.equal(lrclib,2);
  status=500;spotify=lrclib=0;
  await visit('spotify:track:ERR');await visit('spotify:track:OTHER2');await visit('spotify:track:ERR');
  assert.equal(lrclib,3,'server errors must stay retryable');}
 // Album background: remember a verified "none" per album, retry after failures.
 {const ui=await createUI(),{api,get,context}=ui;let wiki=0,ok=true;
  context.fetch=async url=>{if(/wikipedia/.test(url)){wiki++;return ok?{ok:true,json:async()=>({query:{pages:{}}})}:{ok:false,status:503};}return {ok:false,status:404};};
  context.Spicetify.CosmosAsync={get:async()=>({})};
  get('album-panel').hidden=false;ui.setAlbumURI('spotify:album:A1');
  for(const uri of ['spotify:track:ONE','spotify:track:TWO','spotify:track:THREE']){ui.setURI(uri);api.loadAlbumDetails();await settle();}
  assert.equal(wiki,1,'one Wikipedia lookup per album when nothing was found');
  ok=false;wiki=0;ui.setAlbumURI('spotify:album:A2');
  for(const uri of ['spotify:track:FOUR','spotify:track:FIVE']){ui.setURI(uri);api.loadAlbumDetails();await settle();}
  assert.equal(wiki,2,'failed lookups must be retried');}
 // Resolved error payloads are failures even when the transport reports success.
 {const ui=await createUI(),{api,context}=ui;let requests=0;
  context.Spicetify.CosmosAsync={get:async()=>{requests++;return {code:500,error:'server_error'};}};
  context.fetch=async()=>({ok:false,status:404});
  for(const uri of ['spotify:track:ERRORA','spotify:track:ERRORB','spotify:track:ERRORA']){ui.setURI(uri);await api.loadLyrics({title:'Error'},180000);}
  assert.equal(requests,3,'resolved Spotify errors must not become negative lyric cache entries');}
 {const ui=await createUI(),{api,get,context}=ui;let requests=0;
  context.fetch=async()=>{requests++;return {ok:true,json:async()=>({error:{code:'maxlag'}})};};
  context.Spicetify.CosmosAsync={get:async()=>({})};get('album-panel').hidden=false;ui.setAlbumURI('spotify:album:WIKIERROR');
  for(const uri of ['spotify:track:W1','spotify:track:W2']){ui.setURI(uri);api.loadAlbumDetails();await settle();}
  assert.equal(requests,2,'Wikipedia application errors must remain retryable');}
 console.log('Passed: failed analysis retries, definite no-lyrics and no-background answers cached, transient failures retried');
})().catch(e=>{console.error(e);process.exitCode=1});
