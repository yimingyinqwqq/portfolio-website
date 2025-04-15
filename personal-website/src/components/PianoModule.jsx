import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

// Set the note range from "do" (c4) to "mi" (E5).
const firstNote = MidiNumbers.fromNote("c4");
const lastNote = MidiNumbers.fromNote("e5");

export default function PianoModule() {
  const [synth, setSynth] = useState(null);
  // State for whether to show note labels (keyboard keys) or not.
  const [showLabels, setShowLabels] = useState(true);

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

  // Hide note labels 8 seconds after initialization.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLabels(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for "h" key to toggle note labels.
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent repeated toggling if key is held down.
      if (event.repeat) return;
      if (event.key === "h" || event.key === "H") {
        setShowLabels((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    // The note will start at full volume and decay according to the envelope above.
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

  // Render note labels showing the keyboard shortcut if available.
  // If showLabels is false, then return an empty string.
  // Now, return a span that styles the label: white keys use color "#888", accidental keys "#f8e8d5".
  const renderNoteLabel = ({ keyboardShortcut, midiNumber, isAccidental }) => {
    if (!showLabels) return "";
    return keyboardShortcut ? (
      <span style={{ color: isAccidental ? "#f8e8d5" : "#888" }}>
        {keyboardShortcut.toUpperCase()}
      </span>
    ) : "";
  };

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
        renderNoteLabel={renderNoteLabel}
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
    fontSize: "12px",
    color: "#f8e8d5", // container default color remains unchanged
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "1.2rem",
    color: "#333",
  },
};