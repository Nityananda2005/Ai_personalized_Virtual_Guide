import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useVoicePlayer } from '../hooks/useVoicePlayer';
import VoiceInput from '../components/VoiceInput';
import VoicePlayer from '../components/VoicePlayer';

/**
 * VoiceConversation Page
 * Complete Voice-to-Voice AI Chat interface with Web Speech STT, Sarvam AI TTS,
 * conversation memory, personalization, and auto-playback.
 */
export default function VoiceConversation() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am your AI Personalized Virtual Guide. Click the microphone button below to start talking with me!',
    },
  ]);
  const [userId, setUserId] = useState('user_voice_1');
  const [language, setLanguage] = useState('en');
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);

  // Custom Hooks
  const {
    isListening,
    transcript,
    interimTranscript,
    error: sttError,
    isSupported: isSttSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const {
    isPlaying,
    isMuted,
    audioUrl,
    playAudio,
    stopAudio,
    replayAudio,
    toggleMute,
  } = useVoicePlayer();

  const API_BASE_URL = 'http://localhost:5000';

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, loadingAI]);

  // Interrupt active voice playback when user starts listening/speaking
  const handleStartListening = () => {
    stopAudio(); // Interrupt current playback
    setErrorMessage(null);
    startListening(language);
  };

  // Submit speech transcript to AI backend when STT finishes
  useEffect(() => {
    if (transcript && transcript.trim().length > 0 && !isListening) {
      handleSendVoiceMessage(transcript.trim());
      resetTranscript();
    }
  }, [transcript, isListening]);

  // Handle STT errors
  useEffect(() => {
    if (sttError) {
      setErrorMessage(sttError);
    }
  }, [sttError]);

  /**
   * Sends user's transcript to backend /api/chat with voiceEnabled: true
   */
  const handleSendVoiceMessage = async (userText) => {
    if (!userText || userText.trim() === '') return;

    setErrorMessage(null);
    setLoadingAI(true);

    const userMsgObj = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: userText,
    };

    setMessages(prev => [...prev, userMsgObj]);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: userText,
        userId: userId,
        language: language,
        voiceEnabled: true,
      });

      if (response.data && response.data.success && response.data.response) {
        const replyText = response.data.response;
        const voiceAudioContent = response.data.audioContent;
        const effectiveLang = response.data.language || language;

        const aiMsgObj = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: replyText,
          audioUrl: voiceAudioContent,
          language: effectiveLang,
        };

        setMessages(prev => [...prev, aiMsgObj]);

        // Auto-play AI voice response
        if (voiceAudioContent) {
          playAudio(voiceAudioContent);
        }
      } else {
        throw new Error(response.data.error || 'Failed to generate AI response.');
      }
    } catch (err) {
      console.error('Voice Conversation Error:', err);
      const msg = err.response?.data?.error || err.message || 'Error communicating with AI backend.';
      setErrorMessage(msg);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background radial gradient lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl shadow-md shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Voice AI Guide
            </h1>
            <p className="text-xs text-slate-400">Full Voice-to-Voice Conversation</p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'or', label: 'ଓଡ଼ିଆ' },
            ].map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  language === l.code
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Voice Player Controls Widget */}
          <VoicePlayer
            isPlaying={isPlaying}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onReplay={replayAudio}
            hasAudio={!!audioUrl}
          />
        </div>
      </header>

      {/* Main Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between space-y-4">
        
        {/* Error Alert Banners */}
        {(!isSttSupported || errorMessage) && (
          <div className="bg-rose-950/50 border border-rose-800/80 rounded-2xl p-4 text-xs sm:text-sm text-rose-300 flex items-start space-x-3 shadow-lg">
            <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              {!isSttSupported
                ? 'Web Speech API is not supported in your browser. Please open in Google Chrome or Microsoft Edge.'
                : errorMessage}
            </div>
          </div>
        )}

        {/* Chat Messages List */}
        <div className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 sm:p-6 overflow-y-auto max-h-[55vh] space-y-4 shadow-inner">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-75 border-b border-white/10 pb-1">
                  <span>{msg.role === 'user' ? 'You (Voice Input)' : 'AI Virtual Guide'}</span>
                  {msg.audioUrl && (
                    <button
                      onClick={() => playAudio(msg.audioUrl)}
                      className="hover:underline flex items-center space-x-1 text-violet-300"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      <span>Play Voice</span>
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Live STT Interim Transcript */}
          {interimTranscript && (
            <div className="flex flex-col items-end">
              <div className="max-w-[75%] p-3 rounded-2xl bg-indigo-900/40 border border-indigo-500/40 text-indigo-200 text-xs italic animate-pulse">
                Listening: "{interimTranscript}..."
              </div>
            </div>
          )}

          {/* AI Thinking Spinner */}
          {loadingAI && (
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl w-max shadow-md">
              <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs font-semibold text-slate-300">AI is thinking & synthesizing voice response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Voice Control Section */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <VoiceInput
            isListening={isListening}
            onStart={handleStartListening}
            onStop={stopListening}
            disabled={loadingAI || !isSttSupported}
          />
        </div>

      </main>
    </div>
  );
}
