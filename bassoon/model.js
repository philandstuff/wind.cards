import { Just, Nothing, chain, sort } from 'sanctuary';
import fingeringData from './fingerings.json';
import { roundToZero } from './util';


// fingering state functions //

const lowerNotes = sort(Object.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return sort(Object.keys(fingerings[lower]));
}

export function setLower(state, note) {
  // TODO: clamp value rather than ignoring out-of-bounds
  return note === state.lower ? Just(state)
    : note < 0 || note >= lowerNotes.length ? Nothing
    : Just({
      lower: note,
      upper: 0,
      index: 0,
    });
}

export function setUpper(state, note) {
  // TODO: clamp value rather than ignoring out-of-bounds
  const uppers = upperNotes(fingeringData, lowerNotes[state.lower]);
  return note === state.upper ? Just(state)
    : note < 0 || note >= uppers.length ? Nothing
    : Just({
      lower: state.lower,
      upper: note,
      index: 0,
    });
}

export function setFingering(state, i) {
  // TODO: clamp value rather than ignoring out-of-bounds
  const currentTrillFingerings = fingeringData[lowerNotes[state.lower]][upperNotes(fingeringData, lowerNotes[state.lower])[state.upper]];
  return i === state.index ? Just(state)
    : i < 0 || i >= currentTrillFingerings.length ? Nothing
    : Just({
      lower: state.lower,
      upper: state.upper,
      index: i,
    });
}

export function initialState() {
  return {
    lower: 0,
    upper: 0,
    index: 0,
  };
}

export function lowerNote(state) {
  return lowerNotes[state.lower];
}

export function upperNoteChoices(state) {
  return upperNotes(fingeringData, lowerNote(state));
}

export function upperNote(state) {
  return upperNoteChoices(state)[state.upper];
}

export function fingering(state) {
  return fingeringData[lowerNote(state)][upperNote(state)][state.index];
}

// touch state functions //

// fingeringState -> touchState
export function beginTouch(fingeringState, element, touchEvent) {
  const rect = element.getBoundingClientRect();
  const clientX = touchEvent.targetTouches[0].clientX;
  const clientY = touchEvent.targetTouches[0].clientY;
  const rectMiddle = (rect.right + rect.left) / 2;
  const lowerSidep = clientX < rectMiddle;
  return Just({
    pressedLowerSide: lowerSidep,
    startY: clientY,
    startNote: lowerSidep ? fingeringState.lower : fingeringState.upper,
  });
}

// (touchState, fingeringState) -> Maybe fingeringState
export function moveTouch(touchState, fingeringState, element, touchEvent) {
  const clientY = touchEvent.targetTouches[0].clientY;
  return chain(ts => {
    const ΔY = clientY - ts.startY;
    return ts.pressedLowerSide
      ? setLower(fingeringState, ts.startNote - roundToZero(ΔY / 10))
      : setUpper(fingeringState, ts.startNote - roundToZero(ΔY / 10));
  }, touchState);
}

export function endTouch() {
  return Nothing;
}

export function initialTouchState() {
  return Nothing;
}

