// Resonance lyric timing engine. No audio capture or external runtime dependency.
(() => {
  const number = value => value !== null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
  const tokens = text => Array.from(String(text).matchAll(/\S+\s*/gu), m => ({text:m[0],offset:m.index}));
  function finalize(rows,duration) {
    rows=rows.filter(l=>Number.isFinite(l.start)&&l.start>=0).sort((a,b)=>a.start-b.start);
    return rows.map((line,index)=>{
      const next=rows[index+1]?.start ?? duration;
      let end=line.end>line.start?line.end:next;
      if(!(end>line.start)) end=line.start+5000;
      const exact=Array.isArray(line.words)&&line.words.length>0;
      if(!exact) end=Math.min(end,line.start+8000);
      let words=line.words;
      if(!exact) {
        const pieces=tokens(line.text),total=pieces.reduce((n,w)=>n+Math.max(1,w.text.trim().length),0);let offset=0;
        words=pieces.map(piece=>{const weight=Math.max(1,piece.text.trim().length);const word={text:piece.text,start:line.start+(end-line.start)*offset/Math.max(total,1),end:line.start+(end-line.start)*(offset+weight)/Math.max(total,1)};offset+=weight;return word;});
      } else words=words.filter(w=>Number.isFinite(w.start)).sort((a,b)=>a.start-b.start).map((w,i,all)=>({...w,end:w.end>w.start?w.end:(all[i+1]?.start??end)}));
      return {...line,end,words,exact};
    });
  }
  function spotify(payload,duration) {
    const lyrics=payload?.lyrics;
    if(!lyrics || !['LINE_SYNCED','SYLLABLE_SYNCED'].includes(lyrics.syncType)) return [];
    return finalize((lyrics.lines||[]).map(line=>{
      const text=String(line.words??''),start=number(line.startTimeMs);
      let words=[];
      const syllables=Array.isArray(line.syllables)?line.syllables:[];
      if(syllables.length) {
        let offset=0;
        const segments=syllables.map(s=>{const length=number(s.numChars)??0;const segment={offset,end:offset+length,start:number(s.startTimeMs)};offset+=length;return segment});
        words=tokens(text).map(piece=>{const overlaps=segments.filter(s=>s.offset<piece.offset+piece.text.trimEnd().length&&s.end>piece.offset&&s.start!==null);return {text:piece.text,start:overlaps[0]?.start,end:undefined}}).filter(w=>Number.isFinite(w.start));
      }
      return {text,start:start??NaN,end:number(line.endTimeMs),words};
    }),duration);
  }
  function lrc(input,duration) {
    const offset=Number(String(input).match(/\[offset:([+-]?\d+)\]/i)?.[1]||0);
    const rows=[];
    for(const raw of String(input||'').split(/\r?\n/)) {
      const tags=Array.from(raw.matchAll(/\[(\d+):(\d{2}(?:\.\d+)?)\]/g));
      if(!tags.length)continue;
      const body=raw.slice(tags.at(-1).index+tags.at(-1)[0].length);
      const wordTags=Array.from(body.matchAll(/<(\d+):(\d{2}(?:\.\d+)?)>/g));
      let words=[];
      if(wordTags.length) words=wordTags.map((tag,i)=>({text:body.slice(tag.index+tag[0].length,wordTags[i+1]?.index??body.length),start:(Number(tag[1])*60+Number(tag[2]))*1000+offset})).filter(w=>w.text.length);
      for(const tag of tags)rows.push({start:(Number(tag[1])*60+Number(tag[2]))*1000+offset,text:body.replace(/<\d+:\d{2}(?:\.\d+)?>/g,''),words});
    }
    return finalize(rows,duration);
  }
  function active(rows,time) {
    let low=0,high=rows.length;
    while(low<high){const mid=(low+high)>>1;if(rows[mid].start<=time)low=mid+1;else high=mid;}
    const index=low-1;
    if(index<0||time>=rows[index].end)return {line:-1,word:-1};
    const words=rows[index].words;let word=-1;
    for(let i=0;i<words.length;i++){if(time>=words[i].start&&time<words[i].end)word=i;}
    return {line:index,word};
  }
  globalThis.ResonanceLyrics={finalize,spotify,lrc,active};
})();
