import {newScheduler, newTimeline, currentTime, delay} from '@most/scheduler';
import {propagateEventTask, propagateEndTask, runEffects, tap} from '@most/core';
import {disposeWith, disposeNone} from '@most/disposable';
import createVirtualTimer from './virtualTimer';

function newEnv() {
  const timer = createVirtualTimer();
  return {tick: timer.tick, scheduler: newScheduler(timer, newTimeline())};
}

function ticks(dt) {
  const {tick, scheduler} = newEnv();
  tick(dt);
  return scheduler;
}

function collectEvents(stream, scheduler) {
  const into = [];
  const s = tap((x) => into.push({time: currentTime(scheduler), value: x}), stream);
  return runEffects(s, scheduler).then(() => into);
}

const collectEventsFor = (nticks, stream) => collectEvents(stream, ticks(nticks));

const appendEvent = (sink, scheduler) => function (s, event) {
  const task = delay(event.time, propagateEventTask(event.value, sink), scheduler);
  return {tasks: s.tasks.concat(task), time: Math.max(s.time, event.time)};
};

const cancelOne = (task) => task.dispose();

const cancelAll = (tasks) => Promise.all(tasks.map(cancelOne));

function runEvents(events, sink, scheduler) {
  const s = events.reduce(appendEvent(sink, scheduler), {tasks: [], time: 0});
  const end = delay(s.time, propagateEndTask(sink), scheduler);
  return disposeWith(cancelAll, s.tasks.concat(end));
}

function atTimes(array) {
  return {
    run: (sink, scheduler) => array.length === 0
      ? disposeNone()
      : runEvents(array, sink, scheduler)
  };
}

const atTime = (time, value) => atTimes([{time, value}]);

const makeEventsFromArray = (dt, a) => atTimes(a.map((value, i) => ({time: i * dt, value})));

const makeEvents = (dt, n) => makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i));

export {
  newEnv,
  ticks,
  collectEvents,
  collectEventsFor,
  makeEventsFromArray,
  makeEvents,
  atTimes,
  atTime
};
