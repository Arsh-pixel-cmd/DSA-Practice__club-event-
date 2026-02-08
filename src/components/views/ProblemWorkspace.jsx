import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, RotateCcw, Play, CheckCircle, ChevronDown, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { LANGUAGES, INITIAL_QUESTIONS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

const LANGUAGE_CONFIG = {
    63: { name: 'javascript', label: 'JS', extension: 'js' },
    71: { name: 'python', label: 'PY', extension: 'py' },
    54: { name: 'cpp', label: 'CPP', extension: 'cpp' },
    62: { name: 'java', label: 'JAVA', extension: 'java' }
};

const getDefaultCode = (langId, title) => {
    switch (langId) {
        case 63: return `// Write your JavaScript solution for ${title}\nfunction solution() {\n    // Your code here\n}`;
        case 71: return `# Write your Python solution for ${title}\ndef solution():\n    # Your code here\n    pass`;
        case 54: return `// Write your C++ solution for ${title}\nclass Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};`;
        case 62: return `// Write your Java solution for ${title}\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}`;
        default: return '// Write your solution here';
    }
};

const ProblemWorkspace = ({ userStats, onBack }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // In a real app, fetch problem by ID. Here we find it from constants or local storage
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        // Fallback to find problem if not passed directly (simulate fetch)
        const savedQuestions = localStorage.getItem('dsa-questions');
        const allQuestions = savedQuestions ? JSON.parse(savedQuestions) : INITIAL_QUESTIONS;
        const found = allQuestions.find(q => q.id === parseInt(id));

        if (found) {
            setProblem(found);
            setCode(getDefaultCode(LANGUAGES[0].id, found.title));
        } else {
            // Handle not found
            navigate('/');
        }
    }, [id, navigate]);

    const [language, setLanguage] = useState(LANGUAGES[0]); // Default JavaScript
    const [code, setCode] = useState(''); // Init empty, set in useEffect
    const [activeTab, setActiveTab] = useState('case1');
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(null);
    const [time, setTime] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };


    // Real code execution logic
    const handleRun = async (isSubmission = false) => {
        setIsRunning(true);
        setActiveTab('output');
        setOutput(null); // Clear previous output

        try {
            // Import dynamically to avoid circular deps if any, but standard import is fine
            const { executeCode, saveSubmission } = await import('../../lib/codeExecution');

            // Execute Code (Judge0 -> AI Fallback)
            const result = await executeCode(code, language.name, problem);

            setOutput(result);

            // If it's a submission and user is logged in, save it
            if (isSubmission && userStats) { // userStats currently passed from App.jsx, might need real user ID
                // Ideally we get user from context or prop. userStats is from leaderboard finding.
                // Let's rely on supabase auth user in lib.
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    await saveSubmission(user.id, problem.id, code, language.name, result);
                    // Refresh data? 
                    // in a real app query invalidation. For now, maybe just show success.
                }
            }

        } catch (error) {
            console.error("Execution failed:", error);
            setOutput({
                status: 'Error',
                score: 0,
                feedback: 'Execution failed: ' + error.message
            });
        } finally {
            setIsRunning(false);
        }
    };
    <button
        onClick={() => handleRun(false)}
        disabled={isRunning}
        className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all text-xs font-bold shadow-lg shadow-indigo-900/20"
    >
        {isRunning ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
            <Play size={14} fill="currentColor" />
        )}
        Run Code
    </button>

    if (!problem) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading problem...</div>;

    const currentLangConfig = LANGUAGE_CONFIG[language.id];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-white flex items-center gap-3">
                            {problem.title}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                {problem.difficulty}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 font-mono text-sm">
                        <Clock size={16} />
                        <span>{formatTime(time)}</span>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors text-sm font-bold"
                        onClick={() => {
                            setCode('// Write your solution here\nfunction solution() {\n\n}');
                            setTime(0);
                        }}
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                    <button
                        onClick={() => handleRun(true)}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors text-sm font-bold shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle size={16} />
                        {isRunning ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </header>

            {/* Main Content (Split View) */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description */}
                <div className="w-1/2 p-6 overflow-y-auto custom-scrollbar border-r border-slate-800">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Given an array of integers <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400">nums</code> and an integer <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400">target</code>, return indices of the two numbers such that they add up to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400">target</code>.
                            </p>
                            <p className="text-slate-400 leading-relaxed mt-4">
                                You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                            </p>
                            <p className="text-slate-400 leading-relaxed mt-4">
                                You can return the answer in any order.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-white mb-4">Examples</h3>
                            <div className="space-y-4">
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Example 1</h4>
                                    <div className="font-mono text-sm space-y-1">
                                        <p><span className="text-indigo-400">Input:</span> nums = [2,7,11,15], target = 9</p>
                                        <p><span className="text-emerald-400">Output:</span> [0,1]</p>
                                        <p className="text-slate-500 mt-2 text-xs italic">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Example 2</h4>
                                    <div className="font-mono text-sm space-y-1">
                                        <p><span className="text-indigo-400">Input:</span> nums = [3,2,4], target = 6</p>
                                        <p><span className="text-emerald-400">Output:</span> [1,2]</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-white mb-4">Constraints</h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li>2 ≤ nums.length ≤ 104</li>
                                <li>-109 ≤ nums[i] ≤ 109</li>
                                <li>-109 ≤ target ≤ 109</li>
                                <li>Only one valid answer exists.</li>
                            </ul>
                        </section>
                    </div>
                </div>

                {/* Right Panel: Editor & Console */}
                <div className="w-1/2 flex flex-col bg-slate-950">
                    {/* Editor Header */}
                    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                        {/* File Tab */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-t-lg text-sm text-slate-200 border-t border-x border-slate-700 relative top-1">
                            <span className="text-indigo-400">{currentLangConfig.label}</span>
                            <span className="font-medium">solution.{currentLangConfig.extension}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    // onBlur needs to be handled carefully with clicking inside the dropdown
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-colors"
                                >
                                    {language.label}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl z-50 p-1"
                                        >
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() => {
                                                        setLanguage(lang);
                                                        setCode(getDefaultCode(lang.id, problem.title));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-between ${language.id === lang.id
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    {lang.label}
                                                    {language.id === lang.id && <Check size={14} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all text-xs font-bold shadow-lg shadow-indigo-900/20"
                            >
                                {isRunning ? (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Play size={14} fill="currentColor" />
                                )}
                                Run Code
                            </button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={currentLangConfig.name}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                            }}
                        />
                    </div>

                    {/* Bottom Console */}
                    <div className="h-1/3 border-t border-slate-800 bg-slate-900 flex flex-col">
                        <div className="flex border-b border-slate-800">
                            <button
                                onClick={() => setActiveTab('case1')}
                                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'case1' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                Test Cases
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'output' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                Output
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'case1' && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <button className="px-4 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-white border border-slate-700">Case 1</button>
                                        <button className="px-4 py-1.5 bg-transparent rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800/50 transition-colors">Case 2</button>
                                        <button className="px-4 py-1.5 bg-transparent rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800/50 transition-colors">Case 3</button>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 mb-1 uppercase">nums =</div>
                                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-sm text-slate-300">[2,7,11,15]</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 mb-1 uppercase">target =</div>
                                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-sm text-slate-300">9</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'output' && (
                                <div className="font-mono text-sm">
                                    {!output && !isRunning && (
                                        <div className="text-slate-500 italic">Run your code to see output...</div>
                                    )}
                                    {isRunning && (
                                        <div className="text-slate-400">Running callbacks...</div>
                                    )}
                                    {output && (
                                        <div className="space-y-4">
                                            <div className="text-emerald-400 font-bold text-lg mb-2">Accepted</div>

                                            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 space-y-2">
                                                <div className="flex gap-2 text-xs text-slate-500 mb-2">
                                                    <span>Runtime: {output.runtime || output.time || '0.00'}s</span>
                                                    <span>Memory: {output.memory ? Math.round(output.memory) : 0}KB</span>
                                                </div>
                                                <div className="text-slate-300 whitespace-pre-wrap">{output.stdout}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemWorkspace;
