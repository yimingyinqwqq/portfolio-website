import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

// Define note range: from C3 to E5 (adjust to your taste)
const firstNote = MidiNumbers.fromNote("c3");
const lastNote = MidiNumbers.fromNote("e5");

export default function PianoModule() {
  // Initialize a polyphonic synth using Tone.js
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    // Setup the synth when the component mounts
    const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    setSynth(newSynth);
  }, []);

  // When a key is pressed, play the note
  const playNote = (midiNumber) => {
    if (synth) {
      const note = Tone.Frequency(midiNumber, "midi").toNote();
      synth.triggerAttack(note);
    }
  };

  // When a key is released, stop the note
  const stopNote = (midiNumber) => {
    if (synth) {
      const note = Tone.Frequency(midiNumber, "midi").toNote();
      synth.triggerRelease(note);
    }
  };

  // Create keyboard shortcuts (e.g. home row)
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Piano Skills</h2>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={playNote}
        stopNote={stopNote}
        width={600}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    background: "#ffffff",
    padding: "2rem",
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "1.2rem",
    color: "#333",
  },
};