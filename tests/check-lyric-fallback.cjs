const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,get,context}=ui;
 api.setLayout('karaoke');context.Spicetify.CosmosAsync={get:async()=>({})};
 ui.setURI('spotify:track:MISSING');await api.loadLyrics({title:'No words'},180000);api.drawLyrics();
 assert.equal(get('root').dataset.layout,'left','missing lyrics should use artwork layout');
 assert.equal(get('info').style.visibility,'visible');assert.match(get('lyric-note').textContent,/unavailable|instrumental/i);
 assert.equal(ui.preferences.get('resonance-layout'),'karaoke','fallback must preserve preferred layout');
 ui.setURI('spotify:track:WORDS');context.Spicetify.CosmosAsync.get=async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'Lyrics are back'},{startTimeMs:'10000',words:'Another line'}]}});
 await api.loadLyrics({title:'Words'},180000);api.drawLyrics();assert.equal(get('root').dataset.layout,'karaoke');
 api.setLyricStyle('off');let requests=0;context.Spicetify.CosmosAsync.get=async()=>{requests++;return {}};
 ui.setURI('spotify:track:OFF');ui.poll();assert.equal(requests,0,'disabled lyrics must not fetch lyrics');
 console.log('Passed: no-lyrics artwork fallback, message, preference restoration and disabled lyric loading');
})().catch(e=>{console.error(e);process.exitCode=1});
