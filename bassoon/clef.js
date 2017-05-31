import * as Vex from 'vexflow'

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

export function drawNotes(lower, upper, uppers) {
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
