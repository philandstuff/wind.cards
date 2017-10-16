import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';


/* convert midi note to scientific notation */
/* TODO: tests! */
function midi2sci(midiNum) {
  const degreeTable = ['c', 'c', 'd', 'e', 'e', 'f', 'f', 'g', 'g', 'a', 'b', 'b'];
  const accidentalTable = [null, '♯', null, '♭', null, null, '♯', null, '♯', null, '♭', null];

  const octave = Math.floor(midiNum / 12) - 1;
  const degreeNum = midiNum % 12;
  const degree = degreeTable[degreeNum];
  const accidental = accidentalTable[degreeNum];

  return `${degree}${accidental}/${octave}`;
}


export default class FeedbackModal extends React.Component {
  constructor(props) {
    super(props);
    this.sendFeedback = this.sendFeedback.bind(this);
  }

  resetForm() {
    this.feedbackTextarea.value = '';
  }

  sendFeedback() {
    const fingering = this.props.state.fingering;
    const toSend = {
      name: `${midi2sci(fingering.lower)}-${midi2sci(fingering.upper)}.${fingering.index}`,
      data: this.props.state,
      message: this.feedbackTextarea.value,
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
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        overlayClassName="feedback-modal-overlay"
        className="feedback-modal"
      >
        <svg
          viewbox="0 0 40 40"
          style={{
            position: 'absolute',
            width: 40,
            right: 20,
            top: 20,
            cursor: 'pointer',
          }}
          onClick={this.props.onRequestClose}
        >
          <path
            style={{
              stroke: 'black',
              fill: 'transparent',
              strokeLinecap: 'round',
              strokeWidth: 5,
            }}
            d="M 10,10 L 30,30 M 30,10 L 10,30"
          />
        </svg>
        <h2>Report a problem</h2>
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
  onRequestClose: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};
