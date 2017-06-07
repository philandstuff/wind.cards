import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { I, map, maybe } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import drawNotes from './stave';
import renderFingering from './fingering';
import { fingering, setLower, setUpper, setFingering, lowerNote, upperNote, upperNoteChoices, initialState, initialTouchState, beginTouch, moveTouch, endTouch } from './model';


const prevLower = fingeringState =>
      setLower(fingeringState, fingeringState.lower - 1);

const nextLower = fingeringState =>
      setLower(fingeringState, fingeringState.lower + 1);

const prevUpper = fingeringState =>
      setUpper(fingeringState, fingeringState.upper - 1);

const nextUpper = fingeringState =>
      setUpper(fingeringState, fingeringState.upper + 1);

const prevFingering = fingeringState =>
      setFingering(fingeringState, fingeringState.index - 1);

const nextFingering = fingeringState =>
      setFingering(fingeringState, fingeringState.index + 1);


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


function initialize() {
  let fingeringState = initialState();
  let touchState = initialTouchState();
  function eventHandler(stateUpdater) {
    return () => {
      const newState = stateUpdater(fingeringState);
      map(ns => render(ns, fingeringState), newState);
      fingeringState = maybe(fingeringState, I, newState);
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
    const newTouchState = beginTouch(fingeringState, noteDiv, e);
    touchState = newTouchState;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  function drag(e) {
    const newState = moveTouch(touchState, fingeringState, noteDiv, e);
    map(ns => render(ns, fingeringState), newState);
    fingeringState = maybe(fingeringState, I, newState);
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
  render(fingeringState);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
