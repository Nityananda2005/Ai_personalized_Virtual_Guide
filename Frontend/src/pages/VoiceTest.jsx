import React, { useState, useRef } from 'react';
import axios from 'axios';

/**
 * VoiceTest Page Component
 * Modern glassmorphism React application testing Sarvam AI Bulbul Text-to-Speech (TTS).
 */
export default function VoiceTest() {
  const [text, setText] = useState('Hello! Welcome to the AI Personalized Virtual Guide.');
  const [language, setLanguage] = useState('en');
  const [speaker, setSpeaker] = useState('anushka');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const audioRef = useRef(null);

  // Sample quick test prompts
  const samplePrompts = [
    { label: 'English', text: 'Hello! Welcome to the AI Personalized Virtual Guide.', lang: 'en' },
    { label: 'Hindi (हिंदी)', text: 'नमस्ते! एआई वर्चुअल गाइड में आपका स्वागत है।', lang: 'hi' },
    { label: 'Odia (ଓଡ଼ିଆ)', text: 'ନମସ୍କାର! ଏଆଇ ଭର୍ଚୁଆଲ ଗାଇଡକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।', lang: 'or' },
  ];

  const API_BASE_URL = 'http://localhost:5000';

  /**
   * Generates voice audio from backend Sarvam AI Bulbul TTS endpoint
   */
  const handleGenerateVoice = async () => {
    if (!text || text.trim() === '') {
      setStatusMessage({ type: 'error', text: 'Please enter some text before generating voice.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/voice/speak`, {
        text: text.trim(),
        language: language,
        speaker: speaker,
      });

      if (response.data && response.data.success && response.data.audioContent) {
        const audioDataUri = response.data.audioContent;
        setAudioUrl(audioDataUri);

        const isMock = response.data.isMock;
        setStatusMessage({
          type: 'success',
          text: isMock
            ? 'Voice generated (Fallback Mock Mode - Configure SARVAM_API_KEY in .env for live Sarvam AI Bulbul voice).'
            : `Voice audio generated successfully using ${response.data.speaker || 'Sarvam AI'} (${response.data.language}).`,
        });

        // Auto-play audio when loaded
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Auto-play browser policy:', e));
          }
        }, 100);
      } else {
        throw new Error(response.data.error || 'Failed to retrieve audio content.');
      }
    } catch (err) {
      console.error('Voice Generation Error:', err);
      const errMsg = err.response?.data?.error || err.message || 'An error occurred while calling the Voice API.';
      setStatusMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Replays current audio
   */
  const handlePlayAgain = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Playback error:', e));
    }
  };

  /**
   * Resets form fields and audio player
   */
  const handleClear = () => {
    setText('');
    setAudioUrl('');
    setStatusMessage(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Voice AI Test
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Sarvam AI Bulbul Text-to-Speech (TTS) Synthesizer
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online</span>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Quick Test Prompts:
          </label>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(sample.text);
                  setLanguage(sample.lang);
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-all transform active:scale-95"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Language:
            </label>
            <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'Hindi (हिंदी)' },
                { code: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Speaker Voice:
            </label>
            <select
              value={speaker}
              onChange={e => setSpeaker(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="anushka">Anushka (Female)</option>
              <option value="manisha">Manisha (Female)</option>
              <option value="kavya">Kavya (Female)</option>
              <option value="rahul">Rahul (Male)</option>
              <option value="rohan">Rohan (Male)</option>
              <option value="amit">Amit (Male)</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Enter Text to Synthesize:
            </label>
            <span className="text-xs text-slate-500">{text.length} characters</span>
          </div>
          <textarea
            rows={5}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type text here to convert into AI voice..."
            className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-600 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner"
          />
        </div>

        {/* Status Banners */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            <div className="mt-0.5">
              {statusMessage.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">{statusMessage.text}</div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <button
            onClick={handleGenerateVoice}
            disabled={loading || !text.trim()}
            className="flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Voice...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Generate Voice</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 font-medium text-sm transition-all transform active:scale-95"
          >
            Clear
          </button>
        </div>

        {/* Audio Player Card */}
        {audioUrl && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Generated Voice Audio</h3>
                  <p className="text-xs text-slate-400">Format: WAV | Loaded Data URI</p>
                </div>
              </div>

              {isPlaying && (
                <div className="flex items-center space-x-1">
                  <span className="w-1 h-4 bg-violet-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                  <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce delay-300"></span>
                </div>
              )}
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full mb-4 focus:outline-none"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={handlePlayAgain}
                className="py-2 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
