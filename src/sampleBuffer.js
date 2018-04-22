// @flow

import type {Stream, Sink, Scheduler, Time, Disposable} from '@most/types';

function createBufferSink<A, T>(
  sampler: Stream<T>,
  sink: Sink<A[]>,
  scheduler: Scheduler
): Sink<A> {
  let active: boolean = true;
  const buffer: A[] = [];
  const error: (time: Time, error: Error) => void = sink.error.bind(sink);

  function flushBuffer(time: Time): void {
    if (buffer.length) {
      sink.event(time, buffer.slice(0));
      buffer.length = 0;
    }
  }

  function end(time: Time): void {
    if (!active) {
      return;
    }
    // Send events left in the buffer if any
    flushBuffer(time);
    // And ending everything
    active = false;
    sink.end(time);
  }

  const disposable: Disposable = sampler.run({
    event: flushBuffer, // emit buffered events if any
    error, // forward errors
    end
  }, scheduler);

  return {
    event: function (ignore: Time, value: A) {
      if (!active) {
        return;
      }
      buffer.push(value);
    },
    error, // forward errors
    end: function (time: Time) {
      disposable.dispose();
      end(time);
    }
  };
}

export function sampleBuffer<A, T>(
  sampler: Stream<T>,
  stream: Stream<A>
): Stream<A[]> {
  return {
    run: (sink: Sink<A[]>, scheduler: Scheduler): Disposable =>
      stream.run(createBufferSink(sampler, sink, scheduler), scheduler)
  };
}
