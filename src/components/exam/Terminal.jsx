import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ output }) => {
    return (
        <div className="h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto">
            <div className="text-slate-600 mb-2 border-b border-slate-900 pb-1 flex items-center gap-2">
                <TerminalIcon size={12} /> Execution Logs
            </div>
            {output ? (
                <div className="space-y-1">
                    <div className={output.status.id === 3 ? 'text-emerald-400' : 'text-red-400'}>{output.status.description}</div>
                    <pre className="text-slate-400 whitespace-pre-wrap">{output.stdout}</pre>
                </div>
            ) : <span className="text-slate-700 italic">No output yet.</span>}
        </div>
    );
};

export default Terminal;
