const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync('Spotify-Customization/resonanceDisplay.js','utf8');
async function scenario({fail=false}={}) {
 const elements=new Map(), timers=[], frames=[], calls=[], sockets=[], timeouts=[];
 let repeat=0,volume=.6;let progress=4000;let uri='spotify:track:ABC123', saved=false, paused=false, shuffled=false;
 function element(tag='div') { return {matches(){return false},contains(){return false},tag,style:{setProperty(k,v){this[k]=v}},dataset:{},hidden:false,disabled:false,children:[],textContent:'',attributes:{},width:0,height:0,setAttribute(k,v){this.attributes[k]=v},getAttribute(k){return this.attributes[k]},removeAttribute(k){delete this.attributes[k]},replaceChildren(){this.children=[];this.textContent=''},append(...nodes){this.children.push(...nodes);for(const n of nodes) if(n.id) elements.set(n.id,n)},focus(){},getBoundingClientRect(){return{width:900,height:120}},getContext(){return{setTransform(){},clearRect(){},beginPath(){},stroke(){},moveTo(){},lineTo(x,y){calls.push(['point',x,y])}}}}; }
 const doc={createElement:element,head:element(),body:element(),activeElement:element(),getElementById:id=>elements.get(id)||null,querySelector:()=>null,addEventListener(){},fullscreenElement:null};
 // Register the elements of the static template when it is appended.
 const append=doc.body.append;doc.body.append=function(...nodes){append.apply(this,nodes);for(const n of nodes) for(const m of (n.innerHTML||'').matchAll(/id="(resonance-[^"]+)"/g)){const e=element();e.id=m[1];elements.set(e.id,e)}};
 class WS{static OPEN=1;static CONNECTING=0;constructor(){this.readyState=1;sockets.push(this)}close(){this.readyState=3;this.onclose?.()}}
 const player={get data(){return{context:{uri:'spotify:playlist:TEST',metadata:{context_description:'Evening mix'}},nextItems:[{uri:'spotify:track:NEXT',metadata:{title:'Next song',artist_name:'Next artist'}}],item:{uri,metadata:{title:'Test',artist_name:'Artist',album_title:'Album'}}}},origin:{_state:{isPaused:false}},getRepeat:()=>repeat,setRepeat:async value=>{repeat=value},getVolume:()=>volume,setVolume:async value=>{volume=value},getProgress:()=>progress,seek:async value=>{calls.push(['seek',value]);progress=value},getDuration:()=>180000,isPlaying:()=>!paused,getShuffle:()=>shuffled,setShuffle:async value=>{shuffled=value;calls.push(['shuffle',value])}};
 const context={__RESONANCE_TEST__:true,AbortController,URLSearchParams,fetch:async()=>({ok:false}),document:doc,window:{Spicetify:{Player:player,Platform:{LibraryAPI:{contains:async()=>[saved],add:async arg=>{calls.push(['save',arg]);if(fail)throw Error('offline');saved=true},remove:async arg=>{calls.push(['remove',arg]);if(fail)throw Error('offline');saved=false}}}}},Spicetify:null,WebSocket:WS,matchMedia:()=>({matches:false}),performance:{now:()=>100},requestAnimationFrame:fn=>{frames.push(fn);return frames.length},cancelAnimationFrame(){},setInterval:fn=>{timers.push(fn)},setTimeout:(fn,ms)=>{timeouts.push({fn,ms});return timeouts.length},clearTimeout(){},devicePixelRatio:1,windowPlaceholder:null,console:{info(){}}};
 context.window.addEventListener=()=>{};context.Spicetify=context.window.Spicetify;vm.runInNewContext(source,context);
 const get=id=>elements.get('resonance-'+id);
 get('launch').onclick();await new Promise(setImmediate);
 assert.equal(get('like').attributes['aria-pressed'],'false');
 await get('like').onclick();
 assert.equal(calls.filter(x=>x[0]==='save').length,1);
 assert.equal(calls.find(x=>x[0]==='save')[1].uris[0],'spotify:track:ABC123');
 if(fail){assert.match(get('status').textContent,/Couldn’t update/);assert.equal(get('like').disabled,false)}
 else {assert.equal(get('like').attributes['aria-pressed'],'true');await get('like').onclick();assert.equal(calls.filter(x=>x[0]==='save').length,1);assert.equal(calls.filter(x=>x[0]==='remove').length,1);assert.equal(get('like').attributes['aria-pressed'],'false')}
 uri='spotify:track:OTHER';timers[0]();await new Promise(setImmediate);assert.equal(get('like').attributes['aria-pressed'],'false'); // mock library reports current saved state
 await get('shuffle').onclick();assert.equal(shuffled,true);assert.equal(get('shuffle').attributes['aria-pressed'],'true');await get('shuffle').onclick();assert.equal(shuffled,false);
 frames.shift()(200);frames.shift()(240);assert.ok(calls.filter(x=>x[0]==='point').every(x=>Number.isFinite(x[2])));
 assert.equal(sockets.length,0);
 const api=context.__RESONANCE_TEST_API__;api.setTheme('sky');assert.equal(get('root').style['--accent'],'rgb(161,203,236)');api.setTheme('unknown');assert.equal(get('root').style['--accent'],'rgb(191,220,179)');assert.equal(api.playbackSource(),'PLAYING FROM Playlist · Evening mix');
 assert.equal(api.artistCredits({metadata:{artist_name:'Main','artist_name:2':'Guest B','artist_name:1':'Guest A'}}),'Main, Guest A, Guest B');assert.equal(api.artistCredits({artists:[{name:'Main'},{name:'Guest'},{name:'Main'}]}),'Main, Guest');
 api.flashStatus('Synthetic saved confirmation');assert.equal(get('status').textContent,'Synthetic saved confirmation');timeouts.filter(t=>t.ms===2400).at(-1).fn();assert.equal(get('status').textContent,'');
 const fades=[];get('status').animate=(frames,options)=>{const animation={frames,options,cancel(){this.cancelled=true}};fades.push(animation);return animation};api.flashStatus('Added to Liked Songs');timeouts.filter(t=>t.ms===2400).at(-1).fn();assert.equal(get('status').textContent,'Added to Liked Songs');assert.equal(fades.at(-1).options.duration,450);const oldFade=fades.at(-1);api.flashStatus('Removed from Liked Songs');oldFade.onfinish();assert.equal(get('status').textContent,'Removed from Liked Songs');timeouts.filter(t=>t.ms===2400).at(-1).fn();fades.at(-1).onfinish();assert.equal(get('status').textContent,'');
 api.setLyricLine('Synthetic first line',false);assert.equal(get('lyric-line').textContent,'Synthetic first line');assert.equal(get('lyric-line').children.length,0);
 const animations=[];get('lyric-line').animate=(frames,options)=>{const animation={frames,options,cancel(){this.cancelled=true}};animations.push(animation);return animation};
 api.setLyricLine('Synthetic next line');assert.equal(animations[0].options.duration,130);animations[0].onfinish();assert.equal(get('lyric-line').textContent,'Synthetic next line');assert.equal(animations[1].options.duration,280);
 const bar=get('track');bar.onpointerdown();bar.value='90000';bar.oninput();timers[0]();assert.equal(bar.value,'90000');await bar.onchange();assert.equal(calls.at(-1)[1],90000);
 bar.onpointerdown();bar.value='1000';bar.oninput();await bar.onchange();assert.equal(calls.at(-1)[1],1000);
 bar.onpointerdown();bar.value='60000';bar.oninput();uri='spotify:track:CHANGED';const count=calls.filter(c=>c[0]==='seek').length;await bar.onchange();assert.equal(calls.filter(c=>c[0]==='seek').length,count);
 api.renderUpNext(165000,180000);assert.equal(get('up-next').hidden,false);assert.equal(get('up-next-title').textContent,'Next song');api.renderUpNext(80000,180000);assert.equal(get('up-next').hidden,true);
 await get('repeat').onclick();assert.equal(repeat,1);await get('repeat').onclick();assert.equal(repeat,2);await get('repeat').onclick();assert.equal(repeat,0);
 get('themes').hidden=true;get('queue').hidden=true;get('queue-toggle').onclick();assert.equal(get('queue').hidden,false);assert.equal(get('queue-list').children.length,1);get('queue-toggle').onclick();assert.equal(get('queue').hidden,true);
 context.Spicetify.CosmosAsync={get:async()=>({lyrics:{syncType:'LINE_SYNCED',lines:Array.from({length:6},(_,i)=>({startTimeMs:String(i*5000),words:'Synthetic lyric '+i}))}})};
 await api.loadLyrics({title:'Fixture lyrics'},180000);progress=11000;api.drawLyrics();get('lyric-line').animate=undefined; // finish any transition before testing the visible line
 const scrolls=[];get('expanded-lyrics').scrollTo=options=>scrolls.push(options);api.toggleExpanded();assert.equal(get('song-summary').hidden,false);assert.equal(get('expanded-lyrics').hidden,false);assert.equal(get('expanded-lines').children.length,6);assert.equal(get('expanded-lines').children[2].attributes['aria-current'],'true');
 const target=get('expanded-lines').children[3];await target.onclick();assert.equal(progress,15000);assert.equal(scrolls.at(-1).behavior,'smooth');assert.equal(get('expanded-lines').children[3],target);
 const oldLine=get('expanded-lines').children[0],seekCount=calls.filter(c=>c[0]==='seek').length;uri='spotify:track:NEWTRACK';await oldLine.onclick();assert.equal(calls.filter(c=>c[0]==='seek').length,seekCount);
 api.toggleExpanded();assert.equal(get('expanded-lyrics').hidden,true);assert.equal(get('info').style.visibility,'visible');assert.equal(get('song-summary').hidden,true);
 const root=get('root');doc.fullscreenElement=root;api.wakeControls();timeouts.filter(t=>t.ms===3000).at(-1).fn();assert.equal(root.dataset.idle,'true');root.onpointermove();assert.equal(root.dataset.idle,'false');doc.fullscreenElement=null;assert.equal(api.canHideControls(),false);
get('exit').onclick();assert.equal(root.hidden,true);
}
(async()=>{await scenario();await scenario({fail:true});console.log('Passed: save exact track, save/remove toggle, shuffle on/off, error/retry state, track changes, no audio connection, finite ambient canvas output, plain single-line rendering, smooth transition, confirmation timeout, view cleanup')})().catch(e=>{console.error(e);process.exit(1)});
