(async()=>{
 const api=window.__RESONANCE_TEST_API__,note=()=>document.getElementById('resonance-lyric-note');
 if(document.getElementById('resonance-root').hidden)document.getElementById('resonance-launch').click();
 window.fetch=async()=>({ok:false,status:404});
 Spicetify.CosmosAsync.get=async()=>({});Spicetify.Player.data.item.uri='spotify:track:MISSINGFIXTURE';
 await api.loadLyrics({title:'No lyrics fixture'},240000);api.drawLyrics();
 if(!note().textContent||getComputedStyle(note()).display==='none'||!note().getClientRects().length)throw Error('Missing-lyrics notice is hidden by artwork fallback CSS');
 Spicetify.CosmosAsync.get=async()=>({lyrics:{syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'Authored test line'}]}});
 Spicetify.Player.data.item.uri='spotify:track:AVAILABLEFIXTURE';await api.loadLyrics({title:'Lyrics fixture'},240000);api.drawLyrics();
 if(!note().hidden||note().textContent)throw Error('Source info should start empty/hidden');
 api.setSingleLine('off');document.querySelector('#resonance-lyric-source-options [data-value="on"]').click();
 if(note().textContent!=='Spotify'||getComputedStyle(note()).display==='none'||!note().getClientRects().length)throw Error('Enabled source info is hidden with single-line lyrics off');
 if(document.getElementById('resonance-expand-lyrics'))throw Error('Inline layout shortcut still exists');
 return {missingNoticeVisible:true,defaultSourceHidden:true,sourceVisibleWithSingleLineOff:true,inlineShortcutAbsent:true};
})()
