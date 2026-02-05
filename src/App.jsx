import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/views/Landing';
import Admin from './components/views/Admin';
import ExamWorkspace from './components/exam/ExamWorkspace';
import WarningOverlay from './components/exam/WarningOverlay';
import { useAntiCheat } from './hooks/useAntiCheat';
import { LANGUAGES, INITIAL_QUESTIONS, INITIAL_LEADERBOARD } from './lib/constants';
import { executeCodeAction } from './lib/actions';

export default function App() {
    const [view, setView] = useState('landing'); // landing, exam, admin
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [code, setCode] = useState('// Start typing your solution...');
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Mock Data
    const [questions] = useState(INITIAL_QUESTIONS);
    const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

    // Anti-Cheat Hook
    const { warnings, setWarnings, isFullscreen, requestFullscreen } = useAntiCheat(
        isExamStarted,
        () => { // onViolation limit reached
            setIsExamStarted(false);
            setView('landing');
            alert("Disqualified: Maximum tab switches exceeded.");
        }
    );

    // Start Exam
    const startExam = () => {
        setIsExamStarted(true);
        setView('exam');
        requestFullscreen();
    };

    // Run Code
    const runCode = async () => {
        setIsRunning(true);
        try {
            const res = await executeCodeAction(code, selectedLang.id);
            setOutput(res);
            if (res.status.id === 3) {
                setLeaderboard(prev => {
                    const updated = prev.map(u => u.name.includes("You") ? { ...u, score: u.score + 100 } : u);
                    return [...updated].sort((a, b) => b.score - a.score);
                });
            }
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
            <Navbar view={view} setView={setView} />

            {/* VIEW: LANDING PAGE */}
            {view === 'landing' && (
                <Landing questions={questions} startExam={startExam} />
            )}

            {/* VIEW: EXAM WORKSPACE */}
            {view === 'exam' && (
                <ExamWorkspace
                    selectedLang={selectedLang}
                    setSelectedLang={setSelectedLang}
                    isFullscreen={isFullscreen}
                    warnings={warnings}
                    code={code}
                    setCode={setCode}
                    isRunning={isRunning}
                    runCode={runCode}
                    output={output}
                    leaderboard={leaderboard}
                    requestFullscreen={requestFullscreen}
                />
            )}

            {/* VIEW: ADMIN PANEL */}
            {view === 'admin' && (
                <Admin questions={questions} leaderboard={leaderboard} />
            )}

            {/* WARNING OVERLAY */}
            <WarningOverlay
                warnings={warnings}
                isExamStarted={isExamStarted}
                onResume={() => { setWarnings(0); requestFullscreen(); }}
            />

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
        </div>
    );
}
