import { create, env } from 'sanctuary';
import $ from 'sanctuary-def';

export const FingeringState = $.RecordType({
  lower: $.Integer,
  upper: $.Integer,
  index: $.Integer,
});

// we can tighten this later.
export const Fingering = $.Object;

const S = create({
  checkTypes: process.env.NODE_ENV === 'development',
  env: env.concat([FingeringState]),
});

export default S;

export const def = $.create({
  checkTypes: process.env.NODE_ENV === 'development',
  env: env.concat([FingeringState]),
});
