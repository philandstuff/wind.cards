import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import './bassoon.css';
import './bassoon.svg';
import fingeringData from './fingerings.json';
import drawNotes from './clef';
import renderFingering from './fingering';

function initialize(fingerings) {
  const lowerNotes = Object.keys(fingerings).sort();

  function upperNotes(lower) {
    return Object.keys(fingerings[lower]);
  }

  let state = {
    lower: lowerNotes[0],
    upper: upperNotes(lowerNotes[0])[0],
    index: 0,
  };
  function render(newState, oldState) {
    if (!oldState ||
        newState.lower !== oldState.lower ||
        newState.upper !== oldState.upper) {
      drawNotes(newState.lower, newState.upper, Object.keys(fingerings[newState.lower]).sort());
    }
    const fingering = fingerings[newState.lower][newState.upper][newState.index];
    renderFingering(fingering);
    state = newState;
  }

  const prevLowerNoteButton = document.getElementById('prevLowerNote');
  prevLowerNoteButton.addEventListener('click', () => {
    const i = lowerNotes.indexOf(state.lower);
    const nextNote = lowerNotes[i - 1];
    if (nextNote) {
      const newState = {
        lower: nextNote,
        upper: upperNotes(nextNote)[0],
        index: 0,
      };
      render(newState, state);
    }
  });
  const nextLowerNoteButton = document.getElementById('nextLowerNote');
  nextLowerNoteButton.addEventListener('click', () => {
    const i = lowerNotes.indexOf(state.lower);
    const nextNote = lowerNotes[i + 1];
    if (nextNote) {
      const newState = {
        lower: nextNote,
        upper: upperNotes(nextNote)[0],
        index: 0,
      };
      render(newState, state);
    }
  });
  const prevUpperNoteButton = document.getElementById('prevUpperNote');
  prevUpperNoteButton.addEventListener('click', () => {
    const i = upperNotes(state.lower).indexOf(state.upper);
    const nextNote = upperNotes(state.lower)[i - 1];
    if (nextNote) {
      const newState = {
        lower: state.lower,
        upper: nextNote,
        index: 0,
      };
      render(newState, state);
    }
  });
  const nextUpperNoteButton = document.getElementById('nextUpperNote');
  nextUpperNoteButton.addEventListener('click', () => {
    const i = upperNotes(state.lower).indexOf(state.upper);
    const nextNote = upperNotes(state.lower)[i + 1];
    if (nextNote) {
      const newState = {
        lower: state.lower,
        upper: nextNote,
        index: 0,
      };
      render(newState, state);
    }
  });
  const prevFingeringButton = document.getElementById('prevFingering');
  prevFingeringButton.addEventListener('click', () => {
    if (state.index > 0) {
      const newState = {
        lower: state.lower,
        upper: state.upper,
        index: state.index - 1,
      };
      render(newState, state);
    }
  });
  const nextFingeringButton = document.getElementById('nextFingering');
  nextFingeringButton.addEventListener('click', () => {
    const currentTrillFingerings = fingerings[state.lower][state.upper];
    if (state.index + 1 < currentTrillFingerings.length) {
      const newState = {
        lower: state.lower,
        upper: state.upper,
        index: state.index + 1,
      };
      render(newState, state);
    }
  });
  render(state);
}

window.onload = () => {
  OfflinePluginRuntime.install();

  initialize(fingeringData);
};
