import React, { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import AdComponent from "./AdComponent";
import useVoiceControl from "./VoiceControl";

const COLORS = ["red", "yellow", "blue", "green"];
const BODY_PARTS = [
  { name: "Left Hand", side: "left", type: "hand" },
  { name: "Right Hand", side: "right", type: "hand" },
  { name: "Left Foot", side: "left", type: "foot" },
  { name: "Right Foot", side: "right", type: "foot" },
];

const COMBINATIONS = [];
COLORS.forEach((color) => {
  BODY_PARTS.forEach((bodyPart) => {
    COMBINATIONS.push({ color, bodyPart });
  });
});

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pauseDuration, setPauseDuration] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAutoSpin, setShouldAutoSpin] = useState(false);

  const isPlayingRef = useRef(false);
  const spinIntervalRef = useRef(null); // Track the spin interval

  // Voice control integration
  const voiceControl = useVoiceControl({
    onStop: () => {
      if (isPlaying) {
        stopGame();
      }
    },
    onStart: () => {
      if (!gameStarted) {
        startGame();
      } else if (!isPlaying) {
        restartGame();
      }
    },
  });

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const playAudio = useCallback((selection) => {
    // Create filename based on selection: side-type-color.mp3
    const { color, bodyPart } = selection;
    const filename = `${bodyPart.side}-${bodyPart.type}-${color}.mp3`;
    const audioPath = `/audio/${filename}`;

    // Create and play audio
    const audio = new Audio(audioPath);
    audio.preload = "auto";
    audio.volume = 0.8; // Set volume to 80%

    // Try to play immediately
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio started successfully
          console.log(`Playing audio: ${filename}`);
        })
        .catch((error) => {
          console.warn(`Could not play audio file: ${filename}`, error);
          // Fallback to text-to-speech if audio file fails
          fallbackToSpeech(color, bodyPart);
        });
    }

    // Handle audio errors
    audio.onerror = () => {
      console.warn(
        `Audio file not found: ${filename}, falling back to text-to-speech`
      );
      fallbackToSpeech(color, bodyPart);
    };

    // Fallback function
    function fallbackToSpeech(color, bodyPart) {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `${color} ${bodyPart.name}`
        );
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, []);

  const spin = useCallback(() => {
    setIsSpinning(true);
    setShowResult(false);
    setShouldAutoSpin(false);

    let spinCount = 0;
    const maxSpins = 20 + Math.floor(Math.random() * 20); // 20-40 spins

    spinIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * COMBINATIONS.length);
      const selection = COMBINATIONS[randomIndex];
      setCurrentSelection(selection);
      setBackgroundColor(selection.color);

      spinCount++;

      if (spinCount >= maxSpins) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
        setIsSpinning(false);

        // Show result and play audio after a brief delay
        setTimeout(() => {
          setShowResult(true);
          playAudio(selection);

          // Hide result after pause duration, then set flag for auto-spin
          setTimeout(() => {
            setShowResult(false);

            // Check if still playing and set auto-spin flag
            if (isPlayingRef.current) {
              setShouldAutoSpin(true);
            }
          }, pauseDuration * 1000);
        }, 500);
      }
    }, Math.max(50, 200 - spinCount * 3)); // Speed up gradually
  }, [pauseDuration, playAudio]);

  // Handle auto-spinning
  useEffect(() => {
    if (shouldAutoSpin && isPlaying && !isSpinning) {
      const timer = setTimeout(() => {
        if (isPlayingRef.current) {
          spin();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoSpin, isPlaying, isSpinning, spin]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setCurrentSelection(null);
    setBackgroundColor("#ffffff");
    setShowResult(false);
    spin();
  };

  const stopGame = () => {
    setIsPlaying(false);

    // Clear any active spin interval
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }

    setIsSpinning(false);
    setShowResult(false);
    setShouldAutoSpin(false);
  };

  const restartGame = () => {
    setIsPlaying(true);
    setIsSpinning(false);
    setShowResult(false);
    setCurrentSelection(null);
    setBackgroundColor("#ffffff");
    setTimeout(() => {
      spin();
    }, 100);
  };

  const renderBodyPartIcon = (bodyPart) => {
    const { type } = bodyPart;

    if (type === "hand") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" />
          <path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" />
          <path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" />
          <path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 3v6l4.798 5.142a4 4 0 0 1 -5.441 5.86l-6.736 -6.41a2 2 0 0 1 -.621 -1.451v-9.141h8z" />
          <path d="M7.895 15.768c.708 -.721 1.105 -1.677 1.105 -2.768a4 4 0 0 0 -4 -4" />
        </svg>
      );
    }
  };

  return (
    <div className="app" style={{ backgroundColor }}>
      <div className="game-info">
        <h3>Infinite Twister</h3>
        <p>
          Your digital Twister spinner! Hit start and follow the commands. Place
          your{" "}
          {currentSelection
            ? `${currentSelection.bodyPart.name.toLowerCase()} on ${
                currentSelection.color
              }`
            : "body parts on the colors"}{" "}
          as instructed.
        </p>

        {/* Debug info for voice control */}
        {voiceControl.isListening && (
          <div
            style={{
              fontSize: "12px",
              color: "#4CAF50",
              marginTop: "5px",
              padding: "5px",
              background: "rgba(76, 175, 80, 0.1)",
              borderRadius: "4px",
            }}
          >
            🎤 Voice control active - try saying "stop" or "start"
          </div>
        )}
      </div>

      <div className="controls">
        {!gameStarted ? (
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <>
            <button
              className="start-button"
              onClick={isPlaying ? stopGame : restartGame}
              style={{
                backgroundColor: isPlaying ? "#f44336" : "#4CAF50",
                marginBottom: "5px",
              }}
            >
              {isSpinning
                ? "Stop Spinning"
                : isPlaying
                ? "Stop Game"
                : "Restart Game"}
            </button>
            {!isPlaying && (
              <button
                className="start-button"
                onClick={restartGame}
                style={{ backgroundColor: "#2196F3" }}
              >
                Play Again
              </button>
            )}
          </>
        )}

        <div className="settings">
          <label>
            Pause Duration: {pauseDuration}s
            <input
              type="range"
              min="1"
              max="10"
              value={pauseDuration}
              onChange={(e) => setPauseDuration(Number(e.target.value))}
            />
          </label>

          {voiceControl.isSupported && (
            <div className="voice-control">
              <button
                className="voice-button"
                onClick={
                  voiceControl.isListening
                    ? voiceControl.stopListening
                    : voiceControl.startListening
                }
                style={{
                  backgroundColor: voiceControl.isListening
                    ? "#ff9800"
                    : "#9e9e9e",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
              >
                🎤 {voiceControl.isListening ? "Voice ON" : "Voice OFF"}
              </button>
              <div
                style={{ fontSize: "10px", color: "white", marginTop: "2px" }}
              >
                Say "stop" or "start"
              </div>
              {voiceControl.error && (
                <div
                  style={{
                    fontSize: "9px",
                    color: "#ffcdd2",
                    marginTop: "2px",
                  }}
                >
                  Error: {voiceControl.error}
                </div>
              )}
            </div>
          )}

          {!voiceControl.isSupported && (
            <div
              style={{ fontSize: "10px", color: "#ffcdd2", marginTop: "5px" }}
            >
              Voice control not supported in this browser
            </div>
          )}
        </div>
      </div>

      <div className={`main-content ${isSpinning ? "spinning" : ""}`}>
        {currentSelection && renderBodyPartIcon(currentSelection.bodyPart)}
      </div>

      <div className={`result-text ${showResult ? "show" : ""}`}>
        {currentSelection &&
          `${currentSelection.color.toUpperCase()} ${currentSelection.bodyPart.name.toUpperCase()}`}
      </div>

      <AdComponent />
    </div>
  );
}

export default App;
