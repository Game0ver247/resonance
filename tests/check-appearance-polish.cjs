const assert=require('node:assert/strict');
const {createUI}=require('./helpers/ui-harness.cjs');
(async()=>{
 const ui=await createUI(),{api,get}=ui;
 const gray=api.albumAccent(['#333333','#dddddd']);assert(Math.max(...gray)-Math.min(...gray)>90,'monochrome artwork must not produce a gray accent');
 const red=api.albumAccent(['#999999','#a23020']);assert(red[0]-red[1]>80,'album accents should retain a strong chromatic hue');
 const pixels=[];for(let i=0;i<500;i++)pixels.push(100,100,100,255);
 const colors=[[245,35,35],[30,220,50],[30,80,245],[240,220,30],[210,30,220],[20,210,230]];
 for(const color of colors)for(let i=0;i<12;i++)pixels.push(...color,255);
 const palette=api.paletteFromPixels(pixels);assert(palette.length>=7,'small but meaningful cover colors should survive extraction');
 const splashColors=['#ee3333','#33dd44','#3355ee','#dddd33','#dd33dd','#33dddd','#ff9933','#9933ff'];
 api.showPalette(splashColors);const background=get('palette-b').style.background||get('palette-a').style.background;for(const color of splashColors)assert(background.includes(color),'mesh should include '+color);
 const pane=get('expanded-lyrics');pane.onscroll?.();assert.notEqual(pane.dataset.scrolling,'true','automatic lyric scroll should not reveal the scrollbar');
 pane.onwheel();assert.equal(pane.dataset.scrolling,'true');ui.timeouts.at(-1).fn();assert.equal(pane.dataset.scrolling,'false');
 pane.onkeydown({key:'PageDown'});assert.equal(pane.dataset.scrolling,'true');ui.timeouts.at(-1).fn();assert.equal(pane.dataset.scrolling,'false');
 console.log('Passed: vivid album accents, monochrome fallback, minority cover colors, eight mesh splashes and manual-scroll-only scrollbar');
})().catch(error=>{console.error(error);process.exitCode=1});
