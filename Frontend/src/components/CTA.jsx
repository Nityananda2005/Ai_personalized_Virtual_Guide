import React from 'react';

export default function CTA() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b0e1b] via-[#12162e] to-[#0b0e1b] border border-indigo-900/40 p-10 sm:p-16 text-center overflow-hidden shadow-2xl shadow-indigo-950/40">
        {/* Background Radial Purple Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Start Your Journey Today
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-3 max-w-md">
            Join 50,000+ professionals and students who are augmenting their intelligence with Aether AI.
          </p>
          <button
            type="button"
            className="mt-8 px-8 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-200 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Initialize Core Assistant
          </button>
        </div>
      </div>
    </section>
  );
}
