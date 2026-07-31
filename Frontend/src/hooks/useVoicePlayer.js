import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom Hook for HTML5 Audio Voice Playback.
 * Handles auto-play, mute/unmute, replay, and playback interruption.
 */
export function useVoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = (e) => {
      // Ignore errors when no src is set (e.g., on Audio element creation)
      if (!audioRef.current || !audioRef.current.src || audioRef.current.src === window.location.href) {
        return;
      }
      const errMsg = e?.message || e?.type || 'Unknown audio error';
      console.warn('[Voice Player Error]:', errMsg);
      setIsPlaying(false);
      setError('Failed to play voice audio stream.');
    };

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * Plays voice audio Data URI or URL
   */
  const playAudio = useCallback((url) => {
    if (!url || !audioRef.current) return;

    setError(null);
    setAudioUrl(url);

    try {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.muted = isMuted;
      audioRef.current.currentTime = 0;

      if (!isMuted) {
        audioRef.current.play().catch(err => {
          console.warn('[Audio Auto-play Policy]:', err.message);
        });
      }
    } catch (e) {
      console.error('[Audio Play Error]:', e);
      setError('Playback failed.');
    }
  }, [isMuted]);

  /**
   * Stops/Interrupts current audio playback instantly
   */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    setIsPlaying(false);
  }, []);

  /**
   * Replays the last loaded audio URL
   */
  const replayAudio = useCallback(() => {
    if (audioRef.current && audioUrl) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        setIsMuted(false);
        audioRef.current.play().catch(e => console.warn('Replay error:', e));
      } catch (e) {
        // ignore
      }
    }
  }, [audioUrl]);

  /**
   * Toggles Mute / Unmute
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  }, []);

  return {
    isPlaying,
    isMuted,
    audioUrl,
    loadingVoice,
    error,
    setLoadingVoice,
    playAudio,
    stopAudio,
    replayAudio,
    toggleMute,
  };
}
