const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={};vm.runInNewContext(fs.readFileSync('lyrics-engine.js','utf8'),ctx);const e=ctx.ResonanceLyrics;
assert.equal(typeof e.qrc,'function','QQ needs a real QRC parser');
const xml=`<?xml version="1.0"?><QrcInfos><LyricInfo><Lyric_1 LyricContent="[ti:Test]
[1000,3000]Hello &amp; (1000,1000)world(2500,1500)
[5000,2000]Carry (5000,700)me(6000,1000)"/></LyricInfo></QrcInfos>`;
const rows=e.qrc(xml,10000);assert.equal(rows.length,2);assert.equal(rows[0].text,'Hello & world');assert.equal(rows[0].words[0].end,2000);assert.equal(rows[0].words[1].start,2500);assert.equal(e.wordProgress(rows[0].words[1],3250),.5);
assert.equal(e.qrc(xml.replace('(2500,1500)','(1500,2500)'),10000)[0].words.length,0,'overlap falls back to line');
assert.equal(e.qrc(xml.replace('world(2500,1500)','world(2500,1500) untimed'),10000)[0].words.length,0,'untimed text cannot be hidden');
assert.equal(e.qrc('<!DOCTYPE q [<!ENTITY x "bad">]>'+xml,10000).length,0);
assert.equal(e.qrc('x'.repeat(500001),10000).length,0);
console.log('Passed: QRC entities, absolute word times, gaps, bounds and malformed fallback');
