import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Settings, User } from 'lucide-react';

const Admin = ({ questions, leaderboard }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Question Management */}
                <div className="md:col-span-7">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Problem Management</h2>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                            <PlusCircle size={18} /> Add New Question
                        </button>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Problem</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Difficulty</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {questions.map(q => (
                                    <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white">{q.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-indigo-400">{q.points}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white transition-colors p-1"><Settings size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global User Stats & Violations */}
                <div className="md:col-span-5">
                    <h2 className="text-2xl font-bold text-white mb-6">Participant Audit</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="space-y-4">
                            {leaderboard.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                            <User size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{u.name}</div>
                                            <div className="text-xs text-slate-500">Score: {u.score}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold uppercase tracking-widest ${u.violations > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                                            {u.violations} Violations
                                        </div>
                                        <button className="text-[10px] text-indigo-400 font-bold hover:underline mt-1">VIEW LOGS</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Admin;
