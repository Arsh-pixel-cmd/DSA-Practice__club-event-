import React from 'react';
import { Play } from 'lucide-react';

const Editor = ({ code, setCode, isRunning, runCode, selectedLang, isFullscreen, requestFullscreen }) => {
    return (
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl">
            <div className="p-3 border-b border-slate-800 flex justify-between bg-slate-900/50">
                <span className="text-xs font-mono text-slate-500">editor.main.{selectedLang.name.toLowerCase()}</span>
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1 rounded text-xs font-bold flex items-center gap-2 transition-all"
                >
                    {isRunning ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={12} fill="currentColor" />}
                    Run Solution
                </button>
            </div>
            <textarea
                className="flex-1 p-6 bg-transparent font-mono text-sm resize-none focus:outline-none text-indigo-100"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onFocus={() => { if (!isFullscreen) requestFullscreen(); }}
                spellCheck="false"
                placeholder="The system will force fullscreen once you start writing..."
            />
        </div>
    );
};

export default Editor;
