import React from 'react';
import Swipeable from 'react-swipeable'
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
  constructor(props) {
    super(props);
    this.onSwiped = this.onSwiped.bind(this);
    this.onSwiping = this.onSwiping.bind(this);
    this.state = {};
  }
  componentDidMount() { this.redrawStave(); }
  componentDidUpdate() { this.redrawStave(); }

  onSwiped(e, x, y) {
    this.props.onNewLower && this.props.onNewLower(this.state.newLower);
    this.setState({ newLower: null });
  }

  onSwiping(e, δx, δy) {
    const d = Math.floor(δy/10);
    const rawNewNote = this.props.lowerIndex + d;
    const clamped = rawNewNote < 0 ? 0
                  : rawNewNote >= this.props.lowers.length ? this.props.lowers.length - 1
                  : rawNewNote;
    this.setState({ newLower: clamped });
  }

  clear() {
    this.stave.innerHTML = '';
  }

  redrawStave() {
    this.clear();

    const {
      width = 200,
      height = 140,
      lowerIndex,
      lowers,
      upper,
      uppers,
    } = this.props;
    const lower = this.state.newLower ? lowers[this.state.newLower] : lowers[lowerIndex];

    const renderer = new Flow.Renderer(
      this.stave,
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

  render() {
    return (
      <div className="note" style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            height: 140, // TODO: get from props
            width: 200,
          }}
          ref={c => { this.stave = c; }}
        />
        <Swipeable
          style={{
            position: 'absolute',
            height: 140, // TODO: get from props
            width: 200 / 2,
          }}
          onSwiped={this.onSwiped}
          onSwiping={this.onSwiping}
        />
        <Swipeable
          style={{
            position: 'absolute',
            height: 140, // TODO: get from props
            width: 200 / 2,
            left: 200 / 2,
          }}
          onSwiped={this.onSwiped}
          onSwiping={this.onSwiping}
        />
      </div>
    );
  }
}
