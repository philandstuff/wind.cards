import * as Vex from 'vexflow';

const VF = Vex.Flow;

function clefFor(midiNum) {
  if (midiNum < 57) {
    return 'bass';
  } else if (midiNum < 72) {
    return 'tenor';
  }
  return 'treble';
}

function midi2VF(midiNum) {
  const degreeTable = ['c', 'c', 'd', 'e', 'e', 'f', 'f', 'g', 'g', 'a', 'b', 'b'];
  const accidentalTable = [null, '#', null, 'b', null, null, '#', null, '#', null, 'b', null];

  const octave = Math.floor(midiNum / 12) - 1;
  const degreeNum = midiNum % 12;
  const degree = degreeTable[degreeNum];

  return {
    note: `${degree}/${octave}`,
    accidental: accidentalTable[degreeNum],
  };
}

function noteFor(clef, midiNum) {
  const vfNote = midi2VF(midiNum);
  const note = new VF.StaveNote({ clef, keys: [vfNote.note], duration: 'q' });

  if (vfNote.accidental) {
    note.addAccidental(0, new VF.Accidental(vfNote.accidental));
  }
  return note;
}

function notesFor(clef, midiNum, midiNums) {
  const vfNotes = midiNums.map(num => midi2VF(num));
  const degrees = vfNotes.map(vfNote => vfNote.note);
  const note = new VF.StaveNote({ clef, keys: degrees, duration: 'q' });

  for (let i = 0; i < midiNums.length; i += 1) {
    const vfNote = vfNotes[i];
    if (vfNote.accidental) {
      note.addAccidental(i, new VF.Accidental(vfNote.accidental));
    }
    if (i !== midiNums.indexOf(midiNum)) {
      note.setKeyStyle(i, { fillStyle: 'gray' });
    }
  }

  return note;
}

export default function drawNotes(lower, upper, uppers) {
  const element = document.getElementById('note');
  // empty out the element first
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }

  const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
  renderer.resize(200, 140);
  const context = renderer.getContext();

  const clef = clefFor(lower);

  const stave = new VF.Stave(0, 0, 200);
  stave.addClef(clef).setContext(context).draw();

  const voice = new VF.Voice({ num_beats: 2, beat_value: 4 });
  voice.addTickables([noteFor(clef, lower), notesFor(clef, upper, uppers)]);

  new VF.Formatter().joinVoices([voice]).format([voice], 200);
  voice.draw(context, stave);
}
