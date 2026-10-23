// Frame-rate-independent arcade movement. Input vector length controls speed.
export function stepMotion(previous, input, dt, options={}) {
  const topSpeed=options.topSpeed??6;
  const response=options.response??14;
  const braking=options.braking??20;
  const length=Math.hypot(input.x,input.z);
  const strength=Math.min(1,length);
  const targetX=length ? input.x/length*strength*topSpeed : 0;
  const targetZ=length ? input.z/length*strength*topSpeed : 0;
  const rate=length ? response : braking;
  const alpha=1-Math.exp(-rate*Math.max(0,Math.min(dt,.05)));
  return {x:previous.x+(targetX-previous.x)*alpha,z:previous.z+(targetZ-previous.z)*alpha};
}
export function cursorDirection(player,target,stopDistance=.7,slowDistance=2.2) {
  const dx=target.x-player.x,dz=target.z-player.z;
  const length=Math.hypot(dx,dz);
  if(!Number.isFinite(length)||length<=stopDistance)return {x:0,z:0};
  const strength=Math.min(1,(length-stopDistance)/Math.max(.01,slowDistance-stopDistance));
  return {x:dx/length*strength,z:dz/length*strength};
}
