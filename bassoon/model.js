import $ from 'sanctuary-def';
import fingeringData from './fingerings.json';
import S, { Fingering, FingeringState, State, def } from './types';

// fingering state functions //
export const lowerNotes = S.sort(S.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return S.sort(S.keys(fingerings[lower]));
}

export const setLower =
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

export const initialState =
def('initialState', {}, [State],
    () => ({
      fingeringState: initialFingeringState(),
    }));
