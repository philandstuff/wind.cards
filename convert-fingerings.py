#!/usr/bin/env python3
import json, re

fingerings = json.load(open('moar-fingerings.json'))

def note_value(note):
    return {'c':12,
            'd':14,
            'e':16,
            'f':17,
            'g':19,
            'a':21,
            'b':23}.get(note,0)

def modifier_value(modifier):
    return {'♭':-1,
            '♯':+1}.get(modifier,0)

def midi_note(old_note):
    note, modifier, octave = re.match(r"([a-g])([♭♮♯]?)([0-9])",old_note).groups()
    
    return note_value(note) + modifier_value(modifier) + 12 * int(octave)

new_fingerings = {midi_note(note1):
                  {midi_note(note2): val
                   for note2,val in inner.items()
                  }
                  for note1,inner in fingerings.items()
                  }

json.dump(new_fingerings, open('new-fingerings.json','w'))
