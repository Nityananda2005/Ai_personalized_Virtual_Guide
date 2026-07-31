import React, { useState } from 'react';
import { MessageSquare, FileText, Mic, User, Sparkles, ShieldCheck, Menu, X, Layers, Activity, Zap, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { language, setLanguage, profile, userId, isHealthOk } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'chat', label: 'AI Voice Chat', icon: MessageSquare, description: 'Voice & text AI assistant' },
    { id: 'viva', label: 'Viva Simulator', icon: Award, badge: 'Voice HOD', description: 'Oral exam with grading' },
    { id: 'study', label: 'Auto Study Kit', icon: Zap, badge: 'AI Notes', description: 'Notes, Mindmaps & PYQs' },
    { id: 'document', label: 'PDF Guide (RAG)', icon: FileText, badge: 'RAG', description: 'Query PDF vector memory' },
    { id: 'profile', label: 'Student Profile', icon: User, badge: profile ? 'Active' : null, description: 'Personalization settings' },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Virtual Guide AI
            </h1>
            <p className="text-[10px] text-slate-400">Personalized Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 flex-shrink-0 bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div className="space-y-6">
          
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    Virtual Guide
                  </h1>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-violet-950 text-violet-300 border border-violet-800/60">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">AI Student Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

          {/* Navigation Links */}
          <nav className="space-y-2">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3">
              MAIN NAVIGATION
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-transparent border-l-4 border-violet-500 text-white font-bold shadow-md shadow-violet-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30'
                          : 'bg-slate-900 border border-slate-800/90 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider flex-shrink-0 ml-2 ${
                        isActive
                          ? 'bg-violet-500/30 text-violet-200 border border-violet-400/40'
                          : 'bg-slate-900 text-indigo-300 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Profile Footer */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          
          {/* Active Profile Status Box */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3 shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              {profile && profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {profile ? profile.name : 'Guest Student'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile ? profile.department : `ID: ${userId}`}
              </p>
            </div>
            {profile && <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Language:
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase">{language}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'or', label: 'ଓଡ଼ିଆ' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                    language === l.code
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backend Connection Badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
            <span className="text-slate-400 font-medium">Backend Server</span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isHealthOk ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`}></span>
              <span className={isHealthOk ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isHealthOk ? 'Online' : 'Connecting'}
              </span>
            </div>
          </div>

        </div>

      </aside>
    </>
  );
}
