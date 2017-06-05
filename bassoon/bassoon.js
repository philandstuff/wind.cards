import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Just, Nothing, map, sort } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import fingeringData from './fingerings.json';
import drawNotes from './clef';
import renderFingering from './fingering';

const lowerNotes = sort(Object.keys(fingeringData));
function upperNotes(fingerings, lower) {
  return Object.keys(fingerings[lower]);
}

// state -> maybe state
// implicitly consumes fingeringData
function prevLower(state) {
  const i = lowerNotes.indexOf(state.lower);
  const nextNote = lowerNotes[i - 1];
  return nextNote ?
    Just({
      lower: nextNote,
      upper: upperNotes(fingeringData, nextNote)[0],
      index: 0,
    })
  : Nothing;
}

// state -> maybe state
// implicitly consumes fingeringData
function nextLower(state) {
  const i = lowerNotes.indexOf(state.lower);
  const nextNote = lowerNotes[i + 1];
  return nextNote ?
    Just({
      lower: nextNote,
      upper: upperNotes(fingeringData, nextNote)[0],
      index: 0,
    })
  : Nothing;
}

// state -> maybe state
// implicitly consumes fingeringData
function prevUpper(state) {
  const i = upperNotes(fingeringData, state.lower).indexOf(state.upper);
  const nextNote = upperNotes(fingeringData, state.lower)[i - 1];
  return nextNote ?
    Just({
      lower: state.lower,
      upper: nextNote,
      index: 0,
    })
  : Nothing;
}

function nextUpper(state) {
  const i = upperNotes(fingeringData, state.lower).indexOf(state.upper);
  const nextNote = upperNotes(fingeringData, state.lower)[i + 1];
  return nextNote ?
    Just({
      lower: state.lower,
      upper: nextNote,
      index: 0,
    })
  : Nothing;
}

function prevFingering(state) {
  return (state.index > 0) ?
    Just({
      lower: state.lower,
      upper: state.upper,
      index: state.index - 1,
    })
  : Nothing;
}

function nextFingering(state) {
  const currentTrillFingerings = fingeringData[state.lower][state.upper];
  return (state.index + 1 < currentTrillFingerings.length) ?
    Just({
      lower: state.lower,
      upper: state.upper,
      index: state.index + 1,
    })
  : Nothing;
}

function initialState() {
  return {
    lower: lowerNotes[0],
    upper: upperNotes(fingeringData, lowerNotes[0])[0],
    index: 0,
  };
}


function render(newState, oldState) {
  if (!oldState ||
      newState.lower !== oldState.lower ||
      newState.upper !== oldState.upper) {
    drawNotes(newState.lower, newState.upper, sort(Object.keys(fingeringData[newState.lower])));
  }
  const fingering = fingeringData[newState.lower][newState.upper][newState.index];
  renderFingering(fingering);
}

function initialize() {
  let state = initialState();
  function eventHandler(stateUpdater) {
    return () => {
      const newState = stateUpdater(state);
      map(ns => render(ns, state), newState);
      map((ns) => { state = ns; }, newState);
    };
  }

  document.getElementById('prevLowerNote').addEventListener('click', eventHandler(prevLower));
  document.getElementById('nextLowerNote').addEventListener('click', eventHandler(nextLower));
  document.getElementById('prevUpperNote').addEventListener('click', eventHandler(prevUpper));
  document.getElementById('nextUpperNote').addEventListener('click', eventHandler(nextUpper));
  document.getElementById('prevFingering').addEventListener('click', eventHandler(prevFingering));
  document.getElementById('nextFingering').addEventListener('click', eventHandler(nextFingering));
  render(state);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
