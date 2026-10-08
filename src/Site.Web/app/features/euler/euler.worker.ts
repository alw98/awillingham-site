import { solvers } from './solvers';
self.onmessage = () => {
  for (let id = 10; id >= 1; id--) {
    try { self.postMessage({ id, answer: solvers[id - 1]() }); }
    catch { self.postMessage({ id, error: 'Unable to calculate answer.' }); }
  }
};
