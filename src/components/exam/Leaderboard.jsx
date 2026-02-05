import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ leaderboard }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col overflow-hidden">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" /> Active Leaderboard
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <LayoutGroup>
                    <AnimatePresence>
                        {leaderboard.map((u, i) => (
                            <motion.div
                                layout
                                key={u.id}
                                className={`p-3 rounded-lg border flex justify-between items-center ${u.name.includes("You") ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-slate-800/40 border-slate-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-600 w-4">#{i + 1}</span>
                                    <span className="text-xs font-semibold">{u.name}</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-indigo-400">{u.score}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </LayoutGroup>
            </div>
        </div>
    );
};

export default Leaderboard;
