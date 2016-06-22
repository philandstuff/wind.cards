'use strict';


var fingerings = {
    "a♭3": {
        "c4": [
            {
                "e_hole" : "x",
                "d_hole" : "x",
                "c_hole" : "x",
                "b_hole" : "tr",
                "a_hole" : "tr",
                "g_key" : "tr",
                "pinkie_a♭" : "tr",
            }
        ],
        "b♭3": [
            {
                "a_hole" : "x",
                "b_hole" : "x",
                "c_hole" : "x",
                "c_key" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "f_key" : "tr",
                "g_key" : "tr",
                "low_e♭" : "x",
                "pinkie_f♯" : "tr",
                "thumb_b♭" : "x"
            },
            {
                "a_hole" : "tr",
                "b_hole" : "x",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "g_key" : "x",
                "pinkie_a♭" : "x"
            },
            {
                "a_hole" : "x",
                "b_hole" : "tr",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "/",
                "f_key" : "x",
                "g_key" : "x",
                "pinkie_f♯" : "x",
                "thumb_a♭" : "x",
                "whisper" : "x"
            },
            {
                "a_hole" : "x",
                "b_hole" : "tr",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "g_key" : "x",
                "pinkie_a♭" : "x"
            },
            {
                "a_hole" : "tr",
                "b_hole" : "x",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "g_key" : "x",
                "pinkie_a♭" : "x",
                "thumb_b♭" : "x"
            },
            {
                "a_hole" : "x",
                "b_hole" : "x",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "g_key" : "tr",
                "thumb_b♭" : "x"
            },
            {
                "a_hole" : "x",
                "b_hole" : "x",
                "bottom_b" : "x",
                "bottom_c" : "x",
                "c_hole" : "x",
                "d_hole" : "x",
                "e_hole" : "x",
                "f_key" : "tr",
                "g_key" : "tr",
                "low_e♭" : "x",
                "pinkie_f♯" : "tr"
            }
        ]
    }
};



var stateFromSymbol = {
    x: "closed",
    tr: "trill",
    "/": "half"
};

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
              <Key type="low-b♭ key" state={state["low_b♭"]} />
              <Key type="low-b key" state={state.low_b} />
              <Key type="low-c key" state={state.low_c} />
              <Key type="low-d key" state={state.low_d} />
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
              <Key type="pancake key" state={state.pancake} />
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
            <Key type="f key" state={state.low_f} />
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

var LowNoteSelector = React.createClass({
    handleChange: function(event) {
        this.props.onUserInput(event);
    },
    render: function() {
        return <section>
            <h2>Choose low note</h2>
            <select ref="lowNoteInput" onChange={this.handleChange}>
            {Object.keys(this.props.fingerings).map(function(note){
                return <option key={note} value={note}>{note}</option>;
            })}
        </select>
            </section>;
    }
});

var HighNoteSelector = React.createClass({
    handleClick: function(note) { var that=this; return function(event) {
        that.props.onUserInput(note);
    }},
    render: function() {
        var fingerings = this.props.state.fingerings;
        var lowNote = this.props.state.lowNote;
        var availableNotes = Object.keys(fingerings[lowNote]);
        var that=this;
        return <section>
            <h2>Choose high note</h2>
            {availableNotes.map(
                function(note) {
                    return <button key={note} type="button"
                        onClick={that.handleClick(note)}
                        >{note}</button>;
                }
            )}
            </section>;
    }
});

var TrillSelector = React.createClass({
    render: function () {
        return <section id="fingeringNav">
            <h2>Cycle through fingerings</h2>
            <button type="button" onClick={this.props.onPrev}>prev</button>
            <button type="button" onClick={this.props.onNext}>next</button>
            </section>;
    }
});

var theFingerings = fingerings;

var FingeringSite = React.createClass({
    getInitialState: function() {
        return {
            lowNote: "a♭3",
            highNote: "b♭3",
            fingerings: theFingerings,
            index: 0
        };
    },
    // TODO: fix inconsistent interfaces here
    handleLowNoteUpdate: function(event) {
        this.setState({lowNote: event.target.value});
    },
    handleHighNoteUpdate: function(note) {
        this.setState({highNote: note,
                       index: 0});
    },
    handlePreviousFingering: function() {
        this.setState((prevState) => {
            if (prevState.index > 0) {
                return { index: prevState.index - 1 };
            }
            return {};
        });
    },
    handleNextFingering: function() {
        this.setState(prevState => {
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
        req.open('GET', 'moar-fingerings.json', true);
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
            <LowNoteSelector fingerings={this.state.fingerings} onUserInput={this.handleLowNoteUpdate} />
            <HighNoteSelector onUserInput={this.handleHighNoteUpdate} state={this.state} />
            <TrillSelector onPrev={this.handlePreviousFingering} onNext={this.handleNextFingering} />
            </section>;
    }
});

React.render(<FingeringSite />, document.getElementById('main'));
