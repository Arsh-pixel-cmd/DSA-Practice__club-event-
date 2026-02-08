import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/views/Login';
import AdminGuard from './components/auth/AdminGuard';
import { useAntiCheat } from './hooks/useAntiCheat';
import { LANGUAGES, INITIAL_QUESTIONS, INITIAL_LEADERBOARD } from './lib/constants';
import { executeCodeAction } from './lib/actions';
import { supabase } from './lib/supabase';

// Lazy load components for code splitting
const Landing = React.lazy(() => import('./components/views/Landing'));
const Admin = React.lazy(() => import('./components/views/Admin'));
const StudentDashboard = React.lazy(() => import('./components/views/StudentDashboard'));
const ProblemWorkspace = React.lazy(() => import('./components/views/ProblemWorkspace'));
const ExamWorkspace = React.lazy(() => import('./components/exam/ExamWorkspace'));
const WarningOverlay = React.lazy(() => import('./components/exam/WarningOverlay'));
const Profile = React.lazy(() => import('./components/views/Profile'));

// Loading component
const Loading = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        Loading...
    </div>
);

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
const ProtectedLayout = ({ isAuthenticated, isAdmin, children }) => {
    if (!isAuthenticated && !isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children ? children : <Outlet />;
};

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Global State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('admin_access_token') === 'valid';
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // App State - questions fetched from DB
    const [questions, setQuestions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    // Fetch Questions from DB
    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order('id', { ascending: true });

            if (error) console.error('Error fetching questions:', error);
            else setQuestions(data || []);
        };

        fetchQuestions();
    }, []);

    // ... existing exam state ...
    const [selectedProblem, setSelectedProblem] = useState(null); // Will be set after fetch
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // Kept LANGUAGES[0] for consistency with getDefaultCode
    const [code, setCode] = useState(getDefaultCode(LANGUAGES[0].id)); // Initial code based on default language
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Auth Check Effect
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setIsAuthenticated(!!session);
                setUser(session?.user || null);
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            setUser(session?.user || null);
            setIsLoading(false); // Ensure loading is off on change
        });

        return () => subscription.unsubscribe();
    }, []);

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
        localStorage.removeItem('admin_access_token');
        setIsAdmin(false);
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
                    isAdmin={isAdmin} // Pass admin state
                />
            )}

            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/" replace /> : <Login />
                    } />

                    {/* Public Landing (The old Landing.jsx) - renaming route to /welcome for clarity or keeping as option */}
                    <Route path="/welcome" element={<Landing questions={questions} startExam={startExam} />} />

                    {/* Protected Routes - Student */}
                    <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} />}>
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

                        {/* Profile Page */}
                        <Route path="/profile" element={<Profile />} />

                        <Route path="/problem/:id" element={
                            <ProblemWorkspace
                                // We will need to resolve the problem from ID inside the component or here
                                // For now passing "selectedProblem" state, but ideal is to read from URL params inside component
                                problem={selectedProblem || questions[0]} // Fallback if direct access (to be fixed)
                                userStats={leaderboard.find(u => u.name.includes('You'))}
                                onBack={() => navigate('/')}
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

                    {/* Protected Routes - Admin */}
                    <Route element={<AdminGuard isAdmin={isAdmin} />}>
                        <Route path="/admin" element={
                            <Admin
                                questions={questions}
                                leaderboard={leaderboard}
                                onAddQuestion={async (newQuestion) => {
                                    try {
                                        const { data, error } = await supabase
                                            .from('questions')
                                            .insert([{
                                                ...newQuestion,
                                                // Ensure explicit fields if needed, or rely on object spread
                                                examples: newQuestion.examples || []
                                            }])
                                            .select()
                                            .single();

                                        if (error) throw error;
                                        setQuestions(prev => [...prev, data]);
                                        alert('Question added successfully!');
                                    } catch (err) {
                                        console.error('Error adding question:', err);
                                        alert('Failed to add question');
                                    }
                                }}
                                onUpdateQuestion={async (updatedQuestion) => {
                                    try {
                                        const { error } = await supabase
                                            .from('questions')
                                            .update(updatedQuestion)
                                            .eq('id', updatedQuestion.id);

                                        if (error) throw error;
                                        setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
                                        alert('Question updated successfully!');
                                    } catch (err) {
                                        console.error('Error updating question:', err);
                                        alert('Failed to update question');
                                    }
                                }}
                                onDeleteQuestion={async (id) => {
                                    try {
                                        const { error } = await supabase
                                            .from('questions')
                                            .delete()
                                            .eq('id', id);

                                        if (error) throw error;
                                        setQuestions(prev => prev.filter(q => q.id !== id));
                                        alert('Question deleted successfully!');
                                    } catch (err) {
                                        console.error('Error deleting question:', err);
                                        alert('Failed to delete question');
                                    }
                                }}
                                onCleanupDuplicates={async () => {
                                    if (!window.confirm('Are you sure you want to remove duplicate questions? This cannot be undone.')) return;

                                    try {
                                        // 1. Fetch all questions (id, title)
                                        const { data: allQuestions, error: fetchError } = await supabase
                                            .from('questions')
                                            .select('id, title')
                                            .order('id', { ascending: true });

                                        if (fetchError) throw fetchError;
                                        if (!allQuestions || allQuestions.length === 0) {
                                            alert('No questions found.');
                                            return;
                                        }

                                        // 2. Identify duplicates
                                        const seenTitles = new Set();
                                        const duplicatesToDelete = [];

                                        allQuestions.forEach(q => {
                                            const normalizedTitle = q.title.trim().toLowerCase();
                                            if (seenTitles.has(normalizedTitle)) {
                                                duplicatesToDelete.push(q.id);
                                            } else {
                                                seenTitles.add(normalizedTitle);
                                            }
                                        });

                                        if (duplicatesToDelete.length === 0) {
                                            alert('No duplicates found.');
                                            return;
                                        }

                                        // 3. Delete duplicates
                                        const { error: deleteError } = await supabase
                                            .from('questions')
                                            .delete()
                                            .in('id', duplicatesToDelete);

                                        if (deleteError) throw deleteError;

                                        // 4. Update local state
                                        setQuestions(prev => prev.filter(q => !duplicatesToDelete.includes(q.id)));
                                        alert(`Successfully removed ${duplicatesToDelete.length} duplicate questions.`);

                                    } catch (err) {
                                        console.error('Error cleaning duplicates:', err);
                                        alert('Failed to clean duplicates. Check console for details.');
                                    }
                                }}
                            />
                        } />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>

            {/* Warning Overlay */}
            <Suspense fallback={null}>
                <WarningOverlay
                    warnings={warnings}
                    isExamStarted={isExamStarted}
                    onResume={() => { setWarnings(0); requestFullscreen(); }}
                />
            </Suspense>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
        </div>
    );
}
