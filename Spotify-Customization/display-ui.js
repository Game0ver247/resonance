// NAME: Resonance Display
// AUTHOR: Local customization
// VERSION: 2.3
// DESCRIPTION: Album-art-focused Spotify listening view with subtle ambient waves and Liked Songs.
(() => {
  if (document.getElementById('resonance-launch')) return;
  const css = document.createElement('style');
  css.textContent = `
  #resonance-launch {position:fixed;right:260px;top:19px;z-index:999;color:#c9e5be;background:#20291f;border:1px solid #c9e5be40;border-radius:22px;padding:9px 16px;font:600 12px sans-serif;cursor:pointer;-webkit-app-region:no-drag}
  #resonance-root {position:fixed;inset:0;z-index:10000;background:rgba(12,16,16,.96);backdrop-filter:blur(18px);--accent:#bfdcb3;--accent-rgb:191,220,179;color:#f4f5ef;font-family:inherit;display:flex;flex-direction:column;overflow:hidden}
  #resonance-root[hidden] {display:none!important}
  #resonance-root * {box-sizing:border-box}
  #resonance-bg {position:absolute;inset:-100px;background-size:cover;background-position:center;filter:blur(80px) brightness(.25);opacity:.6;pointer-events:none}
  #resonance-header {position:relative;display:flex;justify-content:space-between;align-items:center;padding:46px 38px 20px;gap:20px}
  #resonance-root #resonance-brand {background:transparent;border:0;padding:0;font:500 20px sans-serif;letter-spacing:1px;color:var(--accent)}
  #resonance-brand-wrap {position:relative;flex-shrink:0}
  #resonance-themes {position:absolute;top:38px;left:0;z-index:5;width:240px;padding:16px;background:#151b19f5;border:1px solid #ffffff20;border-radius:14px;box-shadow:0 16px 50px #0006}
  #resonance-themes[hidden] {display:none}
  #resonance-theme-label {font-size:11px;color:#ffffff90;margin-bottom:12px}
  #resonance-swatches {display:flex;gap:12px}
  #resonance-root #resonance-swatches button {width:30px;height:30px;border-radius:50%;background:var(--swatch);border:2px solid transparent;box-shadow:0 0 0 2px transparent}
  #resonance-root #resonance-swatches button[aria-pressed="true"] {border-color:#151b19;box-shadow:0 0 0 2px var(--swatch)}
  #resonance-swatches button:focus-visible {outline:2px solid white;outline-offset:4px}
  #resonance-root button {color:inherit;cursor:pointer;-webkit-app-region:no-drag;font:inherit}
  #resonance-header-right {min-width:0;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
  #resonance-source {max-width:min(55vw,600px);font:11px -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:.3px;color:#ffffff80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-actions {display:flex;gap:10px}
  #resonance-actions button {border:1px solid #ffffff35;border-radius:22px;background:#0002;padding:9px 15px;font-size:12px}
  #resonance-content {position:relative;flex:1;display:grid;grid-template-columns:min(36vw,46vh) minmax(0,1fr);align-items:center;gap:5vw;width:86vw;max-width:1180px;align-self:center;padding:15px 0 0;min-height:0}
  #resonance-cover {grid-column:1;grid-row:1;width:100%;height:auto;aspect-ratio:1;object-fit:cover;border-radius:18px;box-shadow:0 24px 80px #0007;flex-shrink:0;background:linear-gradient(140deg,#345443,#101715)}
  #resonance-info {grid-column:2;grid-row:1;min-width:0;width:100%;overflow:hidden;text-align:center;padding:0 12px}
  #resonance-kicker {font:11px monospace;letter-spacing:3px;color:var(--accent);margin-bottom:22px}
  #resonance-title {font-size:clamp(27px,4.6vw,75px);font-weight:600;letter-spacing:-.04em;line-height:1.08;margin:0 0 22px;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  #resonance-artist {font-size:clamp(18px,2vw,32px);color:#ffffffb5;margin-bottom:13px;line-height:1.35;overflow-wrap:anywhere}
  #resonance-album {font-size:clamp(13px,1.2vw,19px);color:#ffffff70}
  #resonance-waves {flex-shrink:0;position:relative;width:90%;height:8vh;min-height:45px;align-self:center;pointer-events:none}
  #resonance-player {position:relative;display:flex;flex-direction:column;align-items:center;gap:18px;padding:0 32px 18px}
  #resonance-progress {display:flex;align-items:center;gap:15px;width:min(530px,80vw);font:11px monospace;color:#ffffff90}
  #resonance-track {appearance:none;-webkit-appearance:none;min-width:0;flex:1;height:24px;margin:0;background:transparent;cursor:pointer;touch-action:none;-webkit-app-region:no-drag}
  #resonance-track::-webkit-slider-runnable-track {height:4px;border-radius:3px;background:linear-gradient(to right,var(--accent) var(--progress,0%),#ffffff20 var(--progress,0%))}
  #resonance-track::-webkit-slider-thumb {appearance:none;-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--accent);margin-top:-4px;opacity:0;transition:opacity .15s}
  #resonance-track:hover::-webkit-slider-thumb,#resonance-track:focus-visible::-webkit-slider-thumb {opacity:1}
  #resonance-track:focus-visible {outline:1px solid rgba(var(--accent-rgb),.5);outline-offset:3px;border-radius:6px}
  #resonance-track:disabled {opacity:.4;cursor:default}
  #resonance-up-next {position:absolute;right:0;bottom:14px;max-width:46%;padding:10px 16px;border:1px solid #ffffff15;border-radius:12px;background:#ffffff08;animation:resonance-preview .35s ease-out}
  #resonance-up-next[hidden] {display:none}
  #resonance-up-next-label {font:10px monospace;letter-spacing:2px;color:var(--accent);margin-bottom:5px}
  #resonance-up-next-title {font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-up-next-artist {font-size:12px;color:#ffffff80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  @keyframes resonance-preview {from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @media(prefers-reduced-motion:reduce) {#resonance-up-next{animation:none}}
  #resonance-controls {display:flex;align-items:center;gap:26px}
  #resonance-controls button {width:52px;height:52px;border:0;border-radius:50%;background:transparent;display:grid;place-items:center;font-size:25px}
  #resonance-controls button:hover {background:#ffffff20}
  #resonance-controls button svg {width:22px;height:22px;display:block}
  #resonance-controls #resonance-shuffle {margin-right:12px;color:#ffffff70}
  #resonance-controls #resonance-shuffle[aria-pressed="true"] {color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-controls #resonance-like {margin-left:12px;color:#ffffff90}
  #resonance-controls #resonance-like[aria-pressed="true"] {color:var(--accent)}
  #resonance-like[aria-pressed="true"] path {fill:currentColor}
  #resonance-controls button:disabled {opacity:.4;cursor:default}
  #resonance-controls #resonance-toggle {width:62px;height:62px;background:var(--accent);color:#111}
  #resonance-caption {position:relative;text-align:center;font:10px monospace;letter-spacing:1.5px;color:#ffffff65;padding:0 15px 18px}
  #resonance-status {font:11px sans-serif;color:#ffd19b;min-height:14px}
  #resonance-lyrics {position:relative;flex-shrink:0;width:86vw;max-width:1180px;align-self:center;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;padding:8px 0}
  #resonance-lyric-line {white-space:nowrap;max-width:100%;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-size:32px;line-height:1.35;font-weight:650;letter-spacing:-.035em;color:#f4f5f1;overflow:hidden;min-height:44px;will-change:opacity,transform}
  #resonance-root #resonance-lyric-line {font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:650;letter-spacing:-.035em;border:0;background:transparent;padding:0;cursor:pointer}
  #resonance-root #resonance-lyric-line:disabled {cursor:default}
  #resonance-lyric-line:focus-visible,#resonance-expanded-lines button:focus-visible {outline:1px solid var(--accent);outline-offset:4px;border-radius:6px}
  #resonance-lyric-tools {display:flex;align-items:center;gap:14px}
  #resonance-root #resonance-expand-lyrics {background:transparent;border:0;padding:5px;color:#ffffff90;font-size:11px}
  #resonance-expanded-lyrics {grid-column:2;grid-row:1;min-width:0;width:100%;height:42vh;overflow:auto;padding:0 12px;z-index:1;overscroll-behavior:contain;scrollbar-width:none;mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
  #resonance-expanded-lyrics[hidden] {display:none}
  #resonance-expanded-lines {display:flex;flex-direction:column;gap:16px;align-items:center;padding-block:calc(21vh - 24px)}
  #resonance-root #resonance-expanded-lines button {font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:650;font-size:clamp(16px,2vw,30px);letter-spacing:-.03em;line-height:1.3;border:0;background:transparent;padding:3px 6px;text-align:center;color:#ffffff60;transition:color .28s;white-space:normal}
  #resonance-root #resonance-expanded-lines button[aria-current="true"] {color:#f4f5f1}
  #resonance-root #resonance-expanded-lines button:hover {color:var(--accent)}
  #resonance-expanded-note {text-align:center;color:#ffffff70;font-size:14px}
  #resonance-song-summary {position:absolute;top:8px;left:0;width:100%;height:44px;text-align:center;pointer-events:none}
  #resonance-song-summary[hidden] {display:none}
  #resonance-summary-title {font-size:16px;line-height:18px;font-weight:600}
  #resonance-summary-artist,#resonance-summary-album {font-size:11px;line-height:13px;color:#ffffff90}
  #resonance-song-summary div {white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-lyric-note {font:10px monospace;color:#ffffff60;letter-spacing:.5px}
  #resonance-lyrics-toggle[aria-pressed="true"] {color:var(--accent)}
  #resonance-header,#resonance-player,#resonance-caption {transition:opacity .35s}
  #resonance-root[data-idle="true"] #resonance-header,#resonance-root[data-idle="true"] #resonance-player,#resonance-root[data-idle="true"] #resonance-caption {opacity:0;pointer-events:none}
  #resonance-controls #resonance-repeat {color:#ffffff70;position:relative}
  #resonance-controls #resonance-repeat[aria-pressed="true"] {color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-repeat[data-mode="2"]::after {content:'1';position:absolute;font:700 9px sans-serif;top:21px;left:24px;background:#172017;padding:0 2px}
  #resonance-queue {position:absolute;z-index:2;right:28px;top:140px;width:min(350px,calc(100vw - 40px));max-height:65vh;overflow:auto;background:#151b19f5;border:1px solid #ffffff20;border-radius:18px;padding:20px;box-shadow:0 16px 70px #0007}
  #resonance-queue[hidden] {display:none}
  #resonance-queue h2 {font-size:16px;margin:0 0 16px}
  #resonance-queue-list {padding-left:22px;margin:0;color:#ffffff70}
  #resonance-queue-list li {padding:10px 0 10px 5px}
  #resonance-queue-list strong {display:block;color:#f4f5ef;font-size:14px;font-weight:550}
  #resonance-queue-list small {display:block;margin-top:4px;font-size:12px}
  @media(max-width:800px) {#resonance-controls{gap:10px}#resonance-controls #resonance-shuffle,#resonance-controls #resonance-like{margin:0}}
  @media(prefers-reduced-motion:reduce) {#resonance-header,#resonance-player,#resonance-caption{transition:none}}
  @media(max-height:720px) {#resonance-cover{max-height:40vh;width:40vh;max-width:100%}#resonance-lyrics{min-height:74px}#resonance-waves{height:6vh;min-height:30px}#resonance-header{padding-top:38px;padding-bottom:12px}#resonance-title{font-size:clamp(23px,4vw,55px)}}
  @media(max-width:800px) {#resonance-launch{right:205px;padding:9px}#resonance-header{padding:40px 20px 12px}#resonance-content{gap:25px;padding:15px 0}#resonance-title{font-size:30px}}
  `;
  document.head.append(css);
  const launch = document.createElement('button');
  launch.id = 'resonance-launch'; launch.textContent = 'Resonance'; launch.title = 'Open artwork-focused listening view';
  const root = document.createElement('section'); root.id = 'resonance-root'; root.hidden = true;
  root.setAttribute('aria-label','Resonance listening view');
  root.innerHTML = `<div id="resonance-bg"></div><header id="resonance-header"><div id="resonance-brand-wrap"><button id="resonance-brand" aria-label="Resonance accent colors" aria-expanded="false" aria-controls="resonance-themes" title="Accent colors">resonance</button><div id="resonance-themes" hidden><div id="resonance-theme-label">Accent color</div><div id="resonance-swatches"></div></div></div><div id="resonance-header-right"><div id="resonance-source" aria-label="Playback source"></div><div id="resonance-actions"><button id="resonance-lyrics-toggle" aria-pressed="true">Lyrics</button><button id="resonance-queue-toggle" aria-expanded="false" aria-controls="resonance-queue">Queue</button><button id="resonance-fullscreen">Fullscreen</button><button id="resonance-exit">Back to Spotify</button></div></div></header><aside id="resonance-queue" hidden aria-label="Upcoming songs"><h2>Up next</h2><ol id="resonance-queue-list"></ol><div id="resonance-queue-empty">No upcoming songs</div></aside><main id="resonance-content"><img id="resonance-cover" alt="Current album artwork"><div id="resonance-info"><div id="resonance-kicker">YOUR LISTENING SPACE</div><h1 id="resonance-title">Ready for music</h1><div id="resonance-artist">Play a song in Spotify</div><div id="resonance-album"></div></div><section id="resonance-expanded-lyrics" hidden aria-label="Expanded lyrics"><div id="resonance-expanded-lines"></div><div id="resonance-expanded-note"></div></section><aside id="resonance-up-next" hidden aria-label="Up next"><div id="resonance-up-next-label">UP NEXT</div><div id="resonance-up-next-title"></div><div id="resonance-up-next-artist"></div></aside></main><section id="resonance-lyrics" aria-label="Current lyric"><div id="resonance-song-summary" hidden aria-label="Song details"><div id="resonance-summary-title"></div><div id="resonance-summary-artist"></div><div id="resonance-summary-album"></div></div><button id="resonance-lyric-line" disabled title="Seek to this lyric"></button><div id="resonance-lyric-tools"><div id="resonance-lyric-note"></div><button id="resonance-expand-lyrics" aria-expanded="false" aria-controls="resonance-expanded-lyrics">Expand lyrics</button></div></section><canvas id="resonance-waves" aria-hidden="true"></canvas><div id="resonance-player"><div id="resonance-progress"><span id="resonance-elapsed">0:00</span><input id="resonance-track" type="range" min="0" max="1" step="1000" value="0" aria-label="Song position" disabled><span id="resonance-duration">0:00</span></div><div id="resonance-controls"><button id="resonance-shuffle" aria-label="Enable shuffle" title="Enable shuffle" aria-pressed="false"></button><button id="resonance-previous" aria-label="Previous track" title="Previous track">⏮</button><button id="resonance-toggle" aria-label="Play or pause" title="Play or pause">▶</button><button id="resonance-next" aria-label="Next track" title="Next track">⏭</button><button id="resonance-repeat" aria-label="Repeat off" title="Repeat off" aria-pressed="false"></button><button id="resonance-like" aria-label="Add to Liked Songs" title="Add to Liked Songs" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button></div><div id="resonance-status" role="status"></div></div><footer id="resonance-caption">AMBIENT WAVES · ESC TO RETURN</footer>`;
  document.body.append(launch,root);
  const get = id => document.getElementById('resonance-'+id);
  const themes={sage:[191,220,179],sky:[161,203,236],lavender:[199,181,234],rose:[235,177,191],amber:[232,201,143]};
  let accentRGB=themes.sage;
  function setTheme(name,persist=true){
    if(!themes[name])name='sage';accentRGB=themes[name];
    root.style.setProperty('--accent-rgb',accentRGB.join(','));root.style.setProperty('--accent','rgb('+accentRGB.join(',')+')');
    for(const button of get('swatches').children)button.setAttribute('aria-pressed',String(button.dataset.theme===name));
    if(persist)try{localStorage.setItem('resonance-accent',name);}catch{}
  }
  for(const [name,rgb] of Object.entries(themes)){const button=document.createElement('button');button.dataset.theme=name;button.title=name[0].toUpperCase()+name.slice(1);button.setAttribute('aria-label',button.title);button.style.setProperty('--swatch','rgb('+rgb.join(',')+')');button.onclick=()=>setTheme(name);get('swatches').append(button);}
  let storedTheme='sage';try{storedTheme=localStorage.getItem('resonance-accent')||'sage';}catch{}setTheme(storedTheme,false);
  get('brand').onclick=()=>{get('themes').hidden=!get('themes').hidden;get('brand').setAttribute('aria-expanded',String(!get('themes').hidden));wakeControls();};
  document.addEventListener('pointerdown',event=>{if(!get('brand-wrap').contains(event.target)){get('themes').hidden=true;get('brand').setAttribute('aria-expanded','false');}});
  let artwork = '', phase = 0, previous = 0, frame = 0, oldFocus;
  let savingURI = '', checkedURI = '', checkingURI = '';
  const savedTracks = new Map();
  function currentTrack() {
    try { return Spicetify.Player.data?.item || Spicetify.Player.origin?._state?.item || null; } catch { return null; }
  }
  function artistCredits(track) {
    const meta=track?.metadata||{},names=[];
    const add=name=>{if(typeof name==='string'&&name.trim()&&!names.includes(name.trim()))names.push(name.trim());};
    for(const artist of track?.artists||[])add(artist.name);
    if(!names.length) {
      add(meta.artist_name);
      Object.keys(meta).filter(key=>/^artist_name:\d+$/.test(key)).sort((a,b)=>Number(a.split(':')[1])-Number(b.split(':')[1])).forEach(key=>add(meta[key]));
    }
    // Spotify credits do not reliably distinguish featured artists from collaborators.
    return names.join(', ');
  }
  function currentURI() { return currentTrack()?.uri || ''; }
  function renderHeart() {
    const uri = currentURI(), available = /^spotify:track:[A-Za-z0-9]+$/.test(uri);
    const saved = savedTracks.get(uri) === true;
    const label = savingURI === uri && uri ? 'Saving to Liked Songs…' : (saved ? 'Remove from Liked Songs' : 'Add to Liked Songs');
    get('like').disabled = !available || savingURI === uri;
    get('like').setAttribute('aria-pressed', String(saved));
    get('like').setAttribute('aria-label', label); get('like').title = label;
  }
  async function checkHeart() {
    const uri = currentURI();
    renderHeart();
    if(!uri.startsWith('spotify:track:') || checkedURI === uri || checkingURI === uri) return;
    const api = window.Spicetify?.Platform?.LibraryAPI;
    if(!api?.contains) return;
    checkingURI = uri;
    try {
      const [saved] = await api.contains(uri);
      savedTracks.set(uri, Boolean(saved)); checkedURI = uri;
      if(currentURI() === uri) renderHeart();
    } catch { checkedURI = uri; }
    finally { if(checkingURI === uri) checkingURI = ''; }
  }
  get('like').onclick = async () => {
    const uri = currentURI();
    if(!/^spotify:track:[A-Za-z0-9]+$/.test(uri) || savingURI) return;
    const wasSaved=savedTracks.get(uri)===true;
    savingURI = uri; renderHeart(); text('status','');
    try {
      const api = window.Spicetify?.Platform?.LibraryAPI;
      if(!api?.add || !api?.remove) throw new Error('Library unavailable');
      await (wasSaved ? api.remove({uris:[uri]}) : api.add({uris:[uri]}));
      savedTracks.set(uri,!wasSaved);
      if(currentURI() === uri) flashStatus(wasSaved?'Removed from Liked Songs':'Added to Liked Songs');
    } catch {
      if(currentURI() === uri) text('status','Couldn’t update Liked Songs. Try the heart again.');
    } finally { savingURI = ''; renderHeart(); }
  };
  const icons = {
    repeat:'<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    shuffle:'<path d="M3 6h3c4 0 8 12 12 12h3m-4-4 4 4-4 4M3 18h3c1.4 0 3-1.5 4.5-3.5M14 9.5C15.5 7.5 16.8 6 18 6h3m-4-4 4 4-4 4"/>',
    previous:'<path d="M5 4v16M19 5 7 12l12 7Z"/>',
    next:'<path d="M19 4v16M5 5l12 7-12 7Z"/>',
    play:'<path d="m8 5 11 7-11 7Z"/>',
    pause:'<path d="M7 5v14M17 5v14"/>'
  };
  function icon(id,name) { if(get(id).dataset.icon!==name) { get(id).innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';get(id).dataset.icon=name;} }
  icon('previous','previous'); icon('next','next'); icon('shuffle','shuffle'); icon('repeat','repeat');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let statusTimer,statusAnimation,statusGeneration=0;
  const text = (id,value) => {
    if(id==='status'){statusGeneration++;clearTimeout(statusTimer);statusAnimation?.cancel();statusAnimation=null;}
    if(get(id).textContent !== value)get(id).textContent=value;
  };
  function flashStatus(message) {
    text('status',message);const generation=statusGeneration;
    statusTimer=setTimeout(()=>{
      if(generation!==statusGeneration)return;
      const status=get('status');
      if(reduced.matches||typeof status.animate!=='function'){text('status','');return;}
      statusAnimation=status.animate([{opacity:1},{opacity:0}],{duration:450,easing:'ease-out',fill:'forwards'});
      statusAnimation.onfinish=()=>{if(generation===statusGeneration)text('status','');};
    },2400);
  }
  function native(selector) { return document.querySelector(selector); }
  function playing() {
    try {
      const state = window.Spicetify?.Player?.origin?._state || window.Spicetify?.Player?.data;
      if(typeof state?.isPaused === 'boolean') return !state.isPaused;
    } catch {}
    const toggle = native('[data-testid="control-button-playpause"]');
    return !!toggle && /pause/i.test(toggle.getAttribute('aria-label') || '');
  }
  let lyricKey='', lyricRows=[], lyricSource='', lyricLoad=0, lyricLine=-2, lyricWord=-2;
  let expandedLyrics=false,expandedKey='';
  let showLyrics=true, lyricState='Play a song to see lyrics', lyricStarted=0;
  const lyricCache=new Map();
  function fitLyric() {
    const line=get('lyric-line');line.style.fontSize='32px';
    const width=get('lyrics').clientWidth;
    if(width>0&&line.scrollWidth>width) line.style.fontSize=Math.max(11,32*width/line.scrollWidth)+'px';
  }
  const normalize=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  async function loadLyrics(meta,duration) {
    if(!(duration>0))return;
    const uri=currentURI(),key=uri+'|'+(meta.title||'');
    if(key===lyricKey)return;
    get('lyric-line').disabled=true;get('lyric-line').onclick=null;expandedKey='';
    lyricKey=key;const generation=++lyricLoad;lyricRows=[];lyricLine=-2;lyricWord=-2;lyricState='Finding lyrics…';lyricSource='';
    if(!uri.startsWith('spotify:track:')||!meta.title){lyricState='Play a song to see lyrics';return;}
    if(lyricCache.has(key)){const cached=lyricCache.get(key);lyricRows=cached.rows;lyricSource=cached.source;lyricState=cached.state;return;}
    const accept=(rows,source)=>{
      if(generation!==lyricLoad||!rows.length)return false;
      lyricRows=rows;lyricSource=source;lyricState='';lyricLine=-2;lyricWord=-2;return true;
    };
    try {
      const endpoint='https://spclient.wg.spotify.com/color-lyrics/v2/track/'+encodeURIComponent(uri.split(':')[2])+'?format=json&vocalRemoval=false&market=from_token';
      const payload=await Promise.race([Spicetify.CosmosAsync.get(endpoint),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),6500))]);
      accept(ResonanceLyrics.spotify(payload,duration),'Spotify');
    }catch{}
    if(generation!==lyricLoad)return;
    // The open community provider is a fallback and can improve word timing.
    if(!lyricRows.some(row=>row.exact)) {
      const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),7000);
      try {
        const query=new URLSearchParams({track_name:meta.title,artist_name:meta.artist_name||'',album_name:meta.album_title||'',duration:String(Math.round(duration/1000))});
        const response=await fetch('https://lrclib.net/api/get?'+query,{signal:abort.signal});
        if(response.ok){const data=await response.json();
          const validTitle=!data.trackName||normalize(data.trackName)===normalize(meta.title);
          const validDuration=!data.duration||Math.abs(data.duration*1000-duration)<2500;
          if(validTitle&&validDuration){const rows=ResonanceLyrics.lrc(data.syncedLyrics,duration);if(!lyricRows.length||rows.some(row=>row.exact))accept(rows,'LRCLIB');if(data.instrumental&&!lyricRows.length)lyricState='Instrumental';}
        }
      }catch{}finally{clearTimeout(timeout);}
    }
    if(generation!==lyricLoad)return;
    if(!lyricRows.length&&lyricState!=='Instrumental')lyricState='Synced lyrics unavailable for this song';
    if(lyricCache.size>=50)lyricCache.delete(lyricCache.keys().next().value);
    if(lyricRows.length)lyricCache.set(key,{rows:lyricRows,source:lyricSource,state:lyricState});
  }
  let desiredLyric='',desiredLyricURI='',desiredLyricStart, lineAnimation, transitionGeneration=0;
  function setLyricLine(value, smooth=true, row=null) {
    if(value===desiredLyric&&desiredLyricURI===currentURI()&&desiredLyricStart===row?.start)return;
    desiredLyric=value;desiredLyricURI=currentURI();desiredLyricStart=row?.start;const token=++transitionGeneration;
    const line=get('lyric-line');lineAnimation?.cancel();
    const uri=currentURI();
    const replace=()=>{line.textContent=value;line.disabled=!row;line.onclick=row?()=>seekLyric(uri,row.start):null;fitLyric();};
    if(!smooth||reduced.matches||!line.textContent||typeof line.animate!=='function'){replace();return;}
    lineAnimation=line.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],{duration:130,easing:'ease-in',fill:'forwards'});
    lineAnimation.onfinish=()=>{
      if(token!==transitionGeneration)return;
      lineAnimation.cancel();replace();
      lineAnimation=line.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
    };
  }
  function drawLyrics() {
    if(!showLyrics)return;
    let position=0;try{position=Spicetify.Player.getProgress();}catch{}
    const selected=ResonanceLyrics.active(lyricRows,position),row=lyricRows[selected.line];
    setLyricLine(row?.text || (lyricRows.length?'♪':lyricState),!!row,row);
    renderExpanded(position,selected.line);
    text('lyric-note',row ? lyricSource : (lyricRows.length?lyricSource+' · Instrumental break':''));
  }
  async function seekLyric(uri,start) {
    if(uri!==currentURI()||!Number.isFinite(start))return;
    try{await Spicetify.Player.seek(Math.round(Math.max(0,Math.min(start,Spicetify.Player.getDuration()))));drawLyrics();update();}
    catch{flashStatus('Couldn’t seek to this lyric.');}
  }
  let expandedRowsKey='',expandedButtons=[];
  function renderExpanded(position,active) {
    if(!expandedLyrics)return;
    let anchor=active;
    if(anchor<0){anchor=lyricRows.findIndex(row=>row.start>position);if(anchor<0)anchor=lyricRows.length-1;}
    const rowsKey=lyricKey+'|'+lyricRows.length,rebuilt=rowsKey!==expandedRowsKey;
    const list=get('expanded-lines'),pane=get('expanded-lyrics');
    text('expanded-note',lyricRows.length?'':lyricState);
    if(rebuilt){
      expandedRowsKey=rowsKey;list.replaceChildren();expandedButtons=[];
      const uri=currentURI();
      for(const row of lyricRows){const button=document.createElement('button');button.textContent=row.text||'♪';button.title='Seek to '+fmt(row.start);button.onclick=()=>seekLyric(uri,row.start);list.append(button);expandedButtons.push(button);}
    }
    const key=rowsKey+'|'+anchor+'|'+active;
    if(key===expandedKey&&!rebuilt)return;expandedKey=key;
    expandedButtons.forEach((button,index)=>button.setAttribute('aria-current',String(index===active)));
    const target=expandedButtons[anchor];
    if(target&&typeof pane.scrollTo==='function')pane.scrollTo({top:target.offsetTop-pane.offsetTop-pane.clientHeight/2+target.offsetHeight/2,behavior:reduced.matches||rebuilt?'instant':'smooth'});
  }
  function toggleExpanded() {
    expandedLyrics=!expandedLyrics;expandedKey='';get('expanded-lyrics').hidden=!expandedLyrics;
    get('info').style.visibility=expandedLyrics?'hidden':'visible';get('lyric-line').style.visibility=expandedLyrics?'hidden':'';get('song-summary').hidden=!expandedLyrics;
    get('expand-lyrics').textContent=expandedLyrics?'Collapse lyrics':'Expand lyrics';get('expand-lyrics').setAttribute('aria-expanded',String(expandedLyrics));drawLyrics();wakeControls();
  }
  get('expand-lyrics').onclick=toggleExpanded;
  get('lyrics-toggle').onclick=()=>{showLyrics=!showLyrics;if(!showLyrics&&expandedLyrics)toggleExpanded();get('lyrics').style.visibility=showLyrics?'visible':'hidden';get('lyrics-toggle').setAttribute('aria-pressed',String(showLyrics));if(showLyrics){lyricKey='';update();}};
  window.addEventListener('resize',fitLyric);
  let shuffleBusy=false;
  function shuffleState() {
    try { const state=Spicetify.Player.getShuffle(); if(typeof state==='boolean')return state; }catch{}
    const button=native('[data-testid="control-button-shuffle"]');
    return button?.getAttribute('aria-checked')==='true'||button?.getAttribute('aria-pressed')==='true'||(/disable.*shuffle/i.test(button?.getAttribute('aria-label')||''));
  }
  function renderShuffle() {
    const enabled=shuffleState(),button=get('shuffle');
    button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Disable shuffle':'Enable shuffle');button.title=enabled?'Disable shuffle':'Enable shuffle';
    const nativeButton=native('[data-testid="control-button-shuffle"]');
    button.disabled=shuffleBusy||!currentURI()||(nativeButton?.disabled===true||nativeButton?.getAttribute('aria-disabled')==='true');
  }
  get('shuffle').onclick=async()=>{
    if(shuffleBusy)return;shuffleBusy=true;renderShuffle();text('status','');
    try {
      if(!Spicetify.Player?.setShuffle)throw Error('Unavailable');
      await Spicetify.Player.setShuffle(!shuffleState());
      setTimeout(renderShuffle,350);
    }catch{text('status','Shuffle is unavailable for this playback.');}
    finally{shuffleBusy=false;renderShuffle();}
  };
  function queuedTracks() {
    try {
      const state=Spicetify.Player.data||Spicetify.Player.origin?._state;
      const items=state?.nextItems?.length?state.nextItems:Spicetify.Queue?.nextTracks||[];
      return items.map(item=>item.contextTrack||item.track||item).filter(track=>track?.metadata?.title).slice(0,5);
    }catch{return [];}
  }
  let queueKey='',repeatBusy=false;
  function renderQueue() {
    if(get('queue').hidden)return;
    const tracks=queuedTracks(),key=JSON.stringify(tracks.map(t=>[t.uri,t.metadata.title,artistCredits(t)]));
    if(key===queueKey)return;queueKey=key;get('queue-list').replaceChildren();
    for(const track of tracks){const row=document.createElement('li'),title=document.createElement('strong'),artist=document.createElement('small');title.textContent=track.metadata.title;artist.textContent=artistCredits(track);row.append(title,artist);get('queue-list').append(row);}
    get('queue-empty').hidden=tracks.length>0;
  }
  get('queue-toggle').onclick=()=>{get('queue').hidden=!get('queue').hidden;get('queue-toggle').setAttribute('aria-expanded',String(!get('queue').hidden));queueKey='';renderQueue();wakeControls();};
  function repeatMode(){try{return Spicetify.Player.getRepeat();}catch{return Spicetify.Player.data?.repeat||0;}}
  function renderRepeat(){const mode=repeatMode(),button=get('repeat'),label=['Repeat off','Repeat all','Repeat one'][mode]||'Repeat off';button.dataset.mode=String(mode);button.setAttribute('aria-pressed',String(mode>0));button.setAttribute('aria-label',label);button.title=label;button.disabled=repeatBusy||!currentURI();}
  get('repeat').onclick=async()=>{if(repeatBusy)return;repeatBusy=true;renderRepeat();try{await Spicetify.Player.setRepeat((repeatMode()+1)%3);}catch{flashStatus('Repeat is unavailable for this playback.');}finally{repeatBusy=false;renderRepeat();setTimeout(renderRepeat,350);}};
  let idleTimer;
  function canHideControls(){return !root.hidden&&document.fullscreenElement===root&&playing()&&get('themes').hidden&&get('queue').hidden&&!seekingURI&&!(document.activeElement?.matches(':focus-visible')&&(get('header').contains(document.activeElement)||get('player').contains(document.activeElement)))&&!(document.activeElement?.matches(':focus-visible')&&get('lyrics').contains(document.activeElement));}
  function wakeControls(){root.dataset.idle='false';clearTimeout(idleTimer);if(!root.hidden)idleTimer=setTimeout(()=>{idleTimer=null;if(canHideControls())root.dataset.idle='true';},3000);}
  root.onpointermove=root.onpointerdown=root.onkeydown=root.onfocusin=wakeControls;
  document.addEventListener('fullscreenchange',wakeControls);
  const fmt = ms => `${Math.floor(Math.max(0,ms)/60000)}:${String(Math.floor(Math.max(0,ms)/1000)%60).padStart(2,'0')}`;
  let seekingURI='';
  function paintPosition(position,duration) {
    const bar=get('track');bar.value=String(position);bar.style.setProperty('--progress',(duration>0?Math.min(100,Math.max(0,position/duration*100)):0)+'%');
    bar.setAttribute('aria-valuetext',fmt(position)+' of '+fmt(duration));text('elapsed',fmt(position));
  }
  get('track').onpointerdown=()=>{seekingURI=currentURI();};
  get('track').oninput=()=>{if(!seekingURI)seekingURI=currentURI();paintPosition(Number(get('track').value),Number(get('track').max));};
  get('track').onchange=async()=>{
    const uri=seekingURI||currentURI(),position=Math.round(Number(get('track').value));seekingURI='';
    if(!uri||uri!==currentURI()){update();return;}
    try {await Spicetify.Player.seek(Math.max(0,Math.min(position,Spicetify.Player.getDuration())));}
    catch {flashStatus('Couldn’t seek in this song.');}
    setTimeout(update,250);
  };
  get('track').onpointercancel=()=>{seekingURI='';update();};
  get('track').onblur=()=>{seekingURI='';update();};
  function renderUpNext(progress,duration) {
    const preview=get('up-next');preview.hidden=true;
    if(!(duration>0&&duration-progress<=20000&&duration-progress>0))return;
    try {
      const state=Spicetify.Player.data||Spicetify.Player.origin?._state;
      const repeat=repeatMode()===2;
      const queued=repeat?currentTrack():(state?.nextItems?.[0]||Spicetify.Queue?.nextTracks?.[0]);
      const track=queued?.contextTrack||queued?.track||queued;
      const meta=track?.metadata||{};
      if(!meta.title)return;
      text('up-next-label',repeat?'ON REPEAT':'UP NEXT');text('up-next-title',meta.title);text('up-next-artist',artistCredits(track));preview.hidden=false;
    }catch{}
  }
  function playbackSource() {
    try {
      const state=Spicetify.Player.data||Spicetify.Player.origin?._state,context=state?.context||{},meta=context.metadata||{};
      const uri=context.uri||'',type=uri.split(':')[1]||'';
      const labels={playlist:'Playlist',album:'Album',artist:'Artist',station:'Radio',radio:'Radio',collection:'Liked Songs',search:'Search'};
      let name=meta.context_description||meta.context_name||meta.title||meta.name||'';
      // Match the current context, rather than the page the user happens to browse.
      if(!name&&uri&&document.querySelectorAll){
        const path='/'+uri.replace(/^spotify:/,'').replaceAll(':','/');
        for(const link of document.querySelectorAll('a[href]')) {
          const href=link.getAttribute('href')||'';
          if((href===uri||href.split('?')[0].endsWith(path))&&link.textContent?.trim()){name=link.textContent.trim();break;}
        }
      }
      const label=labels[type]||(uri.includes('radio')?'Radio':'');
      if(name)return 'PLAYING FROM '+(label?label+' · ':'')+name;
      if(label)return 'PLAYING FROM '+label;
      return currentURI()?'PLAYING FROM Spotify':'Choose a song in Spotify';
    }catch{return 'PLAYING FROM Spotify';}
  }
  function update() {
    if(root.hidden) return;
    text('source',playbackSource());get('source').title=get('source').textContent;
    let meta = {};
    try { meta = Spicetify.Player.data?.item?.metadata || Spicetify.Player.origin?._state?.item?.metadata || {}; } catch {}
    const title = meta.title || native('[data-testid="context-item-link"]')?.textContent || '';
    const artist = artistCredits(currentTrack()) || native('[data-testid="context-item-info-subtitles"]')?.textContent || '';
    text('title',title || 'Ready for music'); text('artist',artist || 'Play a song in Spotify'); text('album',meta.album_title || '');
    text('summary-title',title||'Ready for music');text('summary-artist',artist);text('summary-album',meta.album_title||'');
    text('kicker',playing() ? 'NOW PLAYING' : 'READY WHEN YOU ARE');
    icon('toggle',playing() ? 'pause' : 'play');
    checkHeart(); renderShuffle(); renderRepeat(); renderQueue();
    if(!canHideControls())root.dataset.idle='false';else if(!idleTimer&&root.dataset.idle!=='true')wakeControls();
    get('toggle').setAttribute('aria-label',playing() ? 'Pause' : 'Play');
    let image = meta.image_xlarge_url || meta.image_large_url || native('[data-testid="now-playing-widget"] img')?.src || native('.main-nowPlayingWidget-coverArt img')?.src || native('img[data-testid="cover-art-image"]')?.src || '';
    if(image.startsWith('spotify:image:')) image = 'https://i.scdn.co/image/'+image.split(':').pop();
    if(image !== artwork) {
      artwork = image;
      if(image && /^(https:|spotify:)/.test(image)) { get('cover').src = image; get('bg').style.backgroundImage = `url(${JSON.stringify(image)})`; }
      else { get('cover').removeAttribute('src'); get('bg').style.backgroundImage = ''; }
    }
    let progress = 0, duration = 0;
    try { progress = Spicetify.Player.getProgress(); duration = Spicetify.Player.getDuration(); } catch {}
    if(seekingURI&&seekingURI!==currentURI())seekingURI='';
    get('track').max=String(Math.max(1,duration));get('track').disabled=!(duration>0)||!currentURI();
    if(!seekingURI)paintPosition(progress,duration);
    renderUpNext(progress,duration);
    text('duration',native('[data-testid="playback-duration"]')?.textContent || fmt(duration));
    loadLyrics(meta,duration);

  }
  function control(selector,action) {
    text('status','');
    const button = native(selector);
    if(button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') { button.click(); setTimeout(update,350); return; }
    try {
      const result = Spicetify.Player[action]();
      Promise.resolve(result).catch(() => text('status','Spotify could not complete that command.'));
      setTimeout(update,350);
    } catch { text('status','This control is unavailable for the current Spotify playback.'); }
  }
  get('previous').onclick = () => control('[data-testid="control-button-skip-back"]','back');
  get('toggle').onclick = () => control('[data-testid="control-button-playpause"]','togglePlay');
  get('next').onclick = () => control('[data-testid="control-button-skip-forward"]','next');
  function draw(now) {
    if(root.hidden) return;
    frame = requestAnimationFrame(draw);
    if(now-previous < 33) return;
    const delta = previous ? Math.min((now-previous)/1000,.1) : 0;
    if(!reduced.matches && playing()) phase += delta;
    previous=now;
    drawLyrics();
    const canvas = get('waves'), rect=canvas.getBoundingClientRect(), scale=Math.min(devicePixelRatio||1,2);
    const w=rect.width,h=rect.height;
    if(canvas.width!==Math.round(w*scale)||canvas.height!==Math.round(h*scale)) {canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);}
    const ctx=canvas.getContext('2d'); ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,w,h);
    for(let row=0;row<9;row++) {ctx.beginPath();ctx.strokeStyle=`rgba(${accentRGB.join(',')},${.12+row*.035})`;ctx.lineWidth=row===4?1.5:1;
      for(let x=0;x<=w;x+=3) {const u=x/Math.max(w,1);const response=.65;const y=h/2+Math.sin(u*10+phase*.55+row*.22)*Math.cos(u*4-phase*.25)*Math.sin(u*Math.PI)*h*.30*response+(row-4)*3;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  }
  function close() { clearTimeout(idleTimer);root.dataset.idle='false';root.hidden=true;cancelAnimationFrame(frame);if(document.fullscreenElement===root) document.exitFullscreen().catch(()=>{});oldFocus?.focus(); }
  launch.onclick = () => {oldFocus=document.activeElement;root.hidden=false;checkedURI='';update();wakeControls();get('exit').focus();previous=0;cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};
  get('exit').onclick=close;
  get('fullscreen').onclick=async()=>{try{if(document.fullscreenElement===root) await document.exitFullscreen();else await root.requestFullscreen();}catch{text('status','Use Spotify’s View menu to enter fullscreen.');}};
  document.addEventListener('keydown',e=>{if(!root.hidden&&e.key==='Escape'){close();e.stopPropagation();}});
  setInterval(update,500);
  if(globalThis.__RESONANCE_TEST__) globalThis.__RESONANCE_TEST_API__={loadLyrics,drawLyrics,setLyricLine,flashStatus,renderUpNext,artistCredits,queuedTracks,canHideControls,wakeControls,playbackSource,seekLyric,toggleExpanded,setTheme};
  console.info('[Resonance] Artwork display ready');
})();
