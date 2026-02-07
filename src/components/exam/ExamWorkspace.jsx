import React from 'react';
import { Monitor, AlertCircle } from 'lucide-react';
import { LANGUAGES } from '../../lib/constants';
import CodeEditor from './Editor';
import Terminal from './Terminal';
import Leaderboard from './Leaderboard';

const ExamWorkspace = ({
    selectedLang,
    setSelectedLang,
    isFullscreen,
    warnings,
    code,
    setCode,
    isRunning,
    runCode,
    output,
    leaderboard,
    requestFullscreen,
    onLanguageChange
}) => {
    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-160px)]">
            {/* Header Stats */}
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Language:</span>
                        <select
                            className="bg-slate-800 border-none rounded text-xs px-2 py-1 font-bold text-indigo-400 focus:ring-0"
                            value={selectedLang.id}
                            onChange={(e) => {
                                const newLang = LANGUAGES.find(l => l.id === parseInt(e.target.value));
                                setSelectedLang(newLang);
                                if (onLanguageChange) {
                                    onLanguageChange(newLang.id);
                                }
                            }}
                        >
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                        </select>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <Monitor size={14} className={isFullscreen ? 'text-emerald-400' : 'text-red-400'} />
                        <span className="text-xs font-bold uppercase tracking-wider">{isFullscreen ? 'System Secured' : 'Fullscreen Required'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">Warnings: {warnings}/3</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Editor Area */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    <CodeEditor
                        code={code}
                        setCode={setCode}
                        isRunning={isRunning}
                        runCode={runCode}
                        selectedLang={selectedLang}
                        isFullscreen={isFullscreen}
                        requestFullscreen={requestFullscreen}
                    />

                    {/* Terminal Output */}
                    <Terminal output={output} />
                </div>

                {/* Sidebar Ranking */}
                <div className="hidden lg:flex col-span-4 flex-col gap-4">
                    <Leaderboard leaderboard={leaderboard} />
                </div>
            </div>
        </div>
    );
};

export default ExamWorkspace;
