// Lightweight original synthesized UI tones. No downloaded or unlicensed audio.
export function createGameAudio(){
 let enabled=false, ctx=null;
 function play(kind='tap'){
  if(!enabled)return;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return;
  try{
   if(!ctx)ctx=new AudioContextClass();
   if(ctx.state==='suspended')void ctx.resume();
   const osc=ctx.createOscillator(), gain=ctx.createGain(), now=ctx.currentTime;
   const frequencies={tap:410,mission:660,event:285,finish:785};
   osc.type='sine';osc.frequency.setValueAtTime(frequencies[kind]||410,now);
   gain.gain.setValueAtTime(.0001,now);
   gain.gain.exponentialRampToValueAtTime(.045,now+.012);
   gain.gain.exponentialRampToValueAtTime(.0001,now+.15);
   osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+.16);
  }catch{/* Audio must never interrupt gameplay. */}
 }
 return {play,setEnabled(next){enabled=Boolean(next);if(!enabled&&ctx?.state==='running')void ctx.suspend();return enabled;},isEnabled(){return enabled;}};
}
