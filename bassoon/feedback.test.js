import assert from 'assert';

import { midi2sci } from './feedback';

describe('midi2sci', () => {
  it('should return c4 for middle c', () => {
    assert.equal('c4', midi2sci(60));
  });
  it('should return c♯4 for one semitone above middle c', () => {
    assert.equal('c♯4', midi2sci(61));
  });
  it('should return b♭3 for two semitones below middle c', () => {
    assert.equal('b♭3', midi2sci(58));
  });
});
