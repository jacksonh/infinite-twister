import { useEffect, useRef, useState, useCallback } from "react";

// Stop words and commands - moved outside component since they're constants
const STOP_WORDS = ["stop", "pause", "halt", "freeze", "wait"];
const START_WORDS = ["start", "go", "begin", "play", "continue", "resume"];

const useVoiceControl = ({ onStop, onStart, onPause }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const callbacksRef = useRef({ onStop, onStart, onPause });

  // Update callbacks ref without causing re-renders
  useEffect(() => {
    callbacksRef.current = { onStop, onStart, onPause };
  }, [onStop, onStart, onPause]);

  // Initialize speech recognition ONLY ONCE
  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      setIsSupported(false);
      setError("Speech Recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      // Already initialized, don't recreate
      return;
    }

    console.log("Initializing Speech Recognition (one time only)");
    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    // Handle speech results
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        console.log("Voice command heard:", transcript);

        // Check for stop words
        if (STOP_WORDS.some((word) => transcript.includes(word))) {
          console.log("Voice: Stop command triggered");
          callbacksRef.current.onStop && callbacksRef.current.onStop();
        }

        // Check for start words
        if (START_WORDS.some((word) => transcript.includes(word))) {
          console.log("Voice: Start command triggered");
          callbacksRef.current.onStart && callbacksRef.current.onStart();
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Recognition error: ${event.error}`);

      if (event.error === "not-allowed") {
        setIsListening(false);
        isListeningRef.current = false;
        alert(
          "Microphone access denied. Please allow microphone access for voice controls."
        );
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setError(null);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      // Restart recognition if it should still be listening
      if (isListeningRef.current) {
        console.log("Attempting to restart recognition...");
        try {
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (error) {
          console.error("Recognition restart failed:", error);
          setError(`Restart failed: ${error.message}`);
        }
      }
    };

    return () => {
      console.log("Cleaning up speech recognition");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Empty dependency array - only run once!

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      console.warn(
        "Cannot start listening: not supported or no recognition object"
      );
      return false;
    }

    try {
      console.log("Starting voice recognition...");
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
      return true;
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      setError(`Start failed: ${error.message}`);
      return false;
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    console.log("Stopping voice recognition...");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    isListeningRef.current = false;
    setError(null);
  }, []);

  // Update the ref when listening state changes
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  };
};

export default useVoiceControl;
