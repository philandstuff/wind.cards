import { create, env, MaybeType } from 'sanctuary';
import $ from 'sanctuary-def';

export const FingeringState = $.RecordType({
  lower: $.Integer,
  upper: $.Integer,
  index: $.Integer,
});

// we can tighten this later.
export const Fingering = $.Object;

export const TouchState = MaybeType($.RecordType({
  pressedLowerSide: $.Boolean,
  startY: $.Integer,
  startNote: $.Integer,
}));

export const State = $.RecordType({
  fingeringState: FingeringState,
  touchState: TouchState,
});

export const EventHandler = [State, $.Any, MaybeType(State)];

const S = create({
  checkTypes: true,
  env: env.concat([FingeringState]),
});

export default S;

export const def = $.create({
  checkTypes: true,
  env: env.concat([FingeringState]),
});
