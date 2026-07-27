import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-xl font-bold tracking-tight text-white">
          Aether<span className="text-indigo-300">Guide</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#dashboard" className="hover:text-white transition-colors">
          Dashboard
        </a>
        <a href="#study" className="hover:text-white transition-colors">
          Study
        </a>
        <a href="#resources" className="hover:text-white transition-colors">
          Resources
        </a>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="px-4 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/60 border border-slate-700/80 rounded-full hover:border-slate-500 hover:text-white transition-all cursor-pointer"
        >
          Sign In
        </button>
        <button
          type="button"
          className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-200 rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
        >
          Go Pro
        </button>
      </div>
    </header>
  );
}
