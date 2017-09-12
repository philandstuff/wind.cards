import React from 'react';
import ReactDOM from 'react-dom';
import { fingering, lowerNote, upperNote, upperNoteChoices } from './model';
import Fingering from './fingering';
import drawNotes from './stave';


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


export default function render(prevFingering, nextFingering, newState, oldState) {
  const newFingeringState = newState.fingeringState;
  const newLowerNote = lowerNote(newFingeringState);
  const newUpperNote = upperNote(newFingeringState);
  const newUpperNotes = upperNoteChoices(newFingeringState);
  if (!oldState ||
      newFingeringState.lower !== oldState.fingeringState.lower ||
      newFingeringState.upper !== oldState.fingeringState.upper) {
    drawNotes(document.getElementById('notecanvas'), newLowerNote, newUpperNote, newUpperNotes);
  }
  const toplevel = (
    <FingeringNav
      onPrevFingering={prevFingering}
      onNextFingering={nextFingering}
      fingering={fingering(newFingeringState)}
    />);
  ReactDOM.render(toplevel, document.getElementById('fingering'));
}
