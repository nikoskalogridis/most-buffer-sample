import test from 'tape';
import {collectEventsFor, makeEventsFromArray, makeEvents} from './helpers/testEnv';
import {sampleBuffer} from '../src';
import {curry2} from '@most/prelude';

test('new test', function (t) {
  t.plan(1);
  const deepEqual = curry2(t.deepEqual);
  const sampler = makeEvents(10, 6);
  const source = makeEventsFromArray(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const expected = [
    {time: 10, value: [1, 2]},
    {time: 20, value: [3, 4]},
    {time: 30, value: [5, 6]},
    {time: 40, value: [7, 8]},
    {time: 45, value: [9, 10]}
  ];
  collectEventsFor(50, sampleBuffer(sampler, source))
    .then(deepEqual(expected))
    .catch((err) => t.fail(err.message));
});
