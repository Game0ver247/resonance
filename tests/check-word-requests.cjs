const assert=require('node:assert/strict');const {createUI,flush}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,context,get}=ui;let title='Old',resolveOld,better=0;
 const rows=text=>[{text,start:1000,end:4000,words:[{text,start:1000,end:4000}]}];
 context.Spicetify.CosmosAsync={get:async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{words:title,startTimeMs:'1000',endTimeMs:'4000'}]}})};
 context.ResonanceLyrics.ttml=input=>rows(input);
 context.fetch=async url=>{if(url.includes('betterlyrics')){better++;if(url.includes('s=Old'))return new Promise(resolve=>{resolveOld=resolve});return {ok:true,json:async()=>({ttml:'New'})};}return {ok:false,status:404};};
 ui.setURI('spotify:track:OLD');const old=api.loadLyrics({title:'Old'},180000);await flush();title='New';ui.setURI('spotify:track:NEW');await api.loadLyrics({title:'New'},180000);
 resolveOld({ok:true,json:async()=>({ttml:'Old'})});await old;ui.setProgress(2000);api.drawLyrics();assert.equal(get('lyric-line').children.map(n=>n.textContent).join(''),'New','old provider response cannot overwrite replacement track');
 const count=better;await api.loadLyrics({title:'New'},180000);assert.equal(better,count,'repeat polling must not refetch timing');
 // A rate-limited provider is not called on the next track during cooldown.
 title='Limit';context.fetch=async url=>{if(url.includes('betterlyrics')){better++;return {ok:false,status:429,headers:{get:()=> '120'}};}return {ok:false,status:404};};
 ui.setURI('spotify:track:LIMIT');await api.loadLyrics({title:'Limit'},180000);const limited=better;
 ui.setURI('spotify:track:NEXT');await api.loadLyrics({title:'Next'},180000);assert.equal(better,limited,'honor provider rate-limit cooldown');
 console.log('Passed: late timing dismissal, bounded requests/cache and provider cooldown');
})().catch(e=>{console.error(e);process.exitCode=1});
