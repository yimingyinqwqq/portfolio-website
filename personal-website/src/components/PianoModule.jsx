import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

// Set the note range from "la" to "mi": starting at A3 and ending at E5.
const firstNote = MidiNumbers.fromNote("a3");
const lastNote = MidiNumbers.fromNote("e5");

export default function PianoModule() {
  const [synth, setSynth] = useState(null);
  const [isToneInitialized, setToneInitialized] = useState(false);

  useEffect(() => {
    async function initTone() {
      try {
        await Tone.start();
        // Create a polyphonic synth (using Tone.js) routed to the destination.
        const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setSynth(newSynth);
        setToneInitialized(true);
      } catch (error) {
        console.error("Tone.js failed to initialize", error);
      }
    }
    initTone();
  }, []);

  // Play note given its midi number.
  const playNote = (midiNumber) => {
    if (!synth) return;
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  // Stop the note.
  const stopNote = (midiNumber) => {
    if (!synth) return;
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerRelease(note);
  };

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
        width={475}
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