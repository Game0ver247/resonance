// Resonance line-lyric timing engine. No audio capture or external runtime dependency.
(() => {
  const number = value => value !== null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
  function finalize(rows,duration) {
    rows=rows.filter(l=>Number.isFinite(l.start)&&l.start>=0).sort((a,b)=>a.start-b.start);
    return rows.map((line,index)=>{
      const next=rows[index+1]?.start ?? duration;
      let end=line.end>line.start?line.end:next;
      if(!(end>line.start)) end=line.start+5000;
      // Preserve explicit provider ends; cap otherwise unbounded line gaps.
      if(!(line.end>line.start))end=Math.min(end,line.start+8000);
      return {...line,end};
    });
  }
  function spotify(payload,duration) {
    const lyrics=payload?.lyrics;
    if(!lyrics || !['LINE_SYNCED','SYLLABLE_SYNCED'].includes(lyrics.syncType)) return [];
    const english=(lyrics.alternatives||[]).find(alt=>typeof alt.language==='string'&&/^en(?:-|$)/i.test(alt.language));
    const translated=!/^en(?:-|$)/i.test(lyrics.language||'')&&Array.isArray(english?.lines)?english.lines:[];
    const clean=value=>String(value).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    return finalize((lyrics.lines||[]).map((line,index)=>{
      const text=String(line.words??''),start=number(line.startTimeMs);
      const candidate=translated[index],translation=typeof candidate==='string'?candidate:typeof candidate?.words==='string'?candidate.words:typeof candidate?.text==='string'?candidate.text:'';
      return {text,start:start??NaN,end:number(line.endTimeMs),translation:translation&&clean(translation)!==clean(text)?translation.trim():''};
    }),duration);
  }
  function lrc(input,duration) {
    const offset=Number(String(input).match(/\[offset:([+-]?\d+)\]/i)?.[1]||0);
    const rows=[];
    for(const raw of String(input||'').split(/\r?\n/)) {
      const tags=Array.from(raw.matchAll(/\[(\d+):(\d{2}(?:\.\d+)?)\]/g));
      if(!tags.length)continue;
      const body=raw.slice(tags.at(-1).index+tags.at(-1)[0].length);
      for(const tag of tags)rows.push({start:(Number(tag[1])*60+Number(tag[2]))*1000+offset,text:body.replace(/<\d+:\d{2}(?:\.\d+)?>/g,'')});
    }
    return finalize(rows,duration);
  }
  function active(rows,time) {
    let low=0,high=rows.length;
    while(low<high){const mid=(low+high)>>1;if(rows[mid].start<=time)low=mid+1;else high=mid;}
    const index=low-1;
    return {line:index<0||time>=rows[index].end?-1:index};
  }
  globalThis.ResonanceLyrics={finalize,spotify,lrc,active};
})();
