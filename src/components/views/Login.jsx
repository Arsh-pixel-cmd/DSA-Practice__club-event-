import React from 'react';
import { motion } from 'framer-motion';
import { Github, Chrome, ArrowRight, Code2 } from 'lucide-react';
import Logo from '../common/Logo';
import { supabase } from '../../lib/supabase';

const Login = () => {
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

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Sign in to continue your coding journey</p>
                </div>

                <div className="space-y-4">
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
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px bg-slate-800 flex-1" />
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Secure Access</span>
                    <div className="h-px bg-slate-800 flex-1" />
                </div>

                <p className="mt-8 text-center text-xs text-slate-500">
                    By signing in, you agree to our <a href="#" className="underline hover:text-indigo-400">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-400">Privacy Policy</a>.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
