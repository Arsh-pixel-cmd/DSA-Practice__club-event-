import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

const SubmissionDetailModal = ({ isOpen, onClose, submission, onBack }) => {
    if (!isOpen || !submission) return null;

    // Mock Details
    const details = {
        code: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`,
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        expected: '[0,1]'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                                    <ArrowLeft size={24} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Submission Details</h2>
                                    <p className="text-sm text-slate-400">{submission.student} • {submission.language}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body split */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                            {/* Left: Code */}
                            <div className="bg-[#1e1e1e] border-r border-slate-800 flex flex-col">
                                <div className="px-4 py-2 border-b border-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-widest">Code</div>
                                <div className="flex-1 pt-4">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="python"
                                        defaultValue={details.code}
                                        theme="vs-dark"
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right: Results */}
                            <div className="bg-slate-950 p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Result Details</div>
                                    <div className={`p-4 rounded-xl border ${submission.status === 'Passed' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {submission.status === 'Passed' ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                                            <span className={`text-lg font-bold ${submission.status === 'Passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {submission.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 text-sm text-slate-400 font-mono">
                                            <span>Runtime: {submission.time}</span>
                                            <span>Memory: {submission.memory}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input</div>
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-sm text-slate-300">
                                        {details.input}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output</div>
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-sm text-white">
                                        {details.output}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expected Output</div>
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-sm text-emerald-400">
                                        {details.expected}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubmissionDetailModal;
