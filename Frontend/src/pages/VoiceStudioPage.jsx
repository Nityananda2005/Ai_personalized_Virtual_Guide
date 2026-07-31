import React, { useState, useRef } from 'react';
import { Mic, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, Sliders } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { synthesizeVoice } from '../services/api';

export default function VoiceStudioPage() {
  const { showToast } = useUser();
  const [text, setText] = useState('Hello! Welcome to the AI Virtual Guide Voice Studio.');
  const [language, setLanguage] = useState('en');
  const [speaker, setSpeaker] = useState('anushka');
  const [pace, setPace] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceMeta, setVoiceMeta] = useState(null);

  const audioRef = useRef(null);

  const samplePrompts = [
    { label: 'English Welcome', text: 'Hello! Welcome to the AI Personalized Virtual Guide Voice Studio.', lang: 'en' },
    { label: 'Hindi Greeting', text: 'नमस्ते! एआई वर्चुअल गाइड में आपका स्वागत है। आप कैसे हैं?', lang: 'hi' },
    { label: 'Odia Greeting', text: 'ନମସ୍କାର! ଏଆଇ ଭର୍ଚୁଆଲ ଗାଇଡକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।', lang: 'or' },
    { label: 'Academic Tip', text: 'To excel in computer science, focus on data structures and algorithm design principles.', lang: 'en' },
  ];

  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      showToast('Please enter text to synthesize voice.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await synthesizeVoice({
        text: text.trim(),
        language: language,
        speaker: speaker,
        pace: pace,
      });

      if (data && data.success && data.audioContent) {
        setAudioUrl(data.audioContent);
        setVoiceMeta({
          speaker: data.speaker || speaker,
          language: data.language || language,
          isMock: data.isMock || false,
        });

        showToast(
          data.isMock
            ? 'Voice generated (Fallback Mock Mode - Configure SARVAM_API_KEY in backend .env for live Sarvam AI)'
            : 'Voice synthesized successfully!',
          'success'
        );

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.log('Autoplay restriction:', e));
          }
        }, 150);
      } else {
        throw new Error(data?.error || 'Failed to retrieve audio.');
      }
    } catch (err) {
      console.error('TTS Error:', err);
      showToast(err.message || 'Error generating voice.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log('Playback error:', e));
    }
  };

  return (
    <div className="flex-1 space-y-6">
      
      {/* Main Studio Card */}
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Sarvam AI Voice Studio
              </h2>
              <p className="text-xs text-slate-400 font-medium">High-Fidelity Text-to-Speech (Bulbul Engine)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs text-emerald-400 font-bold w-max">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sarvam Voice Active</span>
          </div>
        </div>

        {/* Quick Prompts */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            Quick Prompts:
          </label>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(sample.text);
                  setLanguage(sample.lang);
                }}
                className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all transform active:scale-95 font-medium"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Language:
            </label>
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'Hindi' },
                { code: 'or', label: 'Odia' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    language === l.code
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speaker Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Speaker Voice:
            </label>
            <select
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-inner"
            >
              <option value="anushka">Anushka (Female)</option>
              <option value="manisha">Manisha (Female)</option>
              <option value="kavya">Kavya (Female)</option>
              <option value="rahul">Rahul (Male)</option>
              <option value="rohan">Rohan (Male)</option>
              <option value="amit">Amit (Male)</option>
            </select>
          </div>

          {/* Pace Speed Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Speech Speed ({pace}x):
            </label>
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
              {[0.8, 1.0, 1.2].map((p) => (
                <button
                  key={p}
                  onClick={() => setPace(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    pace === p
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}x
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Text Input Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Text to Synthesize:
            </label>
            <span className="text-xs text-slate-500 font-mono">{text.length} characters</span>
          </div>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text here to synthesize AI voice..."
            className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-600 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner"
          />
        </div>

        {/* Generate Action Button */}
        <button
          onClick={handleGenerateVoice}
          disabled={loading || !text.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-40 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Synthesizing Voice Audio...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>Synthesize AI Voice</span>
            </>
          )}
        </button>

        {/* Audio Player Card */}
        {audioUrl && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-200">Generated Voice Audio</h4>
                  <p className="text-xs text-slate-400">
                    Speaker: <strong className="text-indigo-300">{voiceMeta?.speaker}</strong> | Lang: {voiceMeta?.language}
                  </p>
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
              className="w-full focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleReplay}
                className="py-2 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Audio</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
