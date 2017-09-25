import React from 'react';
import ReactDOM from 'react-dom';
import { I, maybe } from 'sanctuary';
import { lowerNotes, initialState, setLower, prevLower, nextLower, setUpper, prevUpper, nextUpper, prevFingering, nextFingering, fingering, upperNote, upperNoteChoices } from './model';
import Fingering from './fingering';
import VexFlow from './stave';


function FingeringNav(props) {
  return (<div className="row">
    <nav>
      <button className="fingering-button" onClick={props.onPrevFingering}>←</button>
    </nav>
    <Fingering fingering={props.fingering} />
    <nav>
      <button className="fingering-button" onClick={props.onNextFingering}>→</button>
    </nav>
  </div>);
}


function NoteNav(props) {
  return (
    <div className="row">
      <nav className="column">
        <button className="half-button" onClick={props.onNextLower}>↑</button>
        <button className="half-button" onClick={props.onPrevLower}>↓</button>
      </nav>
      <VexFlow
        lowerIndex={props.fingeringState.lower}
        lowers={props.lowerNotes}
        upperIndex={props.fingeringState.upper}
        uppers={upperNoteChoices(props.fingeringState)}
        onNewLower={props.onNewLower}
        onNewUpper={props.onNewUpper}
      />
      <nav className="column">
        <button className="half-button" onClick={props.onNextUpper}>↑</button>
        <button className="half-button" onClick={props.onPrevUpper}>↓</button>
      </nav>
    </div>
  );
}


class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState();
    this.prevLower = this.prevLower.bind(this);
    this.nextLower = this.nextLower.bind(this);
    this.prevUpper = this.prevUpper.bind(this);
    this.nextUpper = this.nextUpper.bind(this);
    this.prevFingering = this.prevFingering.bind(this);
    this.nextFingering = this.nextFingering.bind(this);
    this.newLower = this.newLower.bind(this);
    this.newUpper = this.newUpper.bind(this);
  }

  prevLower(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, prevLower(state, null)));
  }

  nextLower(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, nextLower(state, null)));
  }

  prevUpper(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, prevUpper(state, null)));
  }

  nextUpper(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, nextUpper(state, null)));
  }

  prevFingering(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, prevFingering(state, null)));
  }

  nextFingering(e) {
    e.preventDefault();
    this.setState((state) => maybe(state, I, nextFingering(state, null)));
  }

  newLower(n) {
    this.setState(state => {
      const updated = setLower(state, n);
      return maybe(state, I, updated);
    });
  }

  newUpper(n) {
    this.setState(state => {
      const updated = setUpper(state, n);
      return maybe(state, I, updated);
    });
  }

  render() {
    return (
      <div>
        <FingeringNav
          onPrevFingering={this.prevFingering}
          onNextFingering={this.nextFingering}
          fingering={fingering(this.state)}
        />
        <NoteNav
          lowerNotes={lowerNotes}
          onPrevLower={this.prevLower}
          onNextLower={this.nextLower}
          onPrevUpper={this.prevUpper}
          onNextUpper={this.nextUpper}
          onNewLower={this.newLower}
          onNewUpper={this.newUpper}
          fingeringState={this.state}
        />
      </div>
    );
  }
}

export default function render() {
  ReactDOM.render(<Site />, document.getElementById('fingering'));
}
