import './bassoon.css'
import './bassoon.svg'
import fingeringData from './fingerings.json'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import {drawNotes} from './clef.js'
import {renderFingering} from './fingering.js'

function initialize(fingerings) {
    let lowerNotes = Object.keys(fingerings).sort();

    let upperNotes = function(lower) {
        return Object.keys(fingerings[lower]);
    };

    let state = {
        lower: lowerNotes[0],
        upper: upperNotes(lowerNotes[0])[0],
        index: 0
    };
    let render = function(newState, oldState) {
        if (!oldState ||
            newState.lower !== oldState.lower ||
            newState.upper !== oldState.upper) {
            drawNotes(newState.lower, newState.upper, Object.keys(fingerings[newState.lower]).sort());
        }
        let fingering = fingerings[newState.lower][newState.upper][newState.index];
        renderFingering(fingering);
        console.log(fingering);
        state = newState;
    };

    let prevLowerNoteButton = document.getElementById('prevLowerNote');
    prevLowerNoteButton.addEventListener('click', function() {
        let i = lowerNotes.indexOf(state.lower);
        let nextNote = lowerNotes[i-1];
        if (nextNote) {
            let newState = {
                lower: nextNote,
                upper: upperNotes(nextNote)[0],
                index: 0
            };
            render(newState, state);
        }
    });
    let nextLowerNoteButton = document.getElementById('nextLowerNote');
    nextLowerNoteButton.addEventListener('click', function() {
        let i = lowerNotes.indexOf(state.lower);
        let nextNote = lowerNotes[i+1];
        if (nextNote) {
            let newState = {
                lower: nextNote,
                upper: upperNotes(nextNote)[0],
                index: 0
            };
            render(newState, state);
        }
    });
    let prevUpperNoteButton = document.getElementById('prevUpperNote');
    prevUpperNoteButton.addEventListener('click', function() {
        let i = upperNotes(state.lower).indexOf(state.upper);
        let nextNote = upperNotes(state.lower)[i-1];
        if (nextNote) {
            let newState = {
                lower: state.lower,
                upper: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    let nextUpperNoteButton = document.getElementById('nextUpperNote');
    nextUpperNoteButton.addEventListener('click', function() {
        let i = upperNotes(state.lower).indexOf(state.upper);
        let nextNote = upperNotes(state.lower)[i+1];
        if (nextNote) {
            let newState = {
                lower: state.lower,
                upper: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    let prevFingeringButton = document.getElementById('prevFingering');
    prevFingeringButton.addEventListener('click', function() {
        if (state.index > 0) {
            let newState = {
                lower: state.lower,
                upper: state.upper,
                index: state.index-1
            };
            render(newState, state);
        }
    });
    let nextFingeringButton = document.getElementById('nextFingering');
    nextFingeringButton.addEventListener('click', function() {
        let currentTrillFingerings = fingerings[state.lower][state.upper];
        if (state.index+1 < currentTrillFingerings.length) {
            let newState = {
                lower: state.lower,
                upper: state.upper,
                index: state.index+1
            };
            render(newState, state);
        }
    });
    render(state);
}

OfflinePluginRuntime.install()

Promise.resolve(fingeringData)
    .then(initialize)
    .catch(function(error) {
        console.log('error');
        console.log(error);
    });
