import React from 'react';
import { Sparkles, Bot, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-[10px] sm:text-[11px] font-semibold tracking-wider text-indigo-300 uppercase">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>NEXT-GEN INTELLIGENCE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mt-5">
            AI Personalized Virtual Guide
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-4 max-w-md">
            Your intelligent multilingual assistant with memory, voice interaction, and document-based learning. Experience a new era of cognitive assistance.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-200 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Get Started
            </button>
            <button
              type="button"
              className="px-6 py-2.5 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 hover:text-white transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Column Sci-Fi UI Mockup */}
        <div className="lg:col-span-6 relative">
          {/* Ambient Glow behind Hero UI */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-75"></div>

          {/* Mockup Window */}
          <div className="relative rounded-xl border border-cyan-500/30 bg-[#090d1a] p-4 sm:p-6 shadow-[0_0_40px_rgba(56,189,248,0.2)] overflow-hidden">
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3 mb-4 text-[10px] text-cyan-300/70">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/80 animate-pulse"></div>
                <span className="font-semibold tracking-wider text-white">NOVA OS v4.2</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[9px] uppercase tracking-wider text-slate-400">
                <span className="text-cyan-400 font-medium">Home</span>
                <span>Features</span>
                <span>About</span>
                <span>Contact</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono">
                CONNECTED
              </span>
            </div>

            {/* Inner Dashboard Display Canvas */}
            <div className="relative rounded-lg bg-[#060812] border border-cyan-900/50 p-6 min-h-[260px] sm:min-h-[290px] flex flex-col justify-between overflow-hidden">
              {/* Background Sci-Fi Tech Grid & Dials */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
              
              {/* Glowing Hologram Graphic Accent */}
              <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute right-4 top-4 opacity-30 pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-dashed border-cyan-400/40 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="w-20 h-20 rounded-full border border-indigo-400/40"></div>
                </div>
              </div>

              {/* Holographic Robot Graphic Center Representation */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center opacity-85">
                <div className="w-28 h-36 relative border border-cyan-500/30 rounded-xl bg-cyan-950/20 p-2 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                  <Bot className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  <div className="mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="text-[8px] font-mono text-cyan-300">ACTIVE MEMORY</span>
                  </div>
                </div>
              </div>

              {/* Text overlay on Mockup */}
              <div className="relative z-10 max-w-xs sm:max-w-sm">
                <div className="inline-flex items-center gap-1 text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 mb-2">
                  <Terminal className="w-3 h-3" />
                  <span>NEURAL CORE ONLINE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  YOUR NEXT-GEN AI VIRTUAL GUIDE
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-2 leading-relaxed">
                  Experience the future of intelligent assistance. Meet NOVA, your advanced digital companion.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-md shadow-cyan-500/30 transition-all cursor-pointer"
                  >
                    EXPLORE CAPABILITIES
                  </button>
                </div>
              </div>

              {/* Bottom Status bar inside mockup */}
              <div className="relative z-10 mt-6 pt-2 border-t border-cyan-900/40 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>LATENCY: 12ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
