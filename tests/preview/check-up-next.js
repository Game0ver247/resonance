// Run in the isolated preview after selecting Lyrics + artwork and showing Up Next.
(() => {
  const preview=document.getElementById('resonance-up-next');
  if(preview.hidden)throw Error('Show Up Next before checking hit testing');
  const rect=preview.getBoundingClientRect();
  const hit=document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
  if(!preview.contains(hit))throw Error('Up Next click is intercepted by '+hit?.id+' '+hit?.tagName);
  return 'Up Next receives pointer input';
})();
