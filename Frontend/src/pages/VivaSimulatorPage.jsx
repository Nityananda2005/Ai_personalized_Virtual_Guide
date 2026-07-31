import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Award,
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getVivaQuestion, submitVivaAnswer, synthesizeVoice } from '../services/api';

const BRANCHES = [
  { id: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { id: 'IT', label: 'Information Technology (IT)' },
  { id: 'ECE', label: 'Electronics & Communication (ECE)' },
  { id: 'ME', label: 'Mechanical Engineering (ME)' },
  { id: 'CE', label: 'Civil Engineering (CE)' },
];

const SUBJECTS_BY_BRANCH = {
  CSE: ['DBMS & SQL', 'Operating Systems', 'Data Structures & Algorithms', 'Computer Networks', 'System Design'],
  IT: ['Web Engineering', 'Database Systems', 'Cloud Computing', 'Cyber Security', 'Software Testing'],
  ECE: ['Digital Signal Processing', 'Microprocessors & Embedded Systems', 'VLSI Design', 'Signals & Systems'],
  ME: ['Thermodynamics', 'Fluid Mechanics', 'Theory of Machines', 'Heat & Mass Transfer'],
  CE: ['Structural Analysis', 'Geotechnical Engineering', 'Concrete Technology', 'Fluid Mechanics'],
};

const PERSONAS = [
  {
    id: 'Strict HOD',
    name: 'Prof. Dr. A. K. Sharma',
    role: 'Chief HOD & External Examiner',
    badge: 'Rigorous Depth',
    avatarBg: 'from-rose-600 to-red-800',
    description: 'Demands precise technical terminology, formal definitions, and zero fluff.',
  },
  {
    id: 'Senior Tech Lead',
    name: 'Vikram Verma',
    role: 'Principal System Architect',
    badge: 'Production Trade-offs',
    avatarBg: 'from-indigo-600 to-purple-800',
    description: 'Focuses on real-world engineering, performance trade-offs, and scalability.',
  },
  {
    id: 'Rapid-Fire Examiner',
    name: 'Ms. Sneha Rao',
    role: 'Technical Quizmaster',
    badge: 'Fast Recall',
    avatarBg: 'from-amber-500 to-orange-700',
    description: 'Fast-paced questions testing immediate core conceptual intuition.',
  },
];

export default function VivaSimulatorPage() {
  const { showToast, language } = useUser();
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Session settings
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSubject, setSelectedSubject] = useState('DBMS & SQL');
  const [selectedPersona, setSelectedPersona] = useState('Strict HOD');
  const [sessionActive, setSessionActive] = useState(false);

  // Viva state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [history, setHistory] = useState([]);

  // Sync transcript from speech recognition hook to local input state
  useEffect(() => {
    if (transcript) {
      setStudentAnswerText((prev) => {
        // If transcript changed, update answer field
        return transcript;
      });
    }
  }, [transcript]);

  // Update subject list when branch changes
  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    const subjects = SUBJECTS_BY_BRANCH[branchId] || ['General Core'];
    setSelectedSubject(subjects[0]);
  };

  const startSession = async () => {
    setSessionActive(true);
    setScorecard(null);
    setHistory([]);
    await fetchNextQuestion();
  };

  const fetchNextQuestion = async (isFollowup = false, customQuestionText = null) => {
    if (customQuestionText) {
      setCurrentQuestion({
        question: customQuestionText,
        topic: selectedSubject,
        difficulty: 'Medium',
      });
      setStudentAnswerText('');
      resetTranscript();
      setScorecard(null);
      return;
    }

    setLoadingQuestion(true);
    setScorecard(null);
    setStudentAnswerText('');
    resetTranscript();

    try {
      const response = await getVivaQuestion({
        branch: selectedBranch,
        subject: selectedSubject,
        persona: selectedPersona,
        previousTurns: history,
      });

      if (response && response.success && response.data) {
        setCurrentQuestion(response.data);
      } else {
        throw new Error(response?.error || 'Failed to fetch viva question.');
      }
    } catch (err) {
      console.error('[Viva Question Error]:', err);
      showToast(err.message || 'Error generating viva question.', 'error');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSpeakQuestion = async () => {
    if (!currentQuestion?.question) return;
    setIsPlayingAudio(true);
    try {
      const res = await synthesizeVoice({
        text: currentQuestion.question,
        language: 'en',
      });
      if (res && res.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${res.audioContent}`);
        audio.play();
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        // Fallback Web Speech Synthesis
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => setIsPlayingAudio(false);
      }
    } catch (e) {
      console.warn('Voice Synthesis Fallback:', e);
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlayingAudio(false);
    }
  };

  const handleToggleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(language || 'en');
    }
  };

  const handleSubmitAnswer = async () => {
    const finalAnswer = studentAnswerText.trim();
    if (!finalAnswer) {
      showToast('Please record or type your viva answer before submitting.', 'error');
      return;
    }

    if (isListening) {
      stopListening();
    }

    setEvaluating(true);
    try {
      const response = await submitVivaAnswer({
        question: currentQuestion.question,
        studentAnswer: finalAnswer,
        branch: selectedBranch,
        subject: selectedSubject,
        persona: selectedPersona,
      });

      if (response && response.success && response.data) {
        setScorecard(response.data);
        setHistory((prev) => [
          ...prev,
          {
            question: currentQuestion.question,
            answer: finalAnswer,
            scorecard: response.data,
          },
        ]);
        showToast(`Viva answer evaluated! Score: ${response.data.score}/10`, 'success');
      } else {
        throw new Error(response?.error || 'Failed to evaluate answer.');
      }
    } catch (err) {
      console.error('[Viva Evaluation Error]:', err);
      showToast(err.message || 'Error evaluating viva response.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/30 border border-rose-500/40 rounded-2xl text-rose-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Interview + Viva Simulator
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience realistic 1-on-1 academic viva & tech interview simulations with strict voice evaluations & scoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {!sessionActive ? (
        /* SETUP BOARD */
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
          
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4 flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Step 1: Select Academic Branch & Subject</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Academic Branch:</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Target Subject Domain:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {(SUBJECTS_BY_BRANCH[selectedBranch] || []).map((subj, idx) => (
                    <option key={idx} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Examiner Persona Selection */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4 flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Step 2: Choose Examiner Persona</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PERSONAS.map((persona) => {
                const isSelected = selectedPersona === persona.id;

                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all space-y-3 relative ${
                      isSelected
                        ? 'bg-slate-950 border-rose-500 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/50'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${persona.avatarBg} flex items-center justify-center text-white font-black text-sm shadow-md`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{persona.name}</h4>
                        <p className="text-[11px] text-slate-400">{persona.role}</p>
                      </div>
                    </div>

                    <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {persona.badge}
                    </span>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {persona.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={startSession}
              className="px-8 py-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition-all flex items-center space-x-3"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Start Oral Viva Session</span>
            </button>
          </div>

        </div>
      ) : (
        /* ACTIVE VIVA ROOM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Examiner Card & Answer Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Examiner & Question Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl relative">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${activePersonaObj.avatarBg} flex items-center justify-center text-white font-black text-base shadow-md`}
                  >
                    {activePersonaObj.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{activePersonaObj.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {activePersonaObj.role} • {selectedBranch} ({selectedSubject})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSessionActive(false)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl transition-all"
                >
                  Change Setup
                </button>
              </div>

              {/* Question Viewport */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Examiner Question</span>
                  </span>

                  <button
                    onClick={handleSpeakQuestion}
                    disabled={isPlayingAudio || loadingQuestion}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all disabled:opacity-50"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
                    <span>{isPlayingAudio ? 'Speaking...' : 'Listen Question'}</span>
                  </button>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl min-h-[100px] flex items-center">
                  {loadingQuestion ? (
                    <div className="flex items-center space-x-3 text-slate-400 text-xs">
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Formulating realistic viva question...</span>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-100 leading-relaxed">
                      "{currentQuestion?.question}"
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Student Voice Answer Console */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span>Your Voice Answer</span>
                </h4>
                {isListening && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    ● Recording Voice
                  </span>
                )}
              </div>

              {/* Big Mic Button */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
                <button
                  onClick={handleToggleRecord}
                  disabled={loadingQuestion || evaluating}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <p className="text-xs text-slate-400">
                  {isListening ? 'Click mic to finish recording' : 'Click mic to speak your answer'}
                </p>
              </div>

              {/* Transcript / Text Input Area */}
              <div className="space-y-2">
                <textarea
                  value={studentAnswerText}
                  onChange={(e) => setStudentAnswerText(e.target.value)}
                  placeholder="Your recorded voice answer will transcribe here... Or type your answer directly."
                  rows={4}
                  disabled={evaluating}
                  className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-2xl p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Action Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => fetchNextQuestion()}
                  disabled={loadingQuestion || evaluating}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Skip Question</span>
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={evaluating || !studentAnswerText.trim() || loadingQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all disabled:opacity-40 flex items-center space-x-2"
                >
                  {evaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer for Grading</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Scorecard & Feedback Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {scorecard ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                
                {/* Score & Grade Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Evaluation Scorecard
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-black text-white">{scorecard.score}</span>
                      <span className="text-xs text-slate-400 font-bold">/ 10</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xl font-black px-4 py-1.5 rounded-2xl border ${
                        scorecard.score >= 8
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : scorecard.score >= 6
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      Grade: {scorecard.grade || 'B'}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  "{scorecard.summary}"
                </p>

                {/* Covered Concepts */}
                {scorecard.coveredConcepts && scorecard.coveredConcepts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Concepts Covered</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {scorecard.coveredConcepts.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-full"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missed Concepts */}
                {scorecard.missedConcepts && scorecard.missedConcepts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Missed / Incorrect Concepts</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {scorecard.missedConcepts.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2.5 py-0.5 rounded-full"
                        >
                          ✕ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tone Feedback */}
                {scorecard.toneFeedback && (
                  <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-purple-400 flex items-center space-x-1.5">
                      <Brain className="w-4 h-4" />
                      <span>Tone & Confidence Feedback</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {scorecard.toneFeedback}
                    </p>
                  </div>
                )}

                {/* Model 10/10 Answer */}
                {scorecard.modelAnswer && (
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                      <Award className="w-4 h-4" />
                      <span>10/10 Model Reference Answer</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {scorecard.modelAnswer}
                    </p>
                  </div>
                )}

                {/* Next Steps Buttons */}
                <div className="space-y-2 pt-2">
                  {scorecard.followupQuestion && (
                    <button
                      onClick={() => fetchNextQuestion(true, scorecard.followupQuestion)}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Take Follow-up Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => fetchNextQuestion()}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
                  >
                    Next Topic Question
                  </button>
                </div>

              </div>
            ) : (
              /* Waiting for Evaluation Empty State */
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                <Award className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-300">No Evaluation Scorecard Yet</h4>
                  <p className="text-xs text-slate-500">
                    Record your spoken answer on the left and submit to receive instant technical feedback, missed terms, and grade scores.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
