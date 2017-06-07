import { fingering, lowerNote, upperNote, upperNoteChoices } from './model';
import renderFingering from './fingering';
import drawNotes from './stave';


export default function render(newState, oldState) {
  const newFingeringState = newState.fingeringState;
  const newLowerNote = lowerNote(newFingeringState);
  const newUpperNote = upperNote(newFingeringState);
  const newUpperNotes = upperNoteChoices(newFingeringState);
  if (!oldState ||
      newFingeringState.lower !== oldState.fingeringState.lower ||
      newFingeringState.upper !== oldState.fingeringState.upper) {
    drawNotes(document.getElementById('notecanvas'), newLowerNote, newUpperNote, newUpperNotes);
  }
  renderFingering(fingering(newFingeringState));
}
