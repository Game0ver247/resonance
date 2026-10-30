const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const {get,api,preferences,context}=await createUI();
 context.Spicetify.CosmosAsync={get:async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'Available lyrics'}]}})};
 await api.loadLyrics({title:'Available'},180000);
 assert(get('layout-options').children.some(button=>button.textContent==='Lyrics + artwork'));
 api.setLayout('karaoke'); // Preserve saved layout preferences from earlier releases.
 assert.equal(get('expanded-lyrics').hidden,false);assert.equal(get('song-summary').hidden,false);
 assert.equal(get('info').style.visibility,'hidden');assert.equal(get('summary-title').textContent,'Test');assert.equal(get('summary-artist').textContent,'Artist');
 assert.equal(preferences.get('resonance-layout'),'karaoke');
 api.toggleExpanded();assert.equal(get('root').dataset.layout,'left');assert.equal(get('expanded-lyrics').hidden,true);assert.equal(get('info').style.visibility,'visible');
 console.log('Passed: lyrics/artwork layout selection, bottom song details, saved-layout compatibility and return to artwork mode');
})().catch(error=>{console.error(error);process.exitCode=1});
