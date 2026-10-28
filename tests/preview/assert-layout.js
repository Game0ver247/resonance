// Evaluate in the isolated preview after opening Resonance. Tests real DOM geometry.
(async()=>{
  const rows=[];
  const rect=id=>document.getElementById('resonance-'+id).getBoundingClientRect();
  const settle=async()=>{for(let n=0;n<4;n++)await new Promise(requestAnimationFrame)};
  for(const layout of ['left','center','lyrics','karaoke']){
    document.querySelector('#resonance-layout-options [data-value="'+layout+'"]').click();
    await settle();
    const art=rect('artwork'),lyrics=rect('lyrics'),pane=rect('expanded-lyrics');
    if((layout==='left'||layout==='center')&&art.bottom>lyrics.top+1)throw Error(layout+': artwork overlaps lyrics');
    if((layout==='lyrics'||layout==='karaoke')&&pane.bottom>lyrics.top+1)throw Error(layout+': lyrics overlap summary');
    if(rect('actions').right>innerWidth+1||rect('player').bottom>innerHeight+1)throw Error(layout+': controls outside viewport');
    rows.push({layout,width:innerWidth,height:innerHeight,artSize:Math.round(art.width)});
  }
  return rows;
})();
