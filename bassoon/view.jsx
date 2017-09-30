import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { I, maybe } from 'sanctuary';
import { lowerNotes, initialState, setLower, setUpper, prevFingering, nextFingering, fingering, upperNoteChoices, fingeringsAvailable } from './model';
import Fingering from './fingering';
import VexFlow from './stave';
import TwitterImage from '../twitter.svg';


function FingeringNav(props) {
  const navStyle = {
    width: '10%',
    display: 'flex',
  };
  return (<div style={{ display: 'flex' }}>
    <nav style={navStyle}>
      <button
        style={{ height: 350 }}
        onClick={props.onPrevFingering}
        disabled={props.disablePrevFingering}
      >←</button>
    </nav>
    <Fingering fingering={props.fingering} />
    <nav style={navStyle}>
      <button
        style={{ height: 350 }}
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


class FeedbackModal extends React.Component {
  constructor(props) {
    super(props);
    this.sendFeedback = this.sendFeedback.bind(this);
  }

  resetForm() {
    this.feedbackTextarea.value = '';
  }

  sendFeedback() {
    const toSend = {
      name: this.feedbackTextarea.value,
      data: this.props.state,
    };
    fetch('https://feedback.wind.cards', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then(response => {
        this.resetForm();
        this.props.onSuccess();
      })
      .catch(error => console.log('Request failed', error));
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} >
        <h2>What is wrong?</h2>
        <form>
          <textarea id="feedback" ref={c => { this.feedbackTextarea = c; }} />
          <button type="button" onClick={this.sendFeedback}>Submit</button>
        </form>
      </Modal>
    );
  }
}

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};


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
            }}
          >
            not working?
          </button>
          <FeedbackModal
            isOpen={this.state.feedbackModalOpen}
            onSuccess={() => this.setState({ feedbackModalOpen: false })}
            state={this.state}
          />
        </main>
        <footer style={{
          margin: 0,
          padding: 10,
          fontSize: 12,
          textAlign: 'center',
        }}
        >
          wind.cards is built by <a href="http://www.philandstuff.com">Philip Potter</a>.
          <a href="https://twitter.com/philandstuff">
            <img alt="twitter profile" width="14" height="14" src={TwitterImage} />
          </a>
        </footer>
      </div>
    );
  }
}

export default function render() {
  ReactDOM.render(<Site />, document.getElementById('site'));
}
