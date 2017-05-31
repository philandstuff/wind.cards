import './bassoon.css'
import './bassoon.svg'
import fingeringData from './fingerings.json'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import * as Vex from 'vexflow'

const VF = Vex.Flow

OfflinePluginRuntime.install()

function clefFor(midi_num) {
    if (midi_num < 57) {
        return "bass";
    }
    else if (midi_num < 72) {
        return "tenor";
    }
    else {
        return "treble";
    }
}

function midi2VF(midi_num) {
    const degreeTable = ['c','c','d','e','e','f','f','g','g','a','b','b'];
    const accidentalTable = [null, '#', null, 'b', null, null, '#', null, '#', null, 'b', null];

    let octave = Math.floor(midi_num/12) - 1;
    let degree_num = midi_num % 12;
    let degree = degreeTable[degree_num];

    return {
        note: degree+"/"+octave,
        accidental: accidentalTable[degree_num]
    };
}

function noteFor(clef, midi_num) {
    let vfNote = midi2VF(midi_num);
    let note = new VF.StaveNote({clef: clef, keys: [vfNote.note], duration: "q"});

    if (vfNote.accidental) {
        note.addAccidental(0, new VF.Accidental(vfNote.accidental));
    }
    return note;
}

function notesFor(clef, midi_num, midi_nums) {
    let vfNotes = midi_nums.map(function(num) {
        return midi2VF(num);
    });
    let degrees = vfNotes.map(function(vfNote) { return vfNote.note; });
    let note = new VF.StaveNote({clef: clef, keys: degrees, duration: "q"});

    for (let i=0; i<midi_nums.length; i++) {
        let vfNote = vfNotes[i];
        if (vfNote.accidental) {
            note.addAccidental(i, new VF.Accidental(vfNote.accidental));
        }
        if (i != midi_nums.indexOf(midi_num)) {
            note.setKeyStyle(i, {fillStyle: 'gray'});
        }
    }

    return note;
}

function drawNotes(lower, upper, uppers) {
    let element = document.getElementById("note");
    // empty out the element first
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }

    let renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
    renderer.resize(200, 140);
    let context = renderer.getContext();

    let clef = clefFor(lower);

    let stave = new VF.Stave(0, 0, 200);
    stave.addClef(clef).setContext(context).draw();

    let voice = new VF.Voice({num_beats: 2,  beat_value: 4});
    voice.addTickables([noteFor(clef, lower), notesFor(clef, upper, uppers)]);

    let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
}

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
