#!/usr/bin/env node
// Optional, manual measurement of Resonance in a real Chromium page with a mocked Spicetify.
// Not part of `npm test`: it needs Google Chrome and takes a few minutes.
//   node tests/perf/measure-browser.cjs [bundle.js] [--seconds=10] [--repeat=3] [--out=result.json]
//   node tests/perf/measure-browser.cjs [bundle.js] --requests     (API/network call counts over a track sequence)
// The page is a stand-in for Spotify (large dummy DOM, mocked player/API), so numbers are useful
// for comparing two builds on one machine, not as absolute Spotify CPU/battery figures.
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const args=process.argv.slice(2),flag=(name,fallback)=>(args.find(a=>a.startsWith('--'+name+'='))||'').split('=')[1]||fallback;
const bundle=path.resolve(args.find(a=>!a.startsWith('--'))||path.join(__dirname,'../../resonanceDisplay.js'));
const seconds=Number(flag('seconds',10)),repeat=Number(flag('repeat',3)),out=flag('out','');
const chrome=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const page='file://'+path.join(__dirname,'page.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const median=values=>{const s=[...values].sort((a,b)=>a-b);return s.length?s[Math.floor((s.length-1)/2)]:0;};

async function launch(){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'resonance-perf-'));
  const port=9300+Math.floor(Math.random()*500);
  const proc=spawn(chrome,['--headless=new','--remote-debugging-port='+port,'--user-data-dir='+dir,'--no-first-run','--no-default-browser-check','--window-size=1440,900','--disable-background-timer-throttling','--disable-renderer-backgrounding','--allow-file-access-from-files','about:blank'],{stdio:process.env.CHROME_LOG?['ignore','inherit','inherit']:'ignore'});
  let targets;
  for(let i=0;i<50;i++){try{targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await sleep(200);}
  const target=targets.find(t=>t.type==='page');
  const connect=async url=>{
    const socket=new WebSocket(url);await new Promise(r=>socket.addEventListener('open',r));
    let id=0;const pending=new Map();
    socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){pending.get(message.id)(message);pending.delete(message.id);}});
    const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(method+': '+m.error.message)):resolve(m.result));socket.send(JSON.stringify({id:n,method,params}));});
    return {socket,send};
  };
  const tab=await connect(target.webSocketDebuggerUrl),root=await connect((await (await fetch('http://127.0.0.1:'+port+'/json/version')).json()).webSocketDebuggerUrl);
  const send=tab.send,rootSend=root.send;
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||'evaluate failed');return r.result.value;};
  return {send,rootSend,evaluate,close(){try{tab.socket.close();root.socket.close();}catch{}proc.kill('SIGKILL');fs.rmSync(dir,{recursive:true,force:true});}};
}

async function cpuSeconds(browser){
  const {processInfo}=await browser.rootSend('SystemInfo.getProcessInfo');
  const by={};for(const p of processInfo)by[p.type]=(by[p.type]||0)+p.cpuTime;
  return by;
}
async function metrics(browser){
  const {metrics}=await browser.send('Performance.getMetrics');
  return Object.fromEntries(metrics.map(m=>[m.name,m.value]));
}

async function open(browser,{instrument,context='name',nodes=4000}){
  const url=page+'?bundle='+encodeURIComponent('file://'+bundle)+'&instrument='+(instrument?1:0)+'&context='+context+'&nodes='+nodes;
  await browser.send('Page.navigate',{url});
  for(let i=0;i<100;i++){if(await browser.evaluate('window.__ready===true'))return;await sleep(100);}
  throw Error('Bundle did not load: '+bundle);
}
const click=(browser,selector)=>browser.evaluate('document.querySelector('+JSON.stringify(selector)+').click()');

const scenarios={
  'overlay-closed':{},
  'playing-open':{open:true,playing:true},
  'playing-open-no-context-name':{open:true,playing:true,context:'none'},
  'paused-open':{open:true,playing:false},
  'low-power-playing':{open:true,playing:true,power:'low'}
};

async function runScenario(browser,name,config){
  await open(browser,{instrument:false,context:config.context,nodes:4000});
  if(config.power)await click(browser,'#resonance-power-options button[data-value="'+config.power+'"]');
  if(config.open)await click(browser,'#resonance-launch');
  if(config.playing===false)await browser.evaluate('__mock.setPaused(true)');
  await sleep(2500);
  const [cpuA,metricA]=[await cpuSeconds(browser),await metrics(browser)];
  await sleep(seconds*1000);
  const [cpuB,metricB]=[await cpuSeconds(browser),await metrics(browser)];
  const wall=metricB.Timestamp-metricA.Timestamp,delta=key=>metricB[key]-metricA[key];
  const cpu={};for(const type of new Set([...Object.keys(cpuA),...Object.keys(cpuB)]))cpu[type]=((cpuB[type]||0)-(cpuA[type]||0))/wall*100;
  const total=Object.values(cpu).reduce((a,b)=>a+b,0);
  // Same scenario with counters enabled (separate load so wrappers do not distort CPU numbers).
  await open(browser,{instrument:true,context:config.context,nodes:4000});
  if(config.power)await click(browser,'#resonance-power-options button[data-value="'+config.power+'"]');
  if(config.open)await click(browser,'#resonance-launch');
  if(config.playing===false)await browser.evaluate('__mock.setPaused(true)');
  await sleep(2500);await browser.evaluate('for(const k of Object.keys(__counts))delete __counts[k]');
  await sleep(seconds*1000);
  const counts=await browser.evaluate('({...__counts})');
  const perSecond=Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,+(v/seconds).toFixed(2)]));
  return {name,cpuPercentAllProcesses:+total.toFixed(2),cpuPercentByProcess:Object.fromEntries(Object.entries(cpu).map(([k,v])=>[k,+v.toFixed(2)])),
    mainThreadBusyPercent:+(delta('TaskDuration')/wall*100).toFixed(2),scriptPercent:+(delta('ScriptDuration')/wall*100).toFixed(2),layoutPercent:+(delta('LayoutDuration')/wall*100).toFixed(2),stylePercent:+(delta('RecalcStyleDuration')/wall*100).toFixed(2),
    heapMB:+(metricB.JSHeapUsedSize/1048576).toFixed(2),domNodes:metricB.Nodes,perSecond};
}

// Plays a fixed track sequence (two albums, then revisits) with the album panel open and
// reports how many API/network calls each kind made.
async function requests(){
  const browser=await launch();
  try{
    await open(browser,{instrument:true});
    await click(browser,'#resonance-launch');await click(browser,'#resonance-album-panel-toggle');
    await sleep(1500);
    const sequence=[0,1,2,3,4,5,0,1,2,3,4,5];
    for(const n of sequence){await browser.evaluate('__mock.setTrack('+n+')');await sleep(1300);}
    const counts=await browser.evaluate('({...__counts})');
    const keys=Object.keys(counts).filter(k=>/^(Cosmos|GraphQL|LibraryAPI|getAudioData|fetch)/.test(k)).sort();
    const result={tracksPlayed:sequence.length,distinctTracks:new Set(sequence).size,calls:Object.fromEntries(keys.map(k=>[k,counts[k]]))};
    console.log(JSON.stringify(result,null,2));
  }finally{browser.close();}
}
async function profile(name,config){
  const browser=await launch();
  try{
    await browser.send('Profiler.enable');await open(browser,{instrument:false,context:config.context});
    if(config.power)await click(browser,'#resonance-power-options button[data-value="'+config.power+'"]');
    if(config.open)await click(browser,'#resonance-launch');
    if(config.playing===false)await browser.evaluate('__mock.setPaused(true)');
    await sleep(2000);await browser.send('Profiler.setSamplingInterval',{interval:200});await browser.send('Profiler.start');await sleep(seconds*1000);
    const {profile}=await browser.send('Profiler.stop');
    const self=new Map(),byId=new Map(profile.nodes.map(n=>[n.id,n]));
    profile.samples.forEach((id,i)=>{const n=byId.get(id),f=n.callFrame,key=(f.functionName||'(anonymous)')+':'+f.lineNumber;self.set(key,(self.get(key)||0)+(profile.timeDeltas[i]||0));});
    const total=[...self.values()].reduce((a,b)=>a+b,0);
    console.log(name,'sampled ms',(total/1000).toFixed(0),'of',seconds*1000);
    for(const [key,t] of [...self].sort((a,b)=>b[1]-a[1]).slice(0,18))console.log((t/1000).toFixed(1).padStart(8)+' ms  '+key);
  }finally{browser.close();}
}
(async()=>{
  if(args.includes('--requests')){await requests();return;}
  if(process.env.PROFILE){await profile(process.env.PROFILE,scenarios[process.env.PROFILE]);return;}
  const results={bundle,seconds,repeat,machine:os.cpus()[0].model,scenarios:{}};
  // A fresh browser per run keeps runs independent (no leftover timers, heap or caches).
  for(const [name,config] of Object.entries(scenarios)){
    if(process.env.ONLY&&!process.env.ONLY.split(',').includes(name))continue;
    const runs=[];
    for(let i=0;i<repeat;i++){
      const browser=await launch();
      try{await browser.send('Performance.enable');await browser.send('Page.enable');runs.push(await runScenario(browser,name,config));}
      finally{browser.close();}
    }
    const pick=key=>median(runs.map(r=>r[key]));
    const sample=runs[Math.floor((runs.length-1)/2)];
    results.scenarios[name]={cpuPercentAllProcesses:pick('cpuPercentAllProcesses'),cpuPercentByProcess:sample.cpuPercentByProcess,mainThreadBusyPercent:pick('mainThreadBusyPercent'),scriptPercent:pick('scriptPercent'),layoutPercent:pick('layoutPercent'),stylePercent:pick('stylePercent'),heapMB:pick('heapMB'),domNodes:sample.domNodes,perSecond:sample.perSecond,runsCpu:runs.map(r=>r.cpuPercentAllProcesses)};
    console.error(name,JSON.stringify(results.scenarios[name].runsCpu),'median CPU%',results.scenarios[name].cpuPercentAllProcesses);
  }
  const json=JSON.stringify(results,null,2);if(out)fs.writeFileSync(out,json);else console.log(json);
})().catch(error=>{console.error(error);process.exit(1);});
