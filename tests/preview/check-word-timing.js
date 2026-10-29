(() => {
 const e=window.ResonanceLyrics;
 const xml='<tt xmlns="http://www.w3.org/ns/ttml"><body><div><p begin="00:00:01.000" end="00:00:04.000"><span begin="00:00:01.000" end="00:00:01.500">Hel</span><span begin="00:00:01.500" end="00:00:02.000">lo</span> <span begin="00:00:02.500" end="00:00:04.000">world</span></p></div></body></tt>';
 const rows=e.ttml(xml,10000);
 if(rows.length!==1||rows[0].text!=='Hello world'||rows[0].words.length!==3)throw Error('TTML syllable parsing failed: '+JSON.stringify(rows));
 if(rows[0].words[1].text!=='lo '||rows[0].words[2].start!==2500)throw Error('Whitespace or timestamps lost');
 if(e.ttml('<!DOCTYPE x><tt/>',10000).length||e.ttml('<tt><p>',10000).length)throw Error('Unsafe/malformed XML accepted');
 const baseline=[{text:'Hello world',start:1000,end:4000}];
 if(!e.matchesTiming(rows,baseline,10000)||e.matchesTiming(rows,[{text:'Wrong song',start:1000}],10000))throw Error('Recording match failed');
 const root=document.getElementById('resonance-root');if(root.hidden)document.getElementById('resonance-launch').click();
 const api=window.__RESONANCE_TEST_API__;api.setLyricLine('Hello world',false,rows[0]);
 const spans=document.querySelectorAll('#resonance-lyric-line .resonance-timed-word');if(spans.length!==3)throw Error('Timed tokens not rendered');
 return {result:'TTML parsing, whitespace, invalid XML rejection, matching and timed-token DOM pass',tokens:spans.length};
})()
