import React from 'react';

/**
 * VoicePlayer Component
 * Controls for AI voice playback: Sound Wave Equalizer, Mute/Unmute, and Replay buttons.
 */
export default function VoicePlayer({ isPlaying, isMuted, onToggleMute, onReplay, hasAudio }) {
  if (!hasAudio) return null;

  return (
    <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl shadow-lg">
      {/* Sound Wave Equalizer Animation */}
      <div className="flex items-center space-x-1 pr-2 border-r border-slate-800">
        <span className={`w-1 h-3 rounded-full bg-violet-400 ${isPlaying ? 'animate-bounce' : 'opacity-40'}`}></span>
        <span className={`w-1 h-5 rounded-full bg-indigo-400 ${isPlaying ? 'animate-bounce delay-100' : 'opacity-40'}`}></span>
        <span className={`w-1 h-2 rounded-full bg-purple-400 ${isPlaying ? 'animate-bounce delay-200' : 'opacity-40'}`}></span>
        <span className={`w-1 h-4 rounded-full bg-pink-400 ${isPlaying ? 'animate-bounce delay-300' : 'opacity-40'}`}></span>
      </div>

      {/* Status indicator text */}
      <span className="text-xs text-slate-300 font-medium hidden sm:inline">
        {isPlaying ? (isMuted ? 'Muted' : 'AI Speaking...') : 'Voice Ready'}
      </span>

      {/* Mute / Unmute Toggle Button */}
      <button
        onClick={onToggleMute}
        className={`p-2 rounded-xl border text-xs transition-all ${
          isMuted
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/50'
            : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white'
        }`}
        title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
      >
        {isMuted ? (
          /* Muted Volume Icon */
          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          /* Unmuted Volume Icon */
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Replay Last Audio Button */}
      <button
        onClick={onReplay}
        className="p-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold transition-all flex items-center space-x-1"
        title="Replay AI Voice"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
