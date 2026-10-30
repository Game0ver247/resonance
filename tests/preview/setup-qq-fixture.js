(async()=>{
 const e=window.__RESONANCE_TEST_API__;
 const xml='<QrcInfos><LyricInfo><Lyric_1 LyricContent="[50000,10000]Let (50000,2500)the (52500,1500)music (54000,3500)carry (57500,1500)you(59000,1000)"/></LyricInfo></QrcInfos>';
 Spicetify.Player.data.item.metadata.title='Timing preview';Spicetify.Player.getProgress=()=>55500;
 Spicetify.CosmosAsync.get=async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'50000',endTimeMs:'60000',words:'Let the music carry you'}]}});
 window.fetch=async url=>url.includes('/qq/getLyrics')?({ok:true,status:200,json:async()=>({provider:'qq',lyrics:xml})}):({ok:false,status:401});
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
