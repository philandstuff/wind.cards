'use strict';

function clefFor(midi_num) {
    return "treble";
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
    var VF = Vex.Flow;

    var vfNote = midi2VF(midi_num);
    var note = new VF.StaveNote({clef: clef, keys: [vfNote.note], duration: "q"});

    if (vfNote.accidental) {
        note.addAccidental(0, new VF.Accidental(vfNote.accidental));
    }
    return note;
}

function drawNote(note) {
    var VF = Vex.Flow;
    var element = document.getElementById("note");
    // empty out the element first
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }

    var renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
    renderer.resize(200, 140);
    var context = renderer.getContext();

    var clef = clefFor(note);

    var stave = new VF.Stave(0, 0, 200);
    stave.addClef(clef).setContext(context).draw();

    var voice = new VF.Voice({num_beats: 1,  beat_value: 4});
    voice.addTickables([noteFor(clef, note)]);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
}

function fetchJson() {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', 'oboe.json', true);
        req.overrideMimeType('application/json');
        req.onload = function() {
            resolve(req.responseText);
        };
        req.send(null);
    }).then(JSON.parse);
}

var allKeys = [
    "first-octave",
    "second-octave",
    "thumb-plate",
    "half-hole1",
    "hole1",
    "spatula",
    "hole2",
    "hole3",
    "left-g♯",
    "left-e♭",
    "left-f",
    "low-b♭",
    "low-b",
    "hole4",
    "right-g♯",
    "hole5",
    "right-f",
    "hole6",
    "banana",
    "low-c",
    "low-c♯",
    "right-e♭"
];

function renderFingering(fingering) {
    var fingeringElement = document.getElementById('fingering');
    var svgDoc = fingeringElement.contentDocument;
    allKeys.forEach(function (key) {
        var keyElement = svgDoc.getElementsByClassName(key)[0];
        if (fingering.indexOf(key) >= 0) {
            keyElement.setAttribute('fill', 'black');
        }
        else {
            keyElement.removeAttribute('fill');
        }
    });
}

function updateButtons(state, notes, fingerings) {
    var prevNoteButton = document.getElementById('prevNote');
    prevNoteButton.disabled = (state.note === notes[0])

    var nextNoteButton = document.getElementById('nextNote');
    nextNoteButton.disabled = (state.note === notes[notes.length-1])

    var prevFingeringButton = document.getElementById('prevFingering');
    prevFingeringButton.disabled = state.index === 0

    var nextFingeringButton = document.getElementById('nextFingering');
    nextFingeringButton.disabled = (state.index === fingerings[state.note].length-1)
}

function initialize(fingerings) {
    var notes = Object.keys(fingerings).sort();

    var state = {
        note: notes[0],
        index: 0
    };
    var render = function(newState, oldState) {
        if (!oldState ||
            newState.note !== oldState.note) {
            drawNote(newState.note);
        }
        var fingering = fingerings[newState.note][newState.index];
        renderFingering(fingering);
        updateButtons(newState, notes, fingerings);
        console.log(fingering);
        state = newState;
    };

    var prevNoteButton = document.getElementById('prevNote');
    prevNoteButton.addEventListener('click', function() {
        var i = notes.indexOf(state.note);
        var nextNote = notes[i-1];
        if (nextNote) {
            var newState = {
                note: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    var nextNoteButton = document.getElementById('nextNote');
    nextNoteButton.addEventListener('click', function() {
        var i = notes.indexOf(state.note);
        var nextNote = notes[i+1];
        if (nextNote) {
            var newState = {
                note: nextNote,
                index: 0
            };
            render(newState, state);
        }
    });
    var prevFingeringButton = document.getElementById('prevFingering');
    prevFingeringButton.addEventListener('click', function() {
        if (state.index > 0) {
            var newState = {
                note: state.note,
                index: state.index-1
            };
            render(newState, state);
        }
    });
    var nextFingeringButton = document.getElementById('nextFingering');
    nextFingeringButton.addEventListener('click', function() {
        var currentFingerings = fingerings[state.note];
        if (state.index+1 < currentFingerings.length) {
            var newState = {
                note: state.note,
                index: state.index+1
            };
            render(newState, state);
        }
    });
    render(state);
}

fetchJson()
    .then(initialize)
    .catch(function(error) {
        console.log('error');
        console.log(error);
    });

