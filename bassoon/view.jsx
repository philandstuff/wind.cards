import React from 'react';
import ReactDOM from 'react-dom';
import { fingering, lowerNote, upperNote, upperNoteChoices } from './model';
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
        lower={lowerNote(props.fingeringState)}
        upper={upperNote(props.fingeringState)}
        uppers={upperNoteChoices(props.fingeringState)}
      />
      <nav className="column">
        <button className="half-button" onClick={props.onNextUpper}>↑</button>
        <button className="half-button" onClick={props.onPrevUpper}>↓</button>
      </nav>
    </div>
  );
}


function Site(props) {
  return (
    <div>
      <FingeringNav
        onPrevFingering={props.onPrevFingering}
        onNextFingering={props.onNextFingering}
        fingering={fingering(props.fingeringState)}
      />
      <NoteNav
        onPrevLower={props.onPrevLower}
        onNextLower={props.onNextLower}
        onPrevUpper={props.onPrevUpper}
        onNextUpper={props.onNextUpper}
        fingeringState={props.fingeringState}
      />
    </div>
  );
}


export default function render(prevLower, nextLower, prevUpper, nextUpper, prevFingering, nextFingering, newState) {
  const newFingeringState = newState.fingeringState;
  const toplevel = (
    <Site
      onPrevLower={prevLower}
      onNextLower={nextLower}
      onPrevUpper={prevUpper}
      onNextUpper={nextUpper}
      onPrevFingering={prevFingering}
      onNextFingering={nextFingering}
      fingeringState={newFingeringState}
    />);
  ReactDOM.render(toplevel, document.getElementById('fingering'));
}
