import { solveTask as solveBase } from './class-8-helpers.mjs';
export { loadSource, root } from './class-8-helpers.mjs';

/** Find distinct valid routes, respecting both the move and entry-cost budgets. */
export function routeSolutions(task, limit = 1) {
  const queue = [{ cell: task.start, moves: [], cost: 0, seen: (task.stops ?? []).includes(task.start) ? [task.start] : [] }];
  const visits = new Map(), solutions = [];
  while (queue.length && solutions.length < limit) {
    queue.sort((a, b) => a.cost - b.cost || a.moves.length - b.moves.length);
    const item = queue.shift();
    if (item.cell === task.goal && (task.stops ?? []).every(cell => item.seen.includes(cell))) {
      solutions.push(item.moves);
      continue;
    }
    if (item.moves.length >= task.maxSteps) continue;
    for (const [move, dx, dy] of [['up',0,-1],['right',1,0],['down',0,1],['left',-1,0]]) {
      const x = item.cell % task.width + dx, y = Math.floor(item.cell / task.width) + dy;
      const cell = y * task.width + x;
      if (x < 0 || x >= task.width || y < 0 || y >= task.height || task.blocked.includes(cell)) continue;
      const cost = item.cost + (task.cellCosts?.[String(cell)] ?? 1);
      if (cost > (task.maxCost ?? Infinity)) continue;
      const seen = [...new Set([...item.seen, ...((task.stops ?? []).includes(cell) ? [cell] : [])])].sort((a,b)=>a-b);
      const key = `${cell}:${seen.join(',')}:${item.moves.length+1}:${cost}`;
      const count = visits.get(key) ?? 0;
      if (count >= limit) continue;
      visits.set(key,count+1);
      queue.push({cell,cost,seen,moves:[...item.moves,move]});
    }
  }
  return solutions;
}

export function solveTask(task, evaluateTask) {
  if (task.kind !== 'route') return solveBase(task,evaluateTask);
  const answer = routeSolutions(task)[0];
  if (!answer) throw new Error(`No valid budgeted route: ${task.prompt.en}`);
  return answer;
}

/** Complete wrong submissions for browser edits. Never assume an empty board. */
export function wrongAnswers(task, evaluateTask, diagnoseTask) {
  const correct = solveTask(task, evaluateTask);
  const candidates = [];
  switch (task.kind) {
    case 'choice': candidates.push(...task.options.filter(row => row.id !== task.correct).map(row => row.id)); break;
    case 'select': {
      const extra = task.items.find(row => !correct.includes(row.id));
      if (extra) candidates.push([...correct, extra.id]);
      if (correct.length > 1) candidates.push(correct.slice(1));
      candidates.push(...task.items.map(row => [row.id]));
      break;
    }
    case 'match':
      for (const row of task.rows) {
        const bad = task.options.find(option => option.id !== row.answer);
        if (bad) candidates.push({...correct, [row.id]:bad.id});
      }
      break;
    case 'number':
      for (const field of task.fields) candidates.push({...correct,[field.id]:String(field.answer + 1)});
      break;
    case 'order': candidates.push([...correct].reverse(), [...correct.slice(1),correct[0]]); break;
    case 'binary': candidates.push((task.target === 0 ? 1 : 0).toString(2).padStart(8,'0')); break;
    case 'grid': {
      const extra = Array.from({length:task.width*task.height},(_,i)=>i).find(i=>!correct.includes(i)&&!task.blocked?.includes(i));
      if (extra != null) candidates.push([...correct,extra]);
      if (correct.length>1) candidates.push(correct.slice(1));
      break;
    }
    case 'route': candidates.push(['up'],['left'],['down'],['right']); break;
    case 'model':
      for(let mask=1;mask<2**task.examples.length;mask++) candidates.push(task.examples.filter((_,i)=>mask&(1<<i)).map(row=>row.id));
      break;
  }
  const unique = [...new Map(candidates.map(answer=>[JSON.stringify(answer),answer])).values()];
  const wrong = unique.filter(answer=>diagnoseTask(task,answer).complete&&!evaluateTask(task,answer).correct);
  if(!wrong.length) throw new Error(`No complete wrong browser answer: ${task.kind}: ${task.prompt.en}`);
  return task.kind === 'choice' ? wrong : wrong.slice(0,2);
}
