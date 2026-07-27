import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-[#060812] py-10 mt-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-sm font-bold text-white tracking-tight">
            Aether AI
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            &copy; 2024 Aether AI. Powered by Neural Glass Architecture.
          </p>
        </div>

        {/* Right Side Footer Navigation Links */}
        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#api" className="hover:text-white transition-colors">
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
