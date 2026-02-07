import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const SubmissionsModal = ({ isOpen, onClose, question, onViewDetail }) => {
    if (!isOpen || !question) return null;

    // Mock Submissions Data
    const submissions = [
        { id: 1, student: 'Alice Zhang', language: 'Python', status: 'Passed', time: '120ms', memory: '48MB', date: 'Feb 6, 10:32' },
        { id: 2, student: 'Bob Smith', language: 'C++', status: 'Failed', time: '-', memory: '-', date: 'Feb 6, 10:35' },
        { id: 3, student: 'Charlie Day', language: 'Java', status: 'TLE', time: '-', memory: '-', date: 'Feb 6, 10:40' },
        { id: 4, student: 'David Kim', language: 'JavaScript', status: 'Passed', time: '115ms', memory: '52MB', date: 'Feb 6, 11:15' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Passed': return 'text-emerald-400 bg-emerald-400/10';
            case 'Failed': return 'text-red-400 bg-red-400/10';
            case 'TLE': return 'text-amber-400 bg-amber-400/10';
            default: return 'text-slate-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Passed': return <CheckCircle size={14} />;
            case 'Failed': return <XCircle size={14} />;
            case 'TLE': return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white">Submissions — {question.title}</h2>
                                <p className="text-sm text-slate-400">{submissions.length} submissions total</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Language</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Memory</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Submitted At</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{sub.student}</td>
                                            <td className="px-6 py-4 text-slate-300">{sub.language}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(sub.status)}`}>
                                                    {getStatusIcon(sub.status)} {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-400">{sub.time}</td>
                                            <td className="px-6 py-4 font-mono text-slate-400">{sub.memory}</td>
                                            <td className="px-6 py-4 text-slate-400">{sub.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => onViewDetail(sub)}
                                                    className="bg-indigo-600/10 hover:bg-indigo-600 hover:text-white text-indigo-400 border border-indigo-600/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubmissionsModal;
