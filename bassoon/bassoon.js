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
  let fingeringState = initialState();
  let touchState = initialTouchState();
  let state = { fingeringState, touchState };
  function eventHandler(stateUpdater) {
    return () => {
      const newFingeringState = stateUpdater(state.fingeringState);
      map(ns => render(ns, state.fingeringState), newFingeringState);
      state = maybe(state,
                    fs => ({ fingeringState: fs, touchState: state.touchState }),
                    newFingeringState);
    };
  }


  document.getElementById('prevLowerNote').addEventListener('click', eventHandler(prevLower));
  document.getElementById('nextLowerNote').addEventListener('click', eventHandler(nextLower));
  document.getElementById('prevUpperNote').addEventListener('click', eventHandler(prevUpper));
  document.getElementById('nextUpperNote').addEventListener('click', eventHandler(nextUpper));
  document.getElementById('prevFingering').addEventListener('click', eventHandler(prevFingering));
  document.getElementById('nextFingering').addEventListener('click', eventHandler(nextFingering));

  function press(e) {
    const newTouchState = beginTouch(fingeringState, e);
    touchState = newTouchState;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  function drag(e) {
    const newState = moveTouch(touchState, fingeringState, e);
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
  const noteDiv = document.getElementById('note');
  noteDiv.addEventListener('touchstart', press);
  noteDiv.addEventListener('touchmove', drag);
  noteDiv.addEventListener('touchend', release);
  render(fingeringState);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
