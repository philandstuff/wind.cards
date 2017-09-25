import { create, env } from 'sanctuary';
import $ from 'sanctuary-def';

export const State = $.RecordType({
  lower: $.Integer,
  upper: $.Integer,
  index: $.Integer,
});

// we can tighten this later.
export const Fingering = $.Object;

const S = create({
  checkTypes: true,
  env: env.concat([State]),
});

export default S;

export const def = $.create({
  checkTypes: true,
  env: env.concat([State]),
});
