import $ from 'sanctuary-def';
import fingeringData from './fingerings.json';
import S, { EventHandler, Fingering, FingeringState, TouchState, State, def } from './types';
import { roundToZero } from './util';

// fingering state functions //
const lowerNotes = S.sort(S.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return S.sort(S.keys(fingerings[lower]));
}

const setLower =
def('setLower', {}, [FingeringState, $.Integer, S.MaybeType(FingeringState)],
    (state, note) =>
    // TODO: clamp value rather than ignoring out-of-bounds
    note === state.lower ? S.Just(state)
    : note < 0 || note >= lowerNotes.length ? S.Nothing
    : S.Just({
      lower: note,
      upper: 0,
      index: 0,
    }));

const setUpper =
def('setUpper', {}, [FingeringState, $.Integer, S.MaybeType(FingeringState)],
    (state, note) => {
      // TODO: clamp value rather than ignoring out-of-bounds
      const uppers = upperNotes(fingeringData, lowerNotes[state.lower]);
      return note === state.upper ? S.Just(state)
        : note < 0 || note >= uppers.length ? S.Nothing
        : S.Just({
          lower: state.lower,
          upper: note,
          index: 0,
        });
    });

const setFingering =
def('setFingering', {}, [FingeringState, $.Integer, S.MaybeType(FingeringState)],
    (state, i) => {
      // TODO: clamp value rather than ignoring out-of-bounds
      const currentTrillFingerings = fingeringData[lowerNotes[state.lower]][upperNotes(fingeringData, lowerNotes[state.lower])[state.upper]];
      return i === state.index ? S.Just(state)
        : i < 0 || i >= currentTrillFingerings.length ? S.Nothing
        : S.Just({
          lower: state.lower,
          upper: state.upper,
          index: i,
        });
    });


const fingeringHandler =
def('fingeringHandler', {}, [$.Function([FingeringState, S.MaybeType(FingeringState)]),
                             State, $.Any, S.MaybeType(State)],
    (f, state) =>
    S.map(fs => ({ fingeringState: fs, touchState: state.touchState }),
        f(state.fingeringState)));

export const prevLower =
  fingeringHandler(fingeringState =>
              setLower(fingeringState, fingeringState.lower - 1));

export const nextLower =
  fingeringHandler(fingeringState =>
              setLower(fingeringState, fingeringState.lower + 1));

export const prevUpper =
  fingeringHandler(fingeringState =>
              setUpper(fingeringState, fingeringState.upper - 1));

export const nextUpper =
  fingeringHandler(fingeringState =>
              setUpper(fingeringState, fingeringState.upper + 1));

export const prevFingering =
  fingeringHandler(fingeringState =>
              setFingering(fingeringState, fingeringState.index - 1));

export const nextFingering =
  fingeringHandler(fingeringState =>
              setFingering(fingeringState, fingeringState.index + 1));


const initialFingeringState =
def('initialFingeringState', {}, [FingeringState],
    () => ({
      lower: 0,
      upper: 0,
      index: 0,
    }));

export const lowerNote =
def('lowerNote', {}, [FingeringState, $.String],
    state => lowerNotes[state.lower]);

export const upperNoteChoices =
def('upperNoteChoices', {}, [FingeringState, $.Array($.String)],
    state => upperNotes(fingeringData, lowerNote(state)));

export const upperNote =
def('upperNote', {}, [FingeringState, $.String],
    state => upperNoteChoices(state)[state.upper]);

export const fingering =
def('fingering', {}, [FingeringState, Fingering],
    state => fingeringData[lowerNote(state)][upperNote(state)][state.index]);

// touch state functions //

export const beginTouch =
def('beginTouch', {}, EventHandler,
    (state, touchEvent) => {
      const rect = touchEvent.currentTarget.getBoundingClientRect();
      const clientX = touchEvent.targetTouches[0].clientX;
      const clientY = touchEvent.targetTouches[0].clientY;
      const rectMiddle = (rect.right + rect.left) / 2;
      const lowerSidep = clientX < rectMiddle;
      return S.Just({
        fingeringState: state.fingeringState,
        touchState: S.Just({
          pressedLowerSide: lowerSidep,
          startY: clientY,
          startNote: lowerSidep ? state.fingeringState.lower : state.fingeringState.upper,
        }),
      });
    });


const setNote =
      ts => ts.pressedLowerSide ? setLower : setUpper;


export const moveTouch =
def('moveTouch', {}, EventHandler,
    (state, touchEvent) =>
    S.chain(ts => {
      const ΔY = touchEvent.targetTouches[0].clientY - ts.startY;
      return S.map(fs => ({
        fingeringState: fs,
        touchState: state.touchState,
      }), setNote(ts)(state.fingeringState, ts.startNote - roundToZero(ΔY / 10)));
    }, state.touchState));

export const endTouch =
def('endTouch', {}, EventHandler,
    (state, touchEvent) => S.Just({
      fingeringState: state.fingeringState,
      touchState: S.Nothing,
    }));

const initialTouchState =
def('initialTouchState', {}, [TouchState],
    () => S.Nothing);

export const initialState =
def('initialState', {}, [State],
    () => ({
      fingeringState: initialFingeringState(),
      touchState: initialTouchState,
    }));
