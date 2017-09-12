import React from 'react';
import { Flow } from 'vexflow';

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
  const note = new Flow.StaveNote({
    clef,
    keys: [vfNote.note],
    duration: 'q',
    auto_stem: true,
  });

  if (vfNote.accidental) {
    note.addAccidental(0, new Flow.Accidental(vfNote.accidental));
  }
  return note;
}

function notesFor(clef, midiNum, midiNums) {
  const vfNotes = midiNums.map(num => midi2VF(num));
  const degrees = vfNotes.map(vfNote => vfNote.note);
  const note = new Flow.StaveNote({
    clef,
    keys: degrees,
    duration: 'q',
    auto_stem: true,
  });

  for (let i = 0; i < midiNums.length; i += 1) {
    const vfNote = vfNotes[i];
    if (vfNote.accidental) {
      note.addAccidental(i, new Flow.Accidental(vfNote.accidental));
    }
    if (i !== midiNums.indexOf(midiNum)) {
      note.setKeyStyle(i, { fillStyle: 'gray' });
    }
  }

  return note;
}


export default class VexFlow extends React.Component {
  componentDidMount() { this.handleProps(); }
  componentDidUpdate() { this.handleProps(); }

  handleProps() {
    this.clear();

    const {
      width = 200,
      height = 140,
      lower,
      upper,
      uppers,
    } = this.props;

    const renderer = new Flow.Renderer(
      this.wrapper,
      Flow.Renderer.Backends.SVG,
    );

    renderer.resize(width, height);
    const context = renderer.getContext();

    const clef = clefFor(lower);

    // stave is width-1 to allow final barline to be visible
    const stave = new Flow.Stave(0, 0, width - 1);
    stave.addClef(clef).setContext(context).draw();

    const voice = new Flow.Voice({ num_beats: 2, beat_value: 4 });
    voice.addTickables([noteFor(clef, lower), notesFor(clef, upper, uppers)]);

    new Flow.Formatter().joinVoices([voice]).format([voice], width);

    voice.draw(context, stave);
  }

  clear() {
    this.wrapper.innerHTML = '';
  }

  render() {
    return <div ref={(c) => { this.wrapper = c; }} />;
  }
}
