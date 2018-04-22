// @flow

import {sampleBuffer as _sampleBuffer} from './sampleBuffer';
import {curry2} from '@most/prelude';

export const sampleBuffer = curry2(_sampleBuffer);
