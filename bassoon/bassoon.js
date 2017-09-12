import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { I, map, maybe } from 'sanctuary';
import './bassoon.css';
import './bassoon.svg';
import { prevLower, nextLower, prevUpper, nextUpper, prevFingering, nextFingering, initialState, beginTouch, moveTouch, endTouch } from './model';
import render from './view';


function initialize() {
  let state = initialState();
  function eventHandler(stateUpdater) {
    return (e) => {
      const newState = stateUpdater(state, e);
      map(ns => render(eventHandler(prevLower), eventHandler(nextLower), eventHandler(prevUpper), eventHandler(nextUpper), eventHandler(prevFingering), eventHandler(nextFingering), ns),
          newState);
      state = maybe(state,
                    I,
                    newState);
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  }


  // const noteDiv = document.getElementById('note');
  // noteDiv.addEventListener('touchstart', eventHandler(beginTouch));
  // noteDiv.addEventListener('touchmove', eventHandler(moveTouch));
  // noteDiv.addEventListener('touchend', eventHandler(endTouch));
  render(eventHandler(prevLower), eventHandler(nextLower), eventHandler(prevUpper), eventHandler(nextUpper), eventHandler(prevFingering), eventHandler(nextFingering), state);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
