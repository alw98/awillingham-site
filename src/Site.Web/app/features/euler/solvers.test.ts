import { expect, it } from 'vitest';
import { solvers } from './solvers';
import { problems } from './problems';
it('runs the ten original Euler problems with their known answers', () => {
  const answers = [233168, 4613732, 6857, 906609, 232792560, 25164150, 104743, 23514624000, 31875000, 142913828922];
  expect(solvers.map(solve => solve())).toEqual(answers);
  expect(problems.map(p => p.id)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});
