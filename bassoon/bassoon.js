import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { I, map, maybe } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import drawNotes from './stave';
import renderFingering from './fingering';
import { fingering, prevLower, nextLower, prevUpper, nextUpper, prevFingering, nextFingering, lowerNote, upperNote, upperNoteChoices, initialState, initialTouchState, beginTouch, moveTouch, endTouch } from './model';


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
  let state = { fingeringState: initialState(), touchState: initialTouchState() };
  function eventHandler(stateUpdater) {
    return (e) => {
      const newState = stateUpdater(state, e);
      map(ns => render(ns.fingeringState, state.fingeringState), newState);
      state = maybe(state,
                    I,
                    newState);
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  }


  document.getElementById('prevLowerNote').addEventListener('click', eventHandler(prevLower));
  document.getElementById('nextLowerNote').addEventListener('click', eventHandler(nextLower));
  document.getElementById('prevUpperNote').addEventListener('click', eventHandler(prevUpper));
  document.getElementById('nextUpperNote').addEventListener('click', eventHandler(nextUpper));
  document.getElementById('prevFingering').addEventListener('click', eventHandler(prevFingering));
  document.getElementById('nextFingering').addEventListener('click', eventHandler(nextFingering));

  const noteDiv = document.getElementById('note');
  noteDiv.addEventListener('touchstart', eventHandler(beginTouch));
  noteDiv.addEventListener('touchmove', eventHandler(moveTouch));
  noteDiv.addEventListener('touchend', eventHandler(endTouch));
  render(state.fingeringState);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
