import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Just, Nothing, I, chain, map, maybe } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import drawNotes from './stave';
import renderFingering from './fingering';
import { fingering, setLower, setUpper, setFingering, lowerNote, upperNote, upperNoteChoices, initialState } from './model';


function prevLower(state) {
  return setLower(state, state.lower - 1);
}

function nextLower(state) {
  return setLower(state, state.lower + 1);
}

function prevUpper(state) {
  return setUpper(state, state.upper - 1);
}

function nextUpper(state) {
  return setUpper(state, state.upper + 1);
}

function prevFingering(state) {
  return setFingering(state, state.index - 1);
}

function nextFingering(state) {
  return setFingering(state, state.index + 1);
}


function render(newState, oldState) {
  const newLowerNote = lowerNote(newState);
  const newUpperNote = upperNote(newState);
  const newUpperNotes = upperNoteChoices(newState);
  if (!oldState ||
      newState.lower !== oldState.lower ||
      newState.upper !== oldState.upper) {
    drawNotes(document.getElementById('notecanvas'), newLowerNote, newUpperNote, newUpperNotes);
  }
  renderFingering(fingering(newState));
}


function roundToZero(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
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
  return Just({
    pressedLowerSide: lowerSidep,
    startX: relX,
    startY: relY,
    startNote: lowerSidep ? state.lower : state.upper,
  });
}

// (touchState, state) -> Maybe state
function moveTouch(touchState, state, element, touchEvent) {
  const rect = element.getBoundingClientRect();
  const relY = relYpos(rect, touchEvent);
  return chain(ts => {
    const ΔY = relY - ts.startY;
    return ts.pressedLowerSide
      ? setLower(state, ts.startNote - roundToZero(ΔY / 10))
      : setUpper(state, ts.startNote - roundToZero(ΔY / 10));
  }, touchState);
}

function endTouch() {
  return Nothing;
}

function initialTouchState() {
  return Nothing;
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
