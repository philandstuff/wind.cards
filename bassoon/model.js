import $ from 'sanctuary-def';
import fingeringData from './fingerings.json';
import S, { Fingering, State, def } from './types';

// fingering state functions //
export const lowerNotes = S.sort(S.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return S.sort(S.keys(fingerings[lower]));
}

export const setLower =
def('setLower', {}, [State, $.Integer, S.MaybeType(State)],
    (state, note) =>
    // TODO: clamp value rather than ignoring out-of-bounds
    note === state.lower ? S.Just(state)
    : note < 0 || note >= lowerNotes.length ? S.Nothing
    : S.Just({
      lower: note,
      upper: 0,
      index: 0,
    }));

export const setUpper =
def('setUpper', {}, [State, $.Integer, S.MaybeType(State)],
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
def('setFingering', {}, [State, $.Integer, S.MaybeType(State)],
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


export const prevFingering =
  state => setFingering(state, state.index - 1);

export const nextFingering =
  state => setFingering(state, state.index + 1);


export const initialState =
def('initialState', {}, [State],
    () => ({
      lower: 0,
      upper: 0,
      index: 0,
    }));

export const lowerNote =
def('lowerNote', {}, [State, $.String],
    state => lowerNotes[state.lower]);

export const upperNoteChoices =
def('upperNoteChoices', {}, [State, $.Array($.String)],
    state => upperNotes(fingeringData, lowerNote(state)));

export const upperNote =
def('upperNote', {}, [State, $.String],
    state => upperNoteChoices(state)[state.upper]);

export const fingering =
def('fingering', {}, [State, Fingering],
    state => fingeringData[lowerNote(state)][upperNote(state)][state.index]);
