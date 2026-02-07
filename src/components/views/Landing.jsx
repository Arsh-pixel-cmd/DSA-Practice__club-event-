import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ChevronRight } from 'lucide-react';

const Landing = ({ questions, startExam }) => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-white mb-4">Available Challenges</h2>
                <p className="text-slate-400">Select a problem to begin your proctored assessment.</p>
            </motion.div>

            <div className="grid gap-4">
                {questions.filter(q => q.status !== 'Draft').map((q) => (
                    <motion.div
                        key={q.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center group cursor-pointer"
                        onClick={startExam}
                    >
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <Code2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{q.title}</h3>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Difficulty: {q.difficulty}</span>
                                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">{q.points} Points</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
