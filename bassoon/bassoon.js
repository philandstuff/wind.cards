import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Just, Nothing, I, map, maybe, sort } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import fingeringData from './fingerings.json';
import drawNotes from './clef';
import renderFingering from './fingering';

const lowerNotes = sort(Object.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return sort(Object.keys(fingerings[lower]));
}

function setLower(state, note) {
  // TODO: clamp value rather than ignoring out-of-bounds
  return note === state.lower ? Just(state)
    : note < 0 || note >= lowerNotes.length ? Nothing
    : Just({
      lower: note,
      upper: 0,
      index: 0,
    });
}

function prevLower(state) {
  return setLower(state, state.lower - 1);
}

function nextLower(state) {
  return setLower(state, state.lower + 1);
}

function setUpper(state, note) {
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

function prevUpper(state) {
  return setUpper(state, state.upper - 1);
}

function nextUpper(state) {
  return setUpper(state, state.upper + 1);
}

function setFingering(state, i) {
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

function prevFingering(state) {
  return setFingering(state, state.index - 1);
}

function nextFingering(state) {
  return setFingering(state, state.index + 1);
}

function initialState() {
  return {
    lower: 0,
    upper: 0,
    index: 0,
  };
}


function render(newState, oldState) {
  const newLowerNote = lowerNotes[newState.lower];
  const newUpperNotes = upperNotes(fingeringData, newLowerNote);
  if (!oldState ||
      newState.lower !== oldState.lower ||
      newState.upper !== oldState.upper) {
    drawNotes(document.getElementById('note'), newLowerNote, newUpperNotes[newState.upper], newUpperNotes);
  }
  const fingering = fingeringData[newLowerNote][newUpperNotes[newState.upper]][newState.index];
  renderFingering(fingering);
}


function relYpos(rect, touchevent) {
  const clientY = touchevent.targetTouches[0].clientY;
  return clientY - rect.top;
}

function relXpos(rect, touchevent) {
  const clientX = touchevent.targetTouches[0].clientX;
  return clientX - rect.left;
}

// state -> touchState
function beginTouch(state, element, touchEvent) {
  const rect = element.getBoundingClientRect();
  const relX = relXpos(rect, touchEvent);
  const relY = relYpos(rect, touchEvent);
  const width = rect.right - rect.left;
  const lowerSidep = relX < width / 2;
  console.log(`beginTouch: ${relX},${relY}, on ${lowerSidep ? 'lower' : 'upper'} side`);
  return {
    pressed: true,
    pressedLowerSide: lowerSidep,
    startX: relX,
    startY: relY,
    startNote: lowerSidep ? state.lower : state.upper,
  };
}

// (touchState, state) -> Maybe state
function moveTouch(touchState, state, element, touchEvent) {
  const rect = element.getBoundingClientRect();
  const relY = relYpos(rect, touchEvent);
  const ΔY = relY - touchState.startY;
  console.log(`moveTouch: travelled ${ΔY} from start`);
  return touchState.pressed ?
    setLower(state, touchState.startNote - ((ΔY / 10) | 0))
    : Nothing;
}

function endTouch() {
  return {
    pressed: false,
  };
}

function initialTouchState() {
  return {
    pressed: false,
  };
}


function initialize() {
  let state = initialState();
  let touchState = initialTouchState();
  function eventHandler(stateUpdater) {
    return () => {
      const newState = stateUpdater(state);
      map(ns => render(ns, state), newState);
      state = maybe(state, I, newState);
    };
  }


  document.getElementById('prevLowerNote').addEventListener('click', eventHandler(prevLower));
  document.getElementById('nextLowerNote').addEventListener('click', eventHandler(nextLower));
  document.getElementById('prevUpperNote').addEventListener('click', eventHandler(prevUpper));
  document.getElementById('nextUpperNote').addEventListener('click', eventHandler(nextUpper));
  document.getElementById('prevFingering').addEventListener('click', eventHandler(prevFingering));
  document.getElementById('nextFingering').addEventListener('click', eventHandler(nextFingering));

  const noteDiv = document.getElementById('note');
  function press(e) {
    const newTouchState = beginTouch(state, noteDiv, e);
    touchState = newTouchState;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  function drag(e) {
    const newState = moveTouch(touchState, state, noteDiv, e);
    map(ns => render(ns, state), newState);
    state = maybe(state, I, newState);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  function release(e) {
    const newTouchState = endTouch();
    touchState = newTouchState;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  noteDiv.addEventListener('touchstart', press);
  noteDiv.addEventListener('touchmove', drag);
  noteDiv.addEventListener('touchend', release);
  render(state);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
