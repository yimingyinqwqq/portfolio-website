import React, { useState, useEffect, useRef } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

const firstNote = MidiNumbers.fromNote("a3");
const lastNote = MidiNumbers.fromNote("e5");

const HOME_ROW = [
  { natural: 'a', flat: 'q', sharp: 'w' },
  { natural: 's', flat: 'w', sharp: 'e' },
  { natural: 'd', flat: 'e', sharp: 'r' },
  { natural: 'f', flat: 'r', sharp: 't' },
  { natural: 'g', flat: 't', sharp: 'y' },
  { natural: 'h', flat: 'y', sharp: 'u' },
  { natural: 'j', flat: 'u', sharp: 'i' },
  { natural: 'k', flat: 'i', sharp: 'o' },
  { natural: 'l', flat: 'o', sharp: 'p' },
  { natural: ';', flat: 'p', sharp: '[' },
  { natural: "'", flat: '[', sharp: ']' },
  { natural: "Enter", flat: ']', sharp: '\\' },
];

export default function PianoModule() {
  const [synth, setSynth] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const noteClearTimer = useRef(null);

  // Initialize Sampler with real piano samples
  useEffect(() => {
    const newSampler = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    setSynth(newSampler);
  }, []);

  // Hide note labels after 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteClearTimer.current) {
        setShowLabels(false);
      }
    }, 5000);
    noteClearTimer.current = timer;
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Toggle labels with "1" key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.key === "1") {
        setShowLabels((prev) => !prev);
        noteClearTimer.current = null;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Play note
  const playNote = async (midiNumber) => {
    if (!synth) return;
    const context = Tone.getContext();
    if (context.state !== "running") {
      await context.resume();
    }
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  // Stop note
  const stopNote = (midiNumber) => {
    if (!synth) return;
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerRelease(note);
  };

  // Create keyboard shortcuts
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: HOME_ROW,
  });

  // Render the note label (opacity toggles)
  const renderNoteLabel = ({ keyboardShortcut, midiNumber, isAccidental }) => {
    const label = keyboardShortcut
      ? keyboardShortcut === "Enter"
        ? "↵"
        : keyboardShortcut.toUpperCase()
      : "";
    return (
      <span
        style={{
          color: isAccidental ? "#f8e8d5" : "#888",
          opacity: showLabels ? 1 : 0,
          transition: "opacity 1s ease",
          display: "inline-block",
          width: "100%",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    );
  };

  // Ensure AudioContext is resumed on mouse down
  const handleContainerMouseDown = async () => {
    const context = Tone.getContext();
    if (context.state !== "running") {
      await context.resume();
    }
  };

  return (
    <div style={styles.container} onMouseDown={handleContainerMouseDown}>
      <h2 style={styles.heading}>Piano Playground</h2>
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
    color: "#f8e8d5",
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "1.2rem",
    color: "#333",
  },
};