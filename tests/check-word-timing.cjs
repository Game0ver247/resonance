const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const ctx={};vm.runInNewContext(fs.readFileSync('lyrics-engine.js','utf8'),ctx);const e=ctx.ResonanceLyrics;
assert.equal(typeof e.lyricsfile,'function','parse genuine word timings from Lyricsfile');
const yaml=`version: '1.0'
metadata:
  title: Test
  artist: Artist
  duration_ms: 10000
lines:
- text: 'Hello world'
  start_ms: 1000
  end_ms: 4000
  words:
  - text: 'Hello '
    start_ms: 1000
    end_ms: 2000
  - text: world
    start_ms: 2500
    end_ms: 4000
`;
const rows=e.lyricsfile(yaml,10000);assert.equal(rows[0].words.length,2);assert.equal(rows[0].words[1].start,2500);assert.equal(e.wordProgress(rows[0].words[0],1500),.5);assert.equal(e.wordProgress(rows[0].words[1],2200),0);assert.equal(e.wordProgress(rows[0].words[1],5000),1);
assert.equal(e.lyricsfile(yaml.replace('end_ms: 2000','end_ms: 9000'),10000)[0].words.length,0,'invalid word range falls back to line');
assert.equal(e.lyricsfile(yaml.replace("'Hello world'","'Different text'"),10000)[0].words.length,0,'words must reconstruct displayed text');
assert.equal(e.timed([{text:'Whole line only',start:1000,end:4000,words:[{text:'Whole line only',start:1000,end:4000}]}],10000)[0].words.length,0,'whole-line spans are not word timing');
assert.equal(e.lyricsfile('!!js/function >\n function(){}',10000).length,0);
assert.equal(e.lyricsfile('a: &a [*a]',10000).length,0);
console.log('Passed: genuine word parsing, within-word progress, gaps, bounds and unsafe/malformed fallback');
