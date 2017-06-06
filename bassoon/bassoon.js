import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Just, Nothing, map, sort } from 'sanctuary';
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
  return note === state.lower ? state
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
  const uppers = upperNotes(fingeringData, lowerNotes[state.lower]);
  return note === state.upper ? state
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
  const currentTrillFingerings = fingeringData[lowerNotes[state.lower]][upperNotes(fingeringData, lowerNotes[state.lower])[state.upper]];
  return i === state.index ? state
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
    drawNotes(newLowerNote, newUpperNotes[newState.upper], newUpperNotes);
  }
  const fingering = fingeringData[newLowerNote][newUpperNotes[newState.upper]][newState.index];
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
