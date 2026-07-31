import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Toast() {
  const { toastMessage } = useUser();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-800 text-emerald-200 shadow-emerald-950/50',
    error: 'bg-rose-950/90 border-rose-800 text-rose-200 shadow-rose-950/50',
    info: 'bg-slate-900/90 border-indigo-800 text-indigo-200 shadow-indigo-950/50',
  };

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = Icons[type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl text-xs sm:text-sm font-medium ${
          bgStyles[type] || bgStyles.info
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
