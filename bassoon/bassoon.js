import './bassoon.css'
import './bassoon.svg'
import fingeringData from './fingerings.json'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import {drawNotes} from './clef.js'

OfflinePluginRuntime.install()

const fingeringMap = {
    // left fingers
    'hole1':'e_hole',
    'top-e♭':'high_e♭',
    'hole2':'d_hole',
    'hole3':'c_hole',
    'low-e♭':'low_e♭',
    'low-c♯':'low_c♯',
    // right fingers
    'c♯-trill':'trill_c♯',
    'hole4':'b_hole',
    'hole5':'a_hole',
    'g':'g_key',
    'f':'f_key',
    'pinkie-f♯':'pinkie_f♯',
    'a♭':'pinkie_a♭',
    // right thumb
    'b♭':'thumb_b♭',
    'pancake':'pancake_key',
    'f♯':'thumb_f♯',
    'thumb-a♭':'thumb_a♭',    
    // left thumb
    'low-b♭':'bottom_b♭',
    'low-b':'bottom_b',
    'low-c':'bottom_c',
    'low-d':'bottom_d',
    'whisper':'whisper',
    'tuning-a':'a_key',
    'top-c':'c_key',
    'top-d':'top_d',
    'c♯':'c♯_key',
};

function renderFingering(fingering) {
    let fingeringElement = document.getElementById('fingering');
    let svgDoc = fingeringElement.contentDocument;
    for (let svgKeyClass in fingeringMap) {
        let fingeringDataName = fingeringMap[svgKeyClass];
        let keyElement = svgDoc.getElementsByClassName(svgKeyClass)[0];
        if (fingering[fingeringDataName] === 'x') {
            keyElement.setAttribute('fill', 'black');
        }
        else if (fingering[fingeringDataName] === 'tr') {
            keyElement.setAttribute('fill', 'blue');
        }
        else if (fingering[fingeringDataName] === '/') {
            keyElement.setAttribute('fill', 'url(#half-hole)');
        }
        else {
            keyElement.removeAttribute('fill');
        }
    }
}

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

Promise.resolve(fingeringData)
    .then(initialize)
    .catch(function(error) {
        console.log('error');
        console.log(error);
    });
