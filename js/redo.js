'use strict';

var degreeTable = ['c','c','d','e','e','f','f','g','g','a','b','b'];
var accidentalTable = [null, '#', null, 'b', null, null, '#', null, '#', null, 'b', null];

function noteFor(clef, midi_num) {
    var VF = Vex.Flow;
    var octave = Math.floor(midi_num/12) - 1;
    var degree_num = midi_num % 12;
    var degree = degreeTable[degree_num];
    var note = new VF.StaveNote({clef: clef, keys: [degree+"/"+octave], duration: "q"});

    var accidentalSymbol = accidentalTable[degree_num];
    if (accidentalSymbol) {
        note.addAccidental(0, new VF.Accidental(accidentalSymbol));
    }
    return note;
}

function drawNotes(lower, upper) {
    var VF = Vex.Flow;
    var element = document.getElementById("note");
    // empty out the element first
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }

    var renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
    renderer.resize(200, 100);
    var context = renderer.getContext();

    var clef = "tenor";

    var stave = new VF.Stave(0, 0, 200);
    stave.addClef(clef).setContext(context).draw();

    var voice = new VF.Voice({num_beats: 2,  beat_value: 4});
    voice.addTickables([noteFor(clef, lower), noteFor(clef, upper)]);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
}

function fetchJson() {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', 'new-fingerings.json', true);
        req.overrideMimeType('application/json');
        req.onload = function() {
            resolve(req.responseText);
        };
        req.send(null);
    }).then(JSON.parse);
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
    var state = {
        lower: 64,
        upper: 67,
        index: 0
    };
    var render = function(newState, oldState) {
        if (!oldState ||
            newState.lower !== oldState.lower ||
            newState.upper !== oldState.upper) {
            drawNotes(newState.lower, newState.upper);
        }
        var fingering = fingerings[newState.lower][newState.upper][newState.index];
        renderFingering(fingering);
        console.log(fingering);
        state = newState;
    };

    var tryNote = function(noteToTry) { return function() {
        if (noteToTry(state) in fingerings) {
            var newLower = noteToTry(state);
            var newUpper = Math.min.apply(null, Object.keys(fingerings[newLower]));
            var newState = {
                lower: newLower,
                upper: newUpper,
                index: 0
            };
            render(newState, state);
        }
    }};

    var prevNoteButton = document.getElementById('prevNote');
    prevNoteButton.addEventListener('click', tryNote( function(state) {
        return state.lower-1;
    }));
    var nextNoteButton = document.getElementById('nextNote');
    nextNoteButton.addEventListener('click', tryNote( function(state) {
        return state.lower+1;
    }));
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

fetchJson()
    .then(initialize)
    .catch(function(error) {
        console.log('error');
        console.log(error);
    });

