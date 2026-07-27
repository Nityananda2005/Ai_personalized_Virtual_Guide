import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Languages,
  Mic,
  FileText,
  BookOpen,
} from 'lucide-react';

export default function Features() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Unmatched Capabilities
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
          Precision engineering meets neural processing. Our virtual guide adapts to your specific workflow.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Personalized AI (Wide - Col span 7) */}
        <div className="lg:col-span-7 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center text-indigo-400 mb-6">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Personalized AI
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-lg">
              Our neural architecture maps your unique preferences and learning style to deliver context-aware responses that evolve as you do.
            </p>
          </div>
          {/* Progress Bar Indicator */}
          <div className="mt-8 pt-4">
            <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-2/5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
            </div>
          </div>
        </div>

        {/* Card 2: Memory Chat (Col span 5) */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center text-indigo-400 mb-6">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Memory Chat
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Perfect continuity across sessions. The AI remembers past context and nuanced details.
            </p>
          </div>
        </div>

        {/* Card 3: Multilingual Support (Col span 6) */}
        <div className="lg:col-span-6 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 mb-6">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Multilingual Support
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Fluent in over 100 languages with native-level cultural nuance and professional terminology.
            </p>
          </div>
        </div>

        {/* Card 4: Voice Assistant (Col span 6) */}
        <div className="lg:col-span-6 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center text-indigo-400 mb-6">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Voice Assistant
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Ultra-low latency speech recognition and natural synthesis for hands-free productivity.
            </p>
          </div>
        </div>

        {/* Card 5: Document Q&A (Wide with Dropzone - Col span 7) */}
        <div className="lg:col-span-7 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center hover:border-slate-700/80 transition-all">
          <div className="sm:col-span-7">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center text-indigo-400 mb-6">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Document Q&A
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Upload PDFs, docs, or spreadsheets. The guide parses complex data and answers queries with instant citation accuracy.
            </p>
          </div>
          {/* Dashed Document Dropzone Box */}
          <div className="sm:col-span-5 h-28 border border-dashed border-slate-700/80 bg-slate-900/30 rounded-xl flex items-center justify-center text-[11px] text-slate-500 hover:border-indigo-500/50 hover:text-slate-400 transition-all cursor-pointer">
            <span>Drop documents here...</span>
          </div>
        </div>

        {/* Card 6: Study Guide (Col span 5) */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-6">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Study Guide
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Generated curriculum and flashcards tailored to your specific academic or professional goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
