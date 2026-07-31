import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom Hook for Web Speech API Speech-to-Text (STT) Recognition.
 * 
 * @returns {Object} Speech recognition state and control methods
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Web Speech API is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop when user stops speaking
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalStr += result[0].transcript;
        } else {
          interimStr += result[0].transcript;
        }
      }

      if (finalStr) {
        setTranscript(prev => (prev ? `${prev} ${finalStr}` : finalStr).trim());
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event) => {
      console.error('[Speech Recognition Error]:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else if (event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  /**
   * Map language code to BCP 47 tag for SpeechRecognition
   */
  const mapLangTag = (lang) => {
    if (!lang) return 'en-US';
    const clean = lang.toLowerCase().trim();
    if (clean === 'hi' || clean === 'hindi' || clean === 'hi-in') return 'hi-IN';
    if (clean === 'or' || clean === 'od' || clean === 'odia' || clean === 'or-in' || clean === 'od-in') return 'or-IN';
    return 'en-US';
  };

  const startListening = useCallback((language = 'en') => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = mapLangTag(language);
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      recognitionRef.current.start();
    } catch (e) {
      console.warn('SpeechRecognition start error:', e.message);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
