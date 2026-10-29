const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
function simulate(ui){for(let now=20;now<=1020;now+=1000/120){const frames=ui.frames.splice(0);for(const callback of frames)callback(now);}return ui.calls.filter(call=>call[0]==='point').length;}
(async()=>{
 const active=await createUI();const activePoints=simulate(active);assert(activePoints<95000,'balanced rendering must cap drawing near 30 fps');
 const paused=await createUI();paused.setPaused(true);const pausedPoints=simulate(paused);assert(pausedPoints<4000,'paused playback should not repaint the same waves continuously');
 // Idle states must not wake for every display frame: the next draw waits on a short timer.
 const pendingDraw=ui=>ui.timeouts.filter(t=>!t.cleared&&!t.ran&&t.ms>=50&&t.ms<=100);
 assert.equal(paused.frames.length,0,'paused playback should not keep a per-display-frame callback pending');
 assert.equal(pendingDraw(paused).length,1,'paused playback should wait on exactly one idle timer');
 const idleTimer=pendingDraw(paused)[0];idleTimer.ran=true;idleTimer.fn();assert.equal(paused.frames.length,1,'idle timer should hand off to one animation frame');
 paused.frames.splice(0)[0](2000);assert.equal(paused.frames.length,0);assert.equal(pendingDraw(paused).filter(t=>t!==idleTimer).length,1,'idle chain must continue with a single timer');
 const playing=await createUI();playing.frames.splice(0)[0](20);assert.equal(playing.frames.length,1,'active playback keeps requesting animation frames');
 const closing=await createUI();closing.setPaused(true);simulate(closing);assert.equal(pendingDraw(closing).length,1);closing.get('exit').onclick();assert.equal(pendingDraw(closing).length,0,'closing must cancel the pending idle timer');
 const low=await createUI();low.api.setPower('low');assert.equal(low.get('root').dataset.power,'low');assert.equal(simulate(low),0,'low power should skip wave drawing');assert.equal(low.get('root').dataset.background,'ambient','low power must preserve the chosen background');
 assert.match(low.get('caption').textContent,/LOW POWER/,'power mode should update its status immediately');low.api.setPower('balanced');assert.doesNotMatch(low.get('caption').textContent,/LOW POWER/,'leaving low power should restore analysis status');
 const hidden=await createUI();hidden.setPageHidden(true);assert.equal(simulate(hidden),0,'background pages must not draw');assert.equal(hidden.frames.length,0,'background rendering should stop scheduling itself');
 hidden.setPageHidden(false);assert(simulate(hidden)>0,'visible pages must resume');
 console.log(JSON.stringify({activePoints,pausedPoints,lowPowerPoints:0,hiddenPoints:0}));
})().catch(error=>{console.error(error);process.exitCode=1});
