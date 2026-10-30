const assert=require('node:assert/strict');const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,context,get}=ui;
 assert.equal(get('expand-lyrics'),undefined,'layout selection belongs in settings, not beneath lyrics');
 context.Spicetify.CosmosAsync={get:async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'A real lyric'}]}})};
 await api.loadLyrics({title:'Fixture'},180000);api.drawLyrics();
 assert.equal(get('lyric-note').textContent,'','provider information is off by default');
 assert.equal(get('lyric-note').hidden,true);
 get('lyric-source-options').children.find(b=>b.dataset.value==='on').onclick();
 assert.equal(get('lyric-note').textContent,'Spotify','only provider name, without sync/interlude labels');
 assert.equal(get('lyric-note').hidden,false);assert.equal(ui.preferences.get('resonance-lyric-source'),'on');
 get('lyric-source-options').children.find(b=>b.dataset.value==='off').onclick();
 assert.equal(get('lyric-note').textContent,'');assert.equal(get('lyric-note').hidden,true);
 api.setLayout('karaoke');assert.equal(get('expanded-lyrics').hidden,false,'combined view remains available in layout settings');
 console.log('Passed: no inline layout shortcut; source hidden by default, optional provider-only label and saved preference');
})().catch(error=>{console.error(error);process.exitCode=1});
