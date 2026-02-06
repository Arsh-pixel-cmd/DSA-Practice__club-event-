import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, isRunning, runCode, selectedLang, isFullscreen, requestFullscreen }) => {
    // Map language IDs to Monaco Editor language identifiers
    const getMonacoLanguage = (languageId) => {
        const languageMap = {
            54: 'cpp',      // C++
            62: 'java',     // Java
            71: 'python',   // Python
            63: 'javascript', // JavaScript
        };
        return languageMap[languageId] || 'javascript';
    };

    const handleEditorDidMount = (editor, monaco) => {
        // Configure editor theme and settings
        monaco.editor.defineTheme('dark-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0f172a', // slate-900
                'editor.foreground': '#e2e8f0', // slate-200
            },
        });
        monaco.editor.setTheme('dark-theme');

        // Request fullscreen when editor is focused
        editor.onDidFocusEditorText(() => {
            if (!isFullscreen) {
                requestFullscreen();
            }
        });
    };

    const handleEditorChange = (value) => {
        setCode(value || '');
    };

    return (
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl">
            <div className="p-3 border-b border-slate-800 flex justify-between bg-slate-900/50 z-10">
                <span className="text-xs font-mono text-slate-500">editor.main.{selectedLang.name.toLowerCase()}</span>
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1 rounded text-xs font-bold flex items-center gap-2 transition-all"
                >
                    {isRunning ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={12} fill="currentColor" />}
                    Run Solution
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={getMonacoLanguage(selectedLang.id)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="dark-theme"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                    loading={
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <div className="h-6 w-6 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CodeEditor;
