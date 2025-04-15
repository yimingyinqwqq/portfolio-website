import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

// Set the note range from "do" (c4) to "mi" (E5).
const firstNote = MidiNumbers.fromNote("c4");
const lastNote = MidiNumbers.fromNote("e5");

export default function PianoModule() {
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    // Create the polyphonic synth immediately, but do not start the AudioContext.
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.03,   // Quick attack
        decay: 3.0,     // Slow decay for gradual attenuation
        sustain: 0,     // No sustain – sound fades out naturally
        release: 1.5,   // Moderate release upon key up
      },
    }).toDestination();
    setSynth(newSynth);
  }, []);

  // When a key is pressed, resume the AudioContext if needed and then trigger the note.
  const playNote = async (midiNumber) => {
    if (!synth) return;
    // Resume the audio context if it is not already running.
    const context = Tone.getContext();
    if (context.state !== "running") {
      await context.resume();
    }
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  // When the key is released, trigger the release.
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

  // An optional onMouseDown at the container level as an extra guarantee that the AudioContext is resumed.
  const handleContainerMouseDown = async () => {
    const context = Tone.getContext();
    if (context.state !== "running") {
      await context.resume();
    }
  };

  return (
    <div style={styles.container} onMouseDown={handleContainerMouseDown}>
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