import React from 'react';

/**
 * VoiceInput Component
 * Microphone trigger button with animated radar pulse rings during active listening.
 */
export default function VoiceInput({ isListening, onStart, onStop, disabled }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Pulsing Radar Rings when listening */}
      {isListening && (
        <>
          <div className="absolute w-24 h-24 rounded-full bg-violet-500/20 animate-ping pointer-events-none"></div>
          <div className="absolute w-20 h-20 rounded-full bg-indigo-500/30 animate-pulse pointer-events-none"></div>
        </>
      )}

      {/* Main Microphone Button */}
      <button
        onClick={isListening ? onStop : onStart}
        disabled={disabled}
        className={`relative z-10 p-5 rounded-full shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isListening
            ? 'bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 shadow-rose-600/50 text-white scale-110'
            : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-indigo-600/40 text-white'
        }`}
        title={isListening ? 'Click to Stop Listening' : 'Click to Speak'}
      >
        {isListening ? (
          /* Mic Active Stop Icon */
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          /* Mic Idle Icon */
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {isListening ? 'Listening... Speak Now' : 'Click Mic to Speak'}
      </span>
    </div>
  );
}
