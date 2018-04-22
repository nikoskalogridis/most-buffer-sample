import {Stream} from '@most/types';

export function sampleBuffer<A, T>(sampler: Stream<T>, stream: Stream<A>): Stream<A[]>;
export function sampleBuffer<A, T>(sampler: Stream<T>): (stream: Stream<A>) => Stream<A[]>;
