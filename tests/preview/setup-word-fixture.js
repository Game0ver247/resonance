(async()=>{
 const e=window.__RESONANCE_TEST_API__;
 const xml='<tt xmlns="http://www.w3.org/ns/ttml"><body><div><p begin="00:00:50.000" end="00:01:00.000"><span begin="00:00:50.000" end="00:00:52.500">Let </span><span begin="00:00:52.500" end="00:00:54.000">the </span><span begin="00:00:54.000" end="00:00:57.500">music </span><span begin="00:00:57.500" end="00:00:59.000">carry </span><span begin="00:00:59.000" end="00:01:00.000">you</span></p></div></body></tt>';
 Spicetify.Player.data.item.metadata.title='Timing preview';Spicetify.Player.getProgress=()=>55500;
 Spicetify.CosmosAsync.get=async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'50000',endTimeMs:'60000',words:'Let the music carry you'}]}});
 window.fetch=async()=>({ok:true,status:200,json:async()=>({ttml:xml,score:1})});
 document.getElementById('resonance-lyric-line').animate=undefined;
 await e.loadLyrics(Spicetify.Player.data.item.metadata,240000);
 if(document.getElementById('resonance-root').hidden)document.getElementById('resonance-launch').click();
 e.drawLyrics();
 const line=document.getElementById('resonance-lyric-line'),spans=line.querySelectorAll('.resonance-timed-word');
 if(spans.length!==5||spans[2].style.getPropertyValue('--word-progress')!=='43%')throw Error('Active word sweep failed');
 e.setLayout('karaoke');e.drawLyrics();
 const active=document.querySelector('#resonance-expanded-lines [aria-current="true"]');
 if(active.querySelectorAll('.resonance-timed-word').length!==5)throw Error('Expanded word rendering failed');
 return {singleLineTokens:spans.length,expandedTokens:5,source:document.getElementById('resonance-lyric-note').textContent};
})()
