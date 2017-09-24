import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import './bassoon.css';
import './bassoon.svg';
import render from './view';


function initialize() {
  render();
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize();
};
