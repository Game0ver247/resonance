const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../lyrics-engine.js'),'utf8'),context);const engine=context.ResonanceLyrics;
let rows=engine.lrc('[00:01.00]<00:01.00>One <00:01.70>two\n[00:03.00]\n[00:04.00]Longer line here',8000);
assert.equal(rows[0].text,'One two');assert.equal(rows[0].words,undefined);
assert.equal(engine.active(rows,900).line,-1);assert.equal(engine.active(rows,1750).line,0);assert.equal(engine.active(rows,3200).line,1);assert.equal(engine.active(rows,8100).line,-1);
rows=engine.spotify({lyrics:{syncType:'SYLLABLE_SYNCED',lines:[{startTimeMs:'1000',endTimeMs:'3000',words:'Hello world',syllables:[{startTimeMs:'1000',numChars:3},{startTimeMs:'1200',numChars:3},{startTimeMs:'2000',numChars:5}]}]}},4000);
assert.equal(rows[0].text,'Hello world');assert.equal(rows[0].words,undefined);assert.equal(engine.active(rows,2100).line,0);assert.equal(engine.active(rows,3000).line,-1);
assert.equal(engine.spotify({lyrics:{syncType:'UNSYNCED',lines:[]}},2000).length,0);
rows=engine.finalize([{start:1000,text:'Synthetic test line'},{start:20000,text:'Other line'}],30000);assert.equal(engine.active(rows,15000).line,-1);
console.log('Passed: enhanced-LRC text preservation, syllable-provider line support, line-only timing, seek boundaries, instrumental gaps, unsupported lyrics');

const foreign={lyrics:{language:'es',syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'Hola mundo'},{startTimeMs:'2000',words:'Una noche'}],alternatives:[{language:'en',lines:['Hello world','One night']}]}};
let translated=engine.spotify(foreign,6000);assert.equal(translated[0].translation,'Hello world');assert.equal(translated[1].translation,'One night');foreign.lyrics.language='en';assert.equal(engine.spotify(foreign,6000)[0].translation,'');foreign.lyrics.language='es';foreign.lyrics.alternatives=[];assert.equal(engine.spotify(foreign,6000)[0].translation,'');
console.log('Passed: provider English translations aligned to originals; English and unavailable translations omitted');

rows=engine.lrc('[offset:+500]\n[00:01.00][00:02.00]Repeat',5000);assert.equal(rows[0].start,1500);assert.equal(rows[1].start,2500);assert.equal(rows[1].text,'Repeat');assert.equal(engine.active([],0).line,-1);
