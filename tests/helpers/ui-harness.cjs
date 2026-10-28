const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const bundle=fs.readFileSync(path.join(__dirname,'../../resonanceDisplay.js'),'utf8');
async function createUI(){
 const fail=false;
 const documentHandlers=new Map();
 const preferences=new Map();
 const elements=new Map(), timers=[], frames=[], calls=[], sockets=[], timeouts=[];
 let lyricFetches=0;let albumRef='';let queueItems=[{uri:'spotify:track:NEXT',uid:'one',metadata:{title:'Next song',artist_name:'Next artist',duration:'180000',image_small_url:'spotify:image:abc'}}];let repeat=0,volume=.6;let progress=4000;let uri='spotify:track:ABC123', saved=false, paused=false, shuffled=false;
 function element(tag='div') { return {matches(){return false},contains(){return false},tag,style:{setProperty(k,v){this[k]=v}},dataset:{},hidden:false,disabled:false,children:[],textContent:'',attributes:{},width:0,height:0,setAttribute(k,v){this.attributes[k]=v},getAttribute(k){return this.attributes[k]},removeAttribute(k){delete this.attributes[k]},replaceChildren(){this.children=[];this.textContent=''},append(...nodes){this.children.push(...nodes);for(const n of nodes) if(n.id) elements.set(n.id,n)},focus(){},getBoundingClientRect(){return{width:900,height:120}},getContext(){return{setTransform(){},clearRect(){},beginPath(){},stroke(){},moveTo(){},lineTo(x,y){calls.push(['point',x,y])}}}}; }
 const doc={createElement:element,head:element(),body:element(),activeElement:element(),getElementById:id=>elements.get(id)||null,querySelector:()=>null,addEventListener(name,handler){if(!documentHandlers.has(name))documentHandlers.set(name,[]);documentHandlers.get(name).push(handler)},fullscreenElement:null};
 // Register the elements of the static template when it is appended.
 const append=doc.body.append;doc.body.append=function(...nodes){append.apply(this,nodes);for(const n of nodes) for(const m of (n.innerHTML||'').matchAll(/id="(resonance-[^"]+)"/g)){const e=element();e.id=m[1];elements.set(e.id,e)}};
 class WS{static OPEN=1;static CONNECTING=0;constructor(){this.readyState=1;sockets.push(this)}close(){this.readyState=3;this.onclose?.()}}
 const player={get data(){return{context:{uri:'spotify:playlist:TEST',metadata:{context_description:'Evening mix'}},nextItems:queueItems,item:{uri,metadata:{title:'Test',artist_name:'Artist',album_title:'Album',album_uri:albumRef}}}},origin:{_state:{isPaused:false}},getRepeat:()=>repeat,setRepeat:async value=>{repeat=value},getVolume:()=>volume,setVolume:async value=>{volume=value},getProgress:()=>progress,seek:async value=>{calls.push(['seek',value]);progress=value},getDuration:()=>180000,isPlaying:()=>!paused,getShuffle:()=>shuffled,setShuffle:async value=>{shuffled=value;calls.push(['shuffle',value])}};
 const context={localStorage:{getItem:key=>preferences.get(key)??null,setItem:(key,value)=>preferences.set(key,value)},__RESONANCE_TEST__:true,AbortController,URLSearchParams,fetch:async()=>{lyricFetches++;return {ok:false}},document:doc,window:{Spicetify:{Player:player,Platform:{LibraryAPI:{contains:async()=>[saved],add:async arg=>{calls.push(['save',arg]);if(fail)throw Error('offline');saved=true},remove:async arg=>{calls.push(['remove',arg]);if(fail)throw Error('offline');saved=false}}}}},Spicetify:null,WebSocket:WS,matchMedia:()=>({matches:false}),performance:{now:()=>100},requestAnimationFrame:fn=>{frames.push(fn);return frames.length},cancelAnimationFrame(){},setInterval:fn=>{timers.push(fn)},setTimeout:(fn,ms)=>{timeouts.push({fn,ms});return timeouts.length},clearTimeout(){},devicePixelRatio:1,windowPlaceholder:null,console:{info(){}}};
 context.window.addEventListener=()=>{};context.Spicetify=context.window.Spicetify;vm.runInNewContext(bundle,context);
 const get=id=>elements.get('resonance-'+id);
 get('album-panel').hidden=true;get('launch').onclick();await new Promise(setImmediate);

 return {get,api:context.__RESONANCE_TEST_API__,context,calls,player,preferences,frames,
  pressKey(key){const event={key,target:{tagName:'BODY'},preventDefault(){},stopPropagation(){}};for(const handler of documentHandlers.get('keydown')||[])handler(event)},setURI(value){uri=value},setProgress(value){progress=value},poll(){timers[0]()},saved(){return saved}};
}
module.exports={createUI,flush:()=>new Promise(setImmediate)};
