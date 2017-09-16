import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import './bassoon.css';
import './bassoon.svg';
import { beginTouch, moveTouch, endTouch } from './model';
import render from './view';


function initialize() {
  // const noteDiv = document.getElementById('note');
  // noteDiv.addEventListener('touchstart', eventHandler(beginTouch));
  // noteDiv.addEventListener('touchmove', eventHandler(moveTouch));
  // noteDiv.addEventListener('touchend', eventHandler(endTouch));
  render();
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
