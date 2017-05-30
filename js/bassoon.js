import '../css/bassoon.css'
import Image from '../bassoon.svg'
import fingeringData from '../new-fingerings.json'
const offlinePluginRuntime = require('offline-plugin/runtime')
offlinePluginRuntime.install()
const Vex = require('vexflow')
const VF = Vex.Flow

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
    var degreeTable = ['c','c','d','e','e','f','f','g','g','a','b','b'];
    var accidentalTable = [null, '#', null, 'b', null, null, '#', null, '#', null, 'b', null];

    var octave = Math.floor(midi_num/12) - 1;
    var degree_num = midi_num % 12;
    var degree = degreeTable[degree_num];

    return {
        note: degree+"/"+octave,
        accidental: accidentalTable[degree_num]
    };
}

function noteFor(clef, midi_num) {
    var vfNote = midi2VF(midi_num);
    var note = new VF.StaveNote({clef: clef, keys: [vfNote.note], duration: "q"});

    if (vfNote.accidental) {
        note.addAccidental(0, new VF.Accidental(vfNote.accidental));
    }
    return note;
}

function notesFor(clef, midi_num, midi_nums) {
    var vfNotes = midi_nums.map(function(num) {
        return midi2VF(num);
    });
    var degrees = vfNotes.map(function(vfNote) { return vfNote.note; });
    var note = new VF.StaveNote({clef: clef, keys: degrees, duration: "q"});

    for (var i=0; i<midi_nums.length; i++) {
        var vfNote = vfNotes[i];
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
    var element = document.getElementById("note");
    // empty out the element first
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }

    var renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
    renderer.resize(200, 140);
    var context = renderer.getContext();

    var clef = clefFor(lower);

    var stave = new VF.Stave(0, 0, 200);
    stave.addClef(clef).setContext(context).draw();

    var voice = new VF.Voice({num_beats: 2,  beat_value: 4});
    voice.addTickables([noteFor(clef, lower), notesFor(clef, upper, uppers)]);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
}

var fingeringMap = {
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
    var fingeringElement = document.getElementById('fingering');
    var svgDoc = fingeringElement.contentDocument;
    for (var svgKeyClass in fingeringMap) {
        var fingeringDataName = fingeringMap[svgKeyClass];
        var keyElement = svgDoc.getElementsByClassName(svgKeyClass)[0];
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
    var lowerNotes = Object.keys(fingerings).sort();

    var upperNotes = function(lower) {
        return Object.keys(fingerings[lower]);
    };

    var state = {
        lower: lowerNotes[0],
        upper: upperNotes(lowerNotes[0])[0],
        index: 0
    };
    var render = function(newState, oldState) {
        if (!oldState ||
            newState.lower !== oldState.lower ||
            newState.upper !== oldState.upper) {
            drawNotes(newState.lower, newState.upper, Object.keys(fingerings[newState.lower]).sort());
        }
        var fingering = fingerings[newState.lower][newState.upper][newState.index];
        renderFingering(fingering);
        console.log(fingering);
        state = newState;
    };

    var prevLowerNoteButton = document.getElementById('prevLowerNote');
    prevLowerNoteButton.addEventListener('click', function() {
        var i = lowerNotes.indexOf(state.lower);
        var nextNote = lowerNotes[i-1];
        if (nextNote) {
            var newState = {
                lower: nextNote,
                upper: upperNotes(nextNote)[0],
                index: 0
            };
            render(newState, state);
        }
    });
    var nextLowerNoteButton = document.getElementById('nextLowerNote');
    nextLowerNoteButton.addEventListener('click', function() {
        var i = lowerNotes.indexOf(state.lower);
        var nextNote = lowerNotes[i+1];
        if (nextNote) {
            var newState = {
                lower: nextNote,
                upper: upperNotes(nextNote)[0],
                index: 0
            };
            render(newState, state);
        }
    });
    var prevUpperNoteButton = document.getElementById('prevUpperNote');
    prevUpperNoteButton.addEventListener('click', function() {
        var i = upperNotes(state.lower).indexOf(state.upper);
        var nextNote = upperNotes(state.lower)[i-1];
        if (nextNote) {
            var newState = {
                lower: state.lower,
                upper: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    var nextUpperNoteButton = document.getElementById('nextUpperNote');
    nextUpperNoteButton.addEventListener('click', function() {
        var i = upperNotes(state.lower).indexOf(state.upper);
        var nextNote = upperNotes(state.lower)[i+1];
        if (nextNote) {
            var newState = {
                lower: state.lower,
                upper: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    var prevFingeringButton = document.getElementById('prevFingering');
    prevFingeringButton.addEventListener('click', function() {
        if (state.index > 0) {
            var newState = {
                lower: state.lower,
                upper: state.upper,
                index: state.index-1
            };
            render(newState, state);
        }
    });
    var nextFingeringButton = document.getElementById('nextFingering');
    nextFingeringButton.addEventListener('click', function() {
        var currentTrillFingerings = fingerings[state.lower][state.upper];
        if (state.index+1 < currentTrillFingerings.length) {
            var newState = {
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

