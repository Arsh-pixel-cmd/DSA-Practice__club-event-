import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const WarningOverlay = ({ warnings, isExamStarted, onResume }) => {
    return (
        <AnimatePresence>
            {warnings > 0 && warnings < 3 && isExamStarted && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                >
                    <div className="bg-slate-900 border-2 border-red-500/50 p-10 rounded-3xl max-w-md w-full text-center shadow-[0_0_80px_rgba(239,68,68,0.2)]">
                        <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">Security Breach</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            We detected that you navigated away from the assessment. You have <span className="text-red-400 font-black">{3 - warnings}</span> warnings remaining before immediate session termination.
                        </p>
                        <button
                            onClick={onResume}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-600/20"
                        >
                            RETURN TO EXAM
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WarningOverlay;
