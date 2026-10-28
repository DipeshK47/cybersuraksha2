export { loadSource, root, routeSolutions, solveTask, wrongAnswers } from './class-9-helpers.mjs';

export function dependencySchedules(task, limit=2) {
  const ids=task.items.map(item=>item.id), schedules=[];
  const edges=task.prerequisites??[];
  function visit(order) {
    if(schedules.length>=limit)return;
    if(order.length===ids.length){schedules.push(order);return;}
    for(const id of ids)if(!order.includes(id)&&edges.filter(edge=>edge.after===id).every(edge=>order.includes(edge.before)))visit([...order,id]);
  }
  visit([]);
  return schedules;
}
