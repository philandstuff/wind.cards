import { create, env } from 'sanctuary';
import $ from 'sanctuary-def';

export const FingeringState = $.RecordType({
  lower: $.Integer,
  upper: $.Integer,
  index: $.Integer,
});

// we can tighten this later.
export const Fingering = $.Object;

export const State = $.RecordType({
  fingeringState: FingeringState,
});

const S = create({
  checkTypes: true,
  env: env.concat([FingeringState]),
});

export default S;

export const def = $.create({
  checkTypes: true,
  env: env.concat([FingeringState]),
});
