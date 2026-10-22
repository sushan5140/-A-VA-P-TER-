// Touch D-pad exposes normalized axes while preserving keyboard input.
// Pointer capture avoids stuck movement when a finger slides off a button.
export function createTouchMovement(root) {
 const active=new Map();
 const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
 const buttons=[...root.querySelectorAll('[data-direction]')];
 function stop(e){active.delete(e.pointerId);root.querySelectorAll('[data-direction]').forEach(b=>{if(b.hasPointerCapture?.(e.pointerId))b.releasePointerCapture(e.pointerId);});}
 for(const button of buttons){
  const direction=button.dataset.direction;
  button.addEventListener('pointerdown',e=>{if(!vectors[direction])return;e.preventDefault();button.setPointerCapture(e.pointerId);active.set(e.pointerId,direction);});
  button.addEventListener('pointerup',stop);
  button.addEventListener('pointercancel',stop);
  button.addEventListener('lostpointercapture',e=>active.delete(e.pointerId));
 }
 const clear=()=>active.clear();
 window.addEventListener('blur',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 return {
  getAxes(){let x=0,z=0;for(const direction of active.values()){x+=vectors[direction][0];z+=vectors[direction][1];}return {x:Math.sign(x),z:Math.sign(z)};},
  clear
 };
}
