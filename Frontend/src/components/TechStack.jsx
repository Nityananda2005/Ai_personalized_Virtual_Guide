import React from 'react';
import { Code2, Server, Database, Cpu, Share2, Layers } from 'lucide-react';

export default function TechStack() {
  const technologies = [
    { name: 'REACT', icon: Code2 },
    { name: 'NODE.JS', icon: Server },
    { name: 'MONGODB', icon: Database },
    { name: 'GEMINI', icon: Cpu },
    { name: 'LANGCHAIN', icon: Share2 },
    { name: 'VECTOR DB', icon: Layers },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10 text-center">
      {/* Small Category Badge */}
      <span className="text-[11px] font-bold text-amber-500/90 tracking-widest uppercase">
        THE ENGINE ROOM
      </span>

      {/* Main Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2 mb-12">
        Forged in Cutting-Edge Tech
      </h2>

      {/* Icons Row */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
        {technologies.map((tech) => {
          const Icon = tech.icon;
          return (
            <div key={tech.name} className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-full bg-[#0b0e1b] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-300 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase group-hover:text-slate-200 transition-colors">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
