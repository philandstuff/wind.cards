import React from 'react';
import ReactDOM from 'react-dom';
import { I, maybe } from 'sanctuary';
import { lowerNotes, initialState, setLower, setUpper, prevFingering, nextFingering, fingering, upperNoteChoices, fingeringsAvailable } from './model';
import Fingering from './fingering';
import VexFlow from './stave';
import TwitterImage from '../twitter.svg';
import FeedbackModal from './feedback';

const fingeringHeight = 64;
const noteHeight = 24;
const feedbackHeight = 4;
const footerHeight = 8;
const viewportHeightPx = document.documentElement.clientHeight;


function FingeringNav(props) {
  const navStyle = {
    width: '10%',
    display: 'flex',
  };
  return (<div style={{ display: 'flex' }}>
    <nav style={navStyle}>
      <button
        style={{ height: fingeringHeight + 'vh' }}
        onClick={props.onPrevFingering}
        disabled={props.disablePrevFingering}
      >←</button>
    </nav>
    <Fingering fingering={props.fingering} height={fingeringHeight + 'vh'} />
    <nav style={navStyle}>
      <button
        style={{ height: fingeringHeight + 'vh' }}
        onClick={props.onNextFingering}
        disabled={props.disableNextFingering}
      >→</button>
    </nav>
  </div>);
}


function NoteNav(props) {
  return (
    <div style={{ display: 'flex' }}>
      <div className="note">
        <VexFlow
          height={ noteHeight * viewportHeightPx / 100 }
          lowerIndex={props.fingeringState.lower}
          lowers={props.lowerNotes}
          upperIndex={props.fingeringState.upper}
          uppers={upperNoteChoices(props.fingeringState)}
          onNewLower={props.onNewLower}
          onNewUpper={props.onNewUpper}
        />
      </div>
    </div>
  );
}


class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fingering: initialState(),
      feedbackModalOpen: false,
    };
    this.prevFingering = this.prevFingering.bind(this);
    this.nextFingering = this.nextFingering.bind(this);
    this.newLower = this.newLower.bind(this);
    this.newUpper = this.newUpper.bind(this);
  }

  prevFingering(e) {
    e.preventDefault();
    this.setState(state => (
      { fingering: maybe(state.fingering, I, prevFingering(state.fingering, null)) }
    ));
  }

  nextFingering(e) {
    e.preventDefault();
    this.setState(state => (
      { fingering: maybe(state.fingering, I, nextFingering(state.fingering, null)) }
    ));
  }

  newLower(n) {
    this.setState(state => {
      const updated = setLower(state.fingering, n);
      return { fingering: maybe(state.fingering, I, updated) };
    });
  }

  newUpper(n) {
    this.setState(state => {
      const updated = setUpper(state.fingering, n);
      return { fingering: maybe(state.fingering, I, updated) };
    });
  }

  render() {
    return (
      <div>
        <main>
          <FingeringNav
            onPrevFingering={this.prevFingering}
            onNextFingering={this.nextFingering}
            disablePrevFingering={this.state.fingering.index === 0}
            disableNextFingering={this.state.fingering.index === fingeringsAvailable(this.state.fingering) - 1}
            fingering={fingering(this.state.fingering)}
          />
          <NoteNav
            lowerNotes={lowerNotes}
            onNewLower={this.newLower}
            onNewUpper={this.newUpper}
            fingeringState={this.state.fingering}
          />
          <button
            type="button"
            onClick={() => this.setState({ feedbackModalOpen: true })}
            style={{
              display: 'inline',
              cursor: 'pointer',
              fontSize: 12,
              textAlign: 'center',
              color: '#ccc',
              background: 'none',
              border: 'none',
              height: feedbackHeight + 'vh',
            }}
          >
            not working?
          </button>
          <FeedbackModal
            isOpen={this.state.feedbackModalOpen}
            onSuccess={() => this.setState({ feedbackModalOpen: false })}
            onRequestClose={() => this.setState({ feedbackModalOpen: false })}
            state={this.state}
          />
        </main>
        <footer style={{
          fontSize: 12,
          textAlign: 'center',
          height: footerHeight + 'vh',
        }}
        >
          <div style={{ padding: 10 }}>
            wind.cards is built by <a href="http://www.philandstuff.com">Philip Potter</a>.
            <a href="https://twitter.com/philandstuff">
              <img alt="twitter profile" width="14" height="14" src={TwitterImage} />
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default function render() {
  ReactDOM.render(<Site />, document.getElementById('site'));
}
