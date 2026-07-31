import React from 'react';
import { MessageSquare, FileText, Mic, User, Sparkles, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { language, setLanguage, profile, userId, isHealthOk } = useUser();

  const navItems = [
    { id: 'chat', label: 'AI Voice Chat', icon: MessageSquare, badge: null },
    { id: 'document', label: 'PDF Guide (RAG)', icon: FileText, badge: 'RAG' },
    { id: 'profile', label: 'Student Profile', icon: User, badge: profile ? 'Active' : null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand Logo & Server Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Virtual Guide AI
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-violet-950/80 text-violet-300 border border-violet-800/50 uppercase tracking-widest">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Personalized Voice & Document Assistant</p>
            </div>
          </div>

          {/* Health Badge Mobile */}
          <div className="flex md:hidden items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isHealthOk ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`}></span>
            <span className={isHealthOk ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
              {isHealthOk ? 'API Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-indigo-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status & Language Selector (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Health Status */}
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${isHealthOk ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className={isHealthOk ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {isHealthOk ? 'Backend Connected' : 'Connecting...'}
            </span>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            {profile ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-violet-300 max-w-[100px] truncate">{profile.name}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400 font-mono text-[11px] max-w-[90px] truncate">{userId}</span>
              </>
            )}
          </div>

          {/* Language Selector Buttons */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'or', label: 'ଓଡ଼ିଆ' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === l.code
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
