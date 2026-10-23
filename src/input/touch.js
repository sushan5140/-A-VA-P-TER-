// Analog movement in normalized world axes; independent of graphics rendering.
export function joystickAxes(dx,dy,radius=52,deadZone=.10){
 const length=Math.hypot(dx,dy);
 if(!Number.isFinite(length)||length<radius*deadZone)return {x:0,z:0};
 const strength=Math.min(1,length/radius);
 return {x:dx/length*strength,z:dy/length*strength};
}
export function createTouchMovement(root){
 const knob=root.querySelector('.touch-knob');
 let pointer=null,axes={x:0,z:0};
 function update(e){
  const rect=root.getBoundingClientRect();
  const dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2);
  axes=joystickAxes(dx,dy,rect.width*.36);
  knob.style.transform=`translate(-50%, -50%) translate(${axes.x*rect.width*.36}px, ${axes.z*rect.width*.36}px)`;
 }
 function clear(){
  pointer=null;axes={x:0,z:0};knob.style.transform='translate(-50%, -50%)';
 }
 root.addEventListener('pointerdown',e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;root.setPointerCapture(e.pointerId);update(e);});
 root.addEventListener('pointermove',e=>{if(e.pointerId===pointer){e.preventDefault();update(e);}});
 root.addEventListener('pointerup',e=>{if(e.pointerId===pointer)clear();});
 root.addEventListener('pointercancel',e=>{if(e.pointerId===pointer)clear();});
 root.addEventListener('lostpointercapture',e=>{if(e.pointerId===pointer)clear();});
 window.addEventListener('blur',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 return {getAxes:()=>({...axes}),clear};
}
