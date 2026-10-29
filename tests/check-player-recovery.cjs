const assert=require('node:assert/strict');const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{const ui=await createUI(),{context,player,get}=ui;
 Object.defineProperty(player,'data',{get:()=>({})});player.origin._state={};player.getDuration=()=>0;player.getProgress=()=>0;
 let reads=0;context.Spicetify.Platform.PlayerAPI={getState:()=>{reads++;return {item:{uri:'spotify:track:RECOVERED',metadata:{title:'Recovered song',artist_name:'Artist',album_title:'Album'}},duration:180000,positionAsOfTimestamp:42000,isPaused:true};}};
 ui.poll();assert.equal(get('title').textContent,'Recovered song','direct player state must supply missing wrapper metadata');assert.equal(get('track').disabled,false);assert.equal(get('track').max,'180000');assert.equal(get('track').value,'42000');assert.equal(reads,1,'read direct state once per metadata update, not per render frame');
 context.Spicetify.Platform.PlayerAPI.getState=()=>({});ui.poll();assert.equal(get('title').textContent,'Ready for music','empty direct state must clear old track');
 console.log('Passed: direct player-state recovery, duration/position and stale-state clearing');})().catch(e=>{console.error(e);process.exitCode=1});
