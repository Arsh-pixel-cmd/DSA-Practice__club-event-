import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/views/Landing';
import Admin from './components/views/Admin';
import StudentDashboard from './components/views/StudentDashboard';
import ProblemWorkspace from './components/views/ProblemWorkspace';
import ExamWorkspace from './components/exam/ExamWorkspace';
import WarningOverlay from './components/exam/WarningOverlay';
import Login from './components/views/Login';
import { useAntiCheat } from './hooks/useAntiCheat';
import { LANGUAGES, INITIAL_QUESTIONS, INITIAL_LEADERBOARD } from './lib/constants';
import { executeCodeAction } from './lib/actions';
import { supabase } from './lib/supabase';

// Default code templates for each language
const getDefaultCode = (languageId) => {
    const templates = {
        63: `// JavaScript/Node.js Solution
function solve() {
    // Your solution here
    return "Hello World";
}

console.log(solve());`,
        71: `# Python 3 Solution
def solve():
    # Your solution here
    return "Hello World"

if __name__ == "__main__":
    print(solve())`,
        54: `// C++ Solution
#include <iostream>
using namespace std;

int main() {
    // Your solution here
    cout << "Hello World" << endl;
    return 0;
}`,
        62: `// Java Solution
public class Main {
    public static void main(String[] args) {
        // Your solution here
        System.out.println("Hello World");
    }
}`,
    };
    return templates[languageId] || '// Start typing your solution...';
};

// Protected Layout Component
const ProtectedLayout = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children ? children : <Outlet />;
};

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Global State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Auth Listener
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [selectedProblem, setSelectedProblem] = useState(null);
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(getDefaultCode(LANGUAGES[0].id));
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Mock Data - Initialize from localStorage if available
    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem('dsa-questions');
        return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    });
    const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

    // Persist questions to localStorage
    useEffect(() => {
        localStorage.setItem('dsa-questions', JSON.stringify(questions));
    }, [questions]);

    // Anti-Cheat Hook - currently only relevant for Exam View
    const { warnings, setWarnings, isFullscreen, requestFullscreen } = useAntiCheat(
        isExamStarted,
        () => { // onViolation limit reached
            setIsExamStarted(false);
            navigate('/landing'); // Redirect to public landing
            alert("Disqualified: Maximum tab switches exceeded.");
        },
        location.pathname === '/exam' // Monitor only on exam route
    );

    // Logout Handler
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>;
    }

    // Start Exam
    const startExam = () => {
        setIsExamStarted(true);
        navigate('/exam');
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
            {/* Show Navbar on all pages except Login and Exam (optional, but keep for consistency) */}
            {location.pathname !== '/login' && (
                <Navbar
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                    isAdmin={location.pathname === '/admin'}
                />
            )}

            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Login />
                } />

                {/* Public Landing (The old Landing.jsx) - renaming route to /welcome for clarity or keeping as option */}
                <Route path="/welcome" element={<Landing questions={questions} startExam={startExam} />} />

                {/* Protected Routes */}
                <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
                    {/* Dashboard is the new Home */}
                    <Route path="/" element={
                        <StudentDashboard
                            questions={questions}
                            userStats={leaderboard.find(u => u.name.includes('You'))}
                            onOpenProblem={(problem) => {
                                setSelectedProblem(problem);
                                navigate(`/problem/${problem.id}`);
                            }}
                        />
                    } />

                    <Route path="/problem/:id" element={
                        <ProblemWorkspace
                            // We will need to resolve the problem from ID inside the component or here
                            // For now passing "selectedProblem" state, but ideal is to read from URL params inside component
                            problem={selectedProblem || questions[0]} // Fallback if direct access (to be fixed)
                            userStats={leaderboard.find(u => u.name.includes('You'))}
                            onBack={() => navigate('/')}
                        />
                    } />

                    <Route path="/admin" element={
                        <Admin
                            questions={questions}
                            leaderboard={leaderboard}
                            onAddQuestion={(q) => setQuestions(prev => [...prev, q])}
                            onUpdateQuestion={(q) => setQuestions(prev => prev.map(old => old.id === q.id ? q : old))}
                            onDeleteQuestion={(id) => setQuestions(prev => prev.filter(q => q.id !== id))}
                        />
                    } />

                    <Route path="/exam" element={
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
                            onLanguageChange={(langId) => setCode(getDefaultCode(langId))}
                        />
                    } />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Warning Overlay */}
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
