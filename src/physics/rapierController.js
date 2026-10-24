// Optional physics adapter: Rapier kinematic capsule vs static city buildings.
// Loaded only when the game supports the optional WASM module.
export async function createPhysicalController(obstacles,spawn){
 const mod=await import('@dimforge/rapier3d-compat');
 const R=mod.default ?? mod;
 await R.init();
 const world=new R.World({x:0,y:0,z:0});
 for(const obstacle of obstacles){
  const body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(obstacle.x,1,obstacle.z));
  world.createCollider(R.ColliderDesc.cuboid(obstacle.halfW,5,obstacle.halfD),body);
 }
 // Edge colliders use the same 29-unit city limits as the fallback.
 for(const [x,z,w,d] of [[-29.4,0,.4,30],[29.4,0,.4,30],[0,-29.4,30,.4],[0,29.4,30,.4]]){
  const body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(x,1,z));
  world.createCollider(R.ColliderDesc.cuboid(w,5,d),body);
 }
 const body=world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(spawn.x,1,spawn.z));
 const collider=world.createCollider(R.ColliderDesc.capsule(.48,.38),body);
 const controller=world.createCharacterController(.03);
 controller.setSlideEnabled(true);
 return {
  move(dx,dz){
   controller.computeColliderMovement(collider,{x:dx,y:0,z:dz});
   const movement=controller.computedMovement();
   const old=body.translation();
   body.setNextKinematicTranslation({x:old.x+movement.x,y:1,z:old.z+movement.z});
   world.step();
   const next=body.translation();
   return {x:next.x,z:next.z};
  },
  reset(x,z){body.setTranslation({x,y:1,z},true);body.setNextKinematicTranslation({x,y:1,z});},
  dispose(){world.free();}
 };
}
