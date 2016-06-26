'use strict';


var fingerings = {
  "56": {
    "57": [
        {
            "a_hole": "x",
            "b_hole": "x",
            "c_hole": "x",
            "d_hole": "x",
            "e_hole": "x",
            "g_key": "x",
            "pinkie_a\u266d": "x",
            "thumb_b\u266d": "tr"
        },
        {
            "a_hole": "x",
            "b_hole": "x",
            "c_hole": "tr",
            "d_hole": "x",
            "e_hole": "/",
            "g_key": "x",
            "pinkie_a\u266d": "x",
            "whisper": "x"
        },
        {
            "a_hole": "x",
            "b_hole": "x",
            "c_hole": "x",
            "d_hole": "x",
            "e_hole": "x",
            "g_key": "tr",
            "pinkie_a\u266d": "x"
        },
        {
            "a_hole": "x",
            "b_hole": "x",
            "c_hole": "x",
            "d_hole": "x",
            "e_hole": "x",
            "g_key": "tr",
            "pinkie_a\u266d": "tr"
        }
    ]
}
};



var stateFromSymbol = {
    x: "closed",
    tr: "trill",
    "/": "half"
};

var degreeToSymbol = ['c', 'c♯',
                      'd', 'e♭',
                      'e',
                      'f', 'f♯',
                      'g', 'g♯',
                      'a', 'b♭',
                      'b'];

function midi_to_display(midi_note) {
    var octave_number = Math.floor(midi_note / 12) - 1;
    var degree = midi_note % 12;
    return degreeToSymbol[degree] + octave_number;
}

var Key = React.createClass({
    render: function() {
        var state = stateFromSymbol[this.props.state];
        var type = this.props.type;
        return <span className={type + " state-" + state}></span>
    }
});

var LeftThumb = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="thumbs column">
              <Key type="top-d key" state={state.d_key} />
              <Key type="top-c key" state={state.c_key} />
              <Key type="tuning-a key" state={state.a_key} />
              <Key type="c♯ key" state={state["c♯"]} />
              <Key type="whisper key" state={state.whisper} />
              <Key type="low-b♭ key" state={state["bottom_b♭"]} />
              <Key type="low-b key" state={state.bottom_b} />
              <Key type="low-c key" state={state.bottom_c} />
              <Key type="low-d key" state={state.bottom_d} />
            </div>;
    }
});

var LeftFingers = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="fingers column">
            <Key type="hole1 hole" state={state.e_hole} />
            <Key type="hole2 hole" state={state.d_hole} />
            <Key type="hole3 hole" state={state.c_hole} />
            <Key type="low-e♭ key" state={state["low_e♭"]} />
            <Key type="low-c♯ key" state={state["low_c♯"]} />
            </div>;
    }
});

var LeftHand = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="left hand">
            <LeftThumb state={state} />
            <LeftFingers state={state} />
        </div>;       
    }
});

var RightThumb = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="thumbs column">
              <Key type="b♭ key" state={state["thumb_b♭"]} />
              <Key type="pancake key" state={state.pancake_key} />
              <Key type="f♯ key" state={state["thumb_f♯"]} />
              <Key type="thumb-a♭ key" state={state["thumb_a♭"]} />
            </div>;
    }
});

var RightFingers = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="fingers column">
            <Key type="hole4 hole" state={state.b_hole} />
            <Key type="hole5 hole" state={state.a_hole} />
            <Key type="g key" state={state.g_key} />
            <Key type="f key" state={state.f_key} />
            <Key type="pinkie-f♯ key" state={state["pinkie_f♯"]} />
            <Key type="a♭ key" state={state["pinkie_a♭"]} />
            </div>;
    }
});

var RightHand = React.createClass({
    render: function() {
        var state = this.props.state;
        return <div className="right hand">
            <RightThumb state={state} />
            <RightFingers state={state} />
        </div>;       
    }
});

var emptyFingering = {
    'a_hole':'o'
};

var Fingering = React.createClass({
    render: function() {
        var lowNote = this.props.state.lowNote;
        var highNote = this.props.state.highNote;
        var fingerings = this.props.state.fingerings;
        var index = this.props.state.index;

        var fingering = emptyFingering;
        if (fingerings[lowNote] && fingerings[lowNote][highNote] && fingerings[lowNote][highNote][index]) {
            fingering = fingerings[lowNote][highNote][index];
        }
        return <section className="fingering">
            <LeftHand state={fingering} />
            <RightHand state={fingering} />
            </section>;
    }
});

var NoteSelector = React.createClass({
    adjustLowNote: function(amount) {
        var that = this;
        return function() {
            console.log(JSON.stringify(that.props.lowNote));
            var newNoteVal = parseInt(that.props.lowNote) + amount;
            that.props.setLowNote('' + newNoteVal);
        };
    },
    render: function() {
        var that = this;
        var fingeringsForLowNote = {};
        if (this.props.lowNote in this.props.fingerings) {
            fingeringsForLowNote = this.props.fingerings[this.props.lowNote];
        }
        var selectedFingerings = [];
        if (this.props.highNote in fingeringsForLowNote) {
            selectedFingerings = fingeringsForLowNote[this.props.highNote];
        }
        return <section>
            <section>
            <button type="button" onClick={this.adjustLowNote(-12)}>← 𝄷</button>
            <button type="button" onClick={this.adjustLowNote(-1)}>←</button>
            <span>{midi_to_display(this.props.lowNote)}</span>
            <button type="button" onClick={this.adjustLowNote(+1)}>→</button>
            <button type="button" onClick={this.adjustLowNote(+12)}>→ 𝄶</button>
            </section>
            <section>
            {Object.keys(fingeringsForLowNote).map(function(highNote) {
                return <HighNoteSelector onUserInput={that.props.setHighNote} highNote={highNote} />;
            })}
            </section>
            <section>
            <TrillSelector prevDisabled={this.props.index == 0} onPrev={this.props.onPrev} nextDisabled={this.props.index == selectedFingerings.length-1} onNext={this.props.onNext} />
            </section>
            </section>;
    }
});

var HighNoteSelector = React.createClass({
    handleClick: function(note) { var that=this; return function(event) {
        that.props.onUserInput(note);
    }},
    render: function() {
        var note = this.props.highNote;
        var that=this;
        return <button key={note} type="button"
                        onClick={that.handleClick(note)}
            >{midi_to_display(note)}</button>;
    }
});

var TrillSelector = React.createClass({
    render: function () {
        return <section id="fingeringNav">
            <button type="button" disabled={this.props.prevDisabled} onClick={this.props.onPrev}>←</button>
            <button type="button" disabled={this.props.nextDisabled} onClick={this.props.onNext}>→</button>
            </section>;
    }
});

var theFingerings = fingerings;

var FingeringSite = React.createClass({
    getInitialState: function() {
        return {
            lowNote: "56",
            highNote: "57",
            fingerings: theFingerings,
            index: 0
        };
    },
    // TODO: fix inconsistent interfaces here
    handleLowNoteUpdate: function(event) {
        this.setState({lowNote: event.target.value});
    },
    setLowNote: function(newLowNote) {
        console.log('setting ' + JSON.stringify(newLowNote));
        console.log(JSON.stringify(this.state.fingerings));
        console.log(JSON.stringify(this.state.fingerings[newLowNote]));
        var fingeringMapForNewLowNote = {};
        if (newLowNote in this.state.fingerings) {
            fingeringMapForNewLowNote = this.state.fingerings[newLowNote]
        };
        var highNoteStrs = Object.keys(fingeringMapForNewLowNote);
        var highNotes = highNoteStrs.map(parseInt);
        var lowestHighNote = Math.min.apply(null,highNotes);
        this.setState({lowNote: newLowNote,
                       highNote: lowestHighNote});
    },
    handleHighNoteUpdate: function(note) {
        this.setState({highNote: note,
                       index: 0});
    },
    handlePreviousFingering: function() {
        this.setState(function(prevState) {
            if (prevState.index > 0) {
                return { index: prevState.index - 1 };
            }
            return {};
        });
    },
    handleNextFingering: function() {
        this.setState(function(prevState) {
            console.log("nextfingering: lownote " + prevState.lowNote + " highnote " + prevState.highNote);
            var numFingerings = prevState.fingerings[prevState.lowNote][prevState.highNote].length;
            console.log("nextfingering: numFingerings: " + numFingerings);
            if (prevState.index + 1 < numFingerings) {
                return { index: prevState.index + 1 };
            }
            return {};
        });
    },
    fetchJson: function() {
        var req = new XMLHttpRequest();
        var self = this;
        req.open('GET', 'new-fingerings.json', true);
        req.overrideMimeType('application/json');
        req.onload = function() {
            if (self.isMounted()) {
                self.setState({fingerings: JSON.parse(req.responseText)});
            }
        };
        req.send(null);
    },
    componentDidMount: function() {
        this.fetchJson();
    },
    render: function() {
        return <section>
            <Fingering state={this.state} />
            <NoteSelector lowNote={this.state.lowNote} highNote={this.state.highNote} index={this.state.index} fingerings={this.state.fingerings} setLowNote={this.setLowNote} setHighNote={this.handleHighNoteUpdate} onPrev={this.handlePreviousFingering} onNext={this.handleNextFingering}/>
            </section>;
    }
});

React.render(<FingeringSite />, document.getElementById('main'));
