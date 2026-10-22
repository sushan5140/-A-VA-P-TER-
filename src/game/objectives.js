// Fictional civic-safety game objectives. No score or victory conditions yet.
export const ROLE_MISSIONS = Object.freeze({
 student: [{id:'campus',label:'Check in at the campus gate'},{id:'plaza',label:'Establish an accessible meeting point'},{id:'west-route',label:'Confirm a clear pedestrian route'}],
 safety: [{id:'services',label:'Check the civic services access point'},{id:'east-route',label:'Inspect the eastern emergency corridor'},{id:'plaza',label:'Verify the central plaza remains accessible'}],
});
export function createObjectives(role) {
 const tasks = ROLE_MISSIONS[role];
 if (!tasks) throw new Error('Unknown role');
 const completed = new Set();
 return {
  visit(zoneId) { if (tasks.some(t=>t.id===zoneId)) completed.add(zoneId); },
  reset() { completed.clear(); },
  snapshot() { return {completed:completed.size,total:tasks.length,tasks:tasks.map(t=>({...t,done:completed.has(t.id)}))}; }
 };
}
