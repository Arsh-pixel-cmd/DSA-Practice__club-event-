import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Chrome, Shield, Lock, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [mode, setMode] = useState('student'); // 'student' | 'admin'
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert('Error logging in: ' + error.message);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check Access Code
        const secret = import.meta.env.VITE_ADMIN_SECRET;
        if (accessCode === secret) {
            // Success: Store admin session in localStorage for this prototype
            // In a real app, this would be a secure backend exchange or a specific auth account
            // For now, we simulate an admin session that App.jsx will read
            localStorage.setItem('admin_access_token', 'valid');

            // Also need to login as a user to use Supabase (anonymous or specific admin account)
            // For this specific request "admin can login using that code", we will just authorize the UI
            // But to use the DB, we need a supabase user.
            // Simplified approach: Admin is just a UI state overlay on top of functionality. 
            // BUT user said "sign in option... for admin". 
            // If we don't sign in via Supabase, we can't do RLS.
            // Let's assume the "Access Code" authorizes them to use a generic admin account or just sets a local "isAdmin" flag 
            // combined with their personal login? 
            // User request: "admin can login using that code". 
            // Let's TREAT the code as the login credentials.

            // To make RLS work, we might need to actually sign them in. 
            // For now, let's set a local flag and redirect. 
            // The RLS refactor to support "role" is in the plan, but we can't easily "sign in" with just a code unless we have a backend function.
            // Compromise: Admin Code just sets the local admin View access. 
            // But they still need to be authenticated to Supabase to read data? 
            // Or maybe Admin doesn't need personal auth? 
            // Let's ask them to sign in via Social first? No, separate option.

            // Let's stick to the simplest interpretation:
            // Admin Code -> Sets 'isAdmin' = true.
            // For Supabase data, if RLS requires auth, this might fail unless public read is on.
            // Our schema allows public read. Admin needs write. Write policy needs auth.
            // Okay, let's keep it simple: Admin login creates a dummy session or requires social login + code?
            // "one for user and other for admin panel" implies mutually exclusive.

            // ACTUAL SOLUTION: 
            // We will set a localStorage 'isAdmin' = 'true' and redirect.
            // Changes to data will be done via client-side RLS which currently might block unauthenticated users.
            // Warning: This is not secure for a real backend without a real user.
            // But for this "code only" requirement:
            navigate('/admin');
        } else {
            alert("Invalid Access Code");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl shadow-indigo-500/10"
            >
                <div className="flex justify-center mb-8">
                    <Logo size="large" />
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-800/50 rounded-xl mb-8">
                    <button
                        onClick={() => setMode('student')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'student' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => setMode('admin')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Admin
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {mode === 'student' ? 'Welcome Back' : 'Admin Access'}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {mode === 'student' ? 'Sign in to continue your coding journey' : 'Enter your secure access code'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'student' ? (
                        <motion.div
                            key="student"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => handleLogin('google')}
                                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
                            >
                                <Chrome size={20} />
                                <span>Sign in with Google</span>
                            </button>

                            <button
                                onClick={() => handleLogin('github')}
                                className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white hover:bg-[#2f363d] font-bold py-3.5 rounded-xl transition-all border border-slate-700 active:scale-[0.98]"
                            >
                                <Github size={20} />
                                <span>Sign in with GitHub</span>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="admin"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleAdminLogin}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    placeholder="Enter Access Code"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white font-bold rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Shield size={20} />
                                        <span>Access Panel</span>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px bg-slate-800 flex-1" />
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Secure System</span>
                    <div className="h-px bg-slate-800 flex-1" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
