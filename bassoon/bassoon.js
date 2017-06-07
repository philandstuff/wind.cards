import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { I, map, maybe } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import { prevLower, nextLower, prevUpper, nextUpper, prevFingering, nextFingering, initialState, beginTouch, moveTouch, endTouch } from './model';
import render from './view';


function initialize() {
  let state = initialState;
  function eventHandler(stateUpdater) {
    return (e) => {
      const newState = stateUpdater(state, e);
      map(ns => render(ns, state), newState);
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
  render(state);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
