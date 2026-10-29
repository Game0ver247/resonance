const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const {api,get}=await createUI(),line=get('lyric-line');
 for(const [row,fallback] of [[null,'♪'],[{text:'♪'},'♪'],[{text:''},'♪'],[{text:'♫'},'♫'],[{text:'🎵'},'🎵']]){
  api.lyricContent(line,row,fallback);assert.equal(line.children.length,3,'all instrumental rows should use the shared note renderer');
  assert(line.children.every(note=>note.className==='resonance-interlude-note'&&note.textContent==='♪'));
  assert.equal(line.attributes['aria-label'],'Instrumental interlude');
 }
 assert.equal(get('interlude'),undefined,'a separate floating note indicator must not duplicate lyric rows');
 api.lyricContent(line,{text:'Real lyrics'},'Real lyrics');assert.equal(line.children.length?line.children.map(node=>node.textContent).join(''):line.textContent,'Real lyrics');
 console.log('Passed: consistent instrumental note glyphs for provider/empty/fallback rows, accessible labels and no duplicate floating indicator');
})().catch(error=>{console.error(error);process.exitCode=1});
