import hamsters from "hamsters.js";
import { PEGS } from "./constants";

const MAX_THREADS = 8;

hamsters.init({
  maxThreads: MAX_THREADS,
});

const range = n => Array.from(Array(n).keys());

const minBy = (xs, f) =>
  xs.reduce((acc, x) => f(x) < f(acc) ? x : acc);

const ALL_OUTCOMES =
  Array.from(function* () {
    for (const blacks of range(5))
      for (const whites of range(5))
        yield { blacks, whites };
  }())
    .filter(fb => fb.blacks + fb.whites <= 4)
    .filter(fb => !(fb.blacks === 3 && fb.whites === 1));

export const runParallelSubTasksAsync = (filteredSet, unused) => {

  console.log(`[runParallelSubTasksAsync] filteredSet.length: ${filteredSet.length}; unused.length: ${unused.length}`);

  const combineSubTaskResults = subTaskResults =>
    minBy(subTaskResults, x => x.min).guess;

  const params = {
    ALL_OUTCOMES,
    PEGS,
    filteredSet,
    array: unused
  };

  return new Promise(resolve => {
    hamsters.run(
      params,
      subTask,
      function (subTaskResults) {
        const guess2 = combineSubTaskResults(subTaskResults);
        resolve(guess2);
      },
      MAX_THREADS
    );
  });
};

const subTask = () => {

  /* eslint-disable no-undef */
  const hamstersParams = params;
  const hamstersRtn = rtn;
  /* eslint-enable no-undef */

  const ALL_OUTCOMES = hamstersParams.ALL_OUTCOMES;
  const PEGS = hamstersParams.PEGS;
  const filteredSet = hamstersParams.filteredSet;
  const unused = hamstersParams.array;

  console.log(`[subTask] ALL_OUTCOMES.length: ${ALL_OUTCOMES.length}; PEGS: ${PEGS.length}; filteredSet.length: ${filteredSet.length}; unused.length: ${unused.length}`);

  const evaluateGuess = (secret, guess) => {
    const count = (xs, p) => xs.filter(x => x === p).length;
    const add = (a, b) => a + b;
    const sum = PEGS.map(p => Math.min(count(secret, p), count(guess, p))).reduce(add);
    const blacks = secret.filter((peg, index) => peg === guess[index]).length;
    const whites = sum - blacks;
    return { blacks, whites };
  };

  const sameFeedback = (fb1, fb2) =>
    fb1.blacks === fb2.blacks && fb1.whites === fb2.whites;

  const evaluatesToSameFeedback = (code1, feedback) => code2 =>
    sameFeedback(evaluateGuess(code1, code2), feedback);

  const countWithPredicate = (xs, p) =>
    xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0);

  const seed = { min: Number.MAX_VALUE };
  hamstersRtn.data = unused.reduce((currentBest, unusedCode) => {
    const max = ALL_OUTCOMES.reduce((currentMax, outcome) => {
      const count = countWithPredicate(filteredSet, evaluatesToSameFeedback(unusedCode, outcome));
      return Math.max(currentMax, count);
    }, 0);
    return max < currentBest.min ? { min: max, guess: unusedCode } : currentBest;
  }, seed);
};
