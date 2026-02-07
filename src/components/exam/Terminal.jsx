import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ output }) => {
    const getStatusColor = (statusId) => {
        // Status ID 3 = Accepted
        if (statusId === 3) return 'text-emerald-400';
        // Status ID 1-2 = In Queue/Processing
        if (statusId === 1 || statusId === 2) return 'text-yellow-400';
        // Other statuses = Error
        return 'text-red-400';
    };

    const displayOutput = () => {
        if (!output) return null;

        const hasError = output.stderr || output.compile_output || (output.status.id !== 3 && output.status.id !== 1 && output.status.id !== 2);
        const displayText = output.stderr || output.compile_output || output.stdout || output.message || 'No output';

        return (
            <div className="space-y-2">
                <div className={`font-bold ${getStatusColor(output.status.id)}`}>
                    {output.status.description}
                    {output.time && output.time !== '0.000' && (
                        <span className="text-slate-500 ml-2">({output.time}s)</span>
                    )}
                    {output.memory && output.memory !== '0' && (
                        <span className="text-slate-500 ml-2">({Math.round(output.memory / 1024)}KB)</span>
                    )}
                </div>
                {hasError && output.stderr && (
                    <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>
                )}
                {hasError && output.compile_output && (
                    <pre className="text-red-400 whitespace-pre-wrap">{output.compile_output}</pre>
                )}
                {output.stdout && (
                    <pre className="text-slate-300 whitespace-pre-wrap">{output.stdout}</pre>
                )}
                {output.message && !output.stdout && !output.stderr && (
                    <pre className="text-slate-400 whitespace-pre-wrap">{output.message}</pre>
                )}
            </div>
        );
    };

    return (
        <div className="h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
            <div className="text-slate-600 mb-2 border-b border-slate-900 pb-1 flex items-center gap-2">
                <TerminalIcon size={12} /> Execution Logs
            </div>
            {output ? displayOutput() : <span className="text-slate-700 italic">No output yet. Click "Run Solution" to execute your code.</span>}
        </div>
    );
};

export default Terminal;
