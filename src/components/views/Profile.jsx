import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Calendar, Code, Award, Medal, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // If strictly no user, we can't show a profile
            if (!user) {
                console.warn("No authenticated user found for profile.");
                setLoading(false);
                return;
            }

            // Default values
            let profileData = null;
            let solvedIds = [];
            let newStats = {
                easy: { solved: 0, total: 0 },
                medium: { solved: 0, total: 0 },
                hard: { solved: 0, total: 0 }
            };

            try {
                // 1. Try to fetch Profile (use maybeSingle to avoid 406/errors on empty)
                const { data: dbProfile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (dbProfile) {
                    profileData = dbProfile;
                } else if (profileError) {
                    console.warn("Error fetching profile row:", profileError);
                }

                // 2. Fetch Stats
                const { data: submissions } = await supabase
                    .from('submissions')
                    .select('question_id, status')
                    .eq('user_id', user.id)
                    .eq('status', 'Accepted');

                solvedIds = [...new Set(submissions?.map(s => s.question_id) || [])];

                const { data: questions } = await supabase
                    .from('questions')
                    .select('id, difficulty');

                questions?.forEach(q => {
                    const diff = q.difficulty?.toLowerCase() || 'easy';
                    if (newStats[diff]) {
                        newStats[diff].total++;
                        if (solvedIds.includes(q.id)) {
                            newStats[diff].solved++;
                        }
                    }
                });

            } catch (dbError) {
                console.error("Error fetching DB data:", dbError);
                // Swallow DB errors so we still show the basic profile from auth
            }

            // Construct Final Profile State
            // Use DB data if available, otherwise fallback to Auth Metadata
            const finalProfile = {
                id: user.id,
                username: profileData?.username || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
                avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
                created_at: profileData?.created_at || user.created_at,
                // Use calculated stats
                solvedCount: solvedIds.length,
                email: user.email
            };

            setProfile(finalProfile);
            setStats(newStats);

        } catch (error) {
            console.error("Critical error in fetchProfileData:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center text-slate-500 mt-20">Loading profile...</div>;

    if (!profile) return <div className="text-center text-slate-500 mt-20">Profile not found.</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-8 z-10 w-full">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/20 ring-4 ring-slate-800">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={40} />
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{profile.username || 'Anonymous User'}</h2>
                        <p className="text-slate-400 text-sm mb-4">Student • Stanford University</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                                <Calendar size={14} className="text-indigo-400" />
                                <span>Joined {formatDate(profile.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                                <Code size={14} className="text-emerald-400" />
                                <span>{profile.solvedCount} Problems Solved</span>
                            </div>
                        </div>
                    </div>

                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95 shrink-0">
                        Edit profile
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Problem Statistics</h3>
                    <div className="space-y-6">
                        {['easy', 'medium', 'hard'].map((diff) => {
                            const percentage = stats[diff].total ? (stats[diff].solved / stats[diff].total) * 100 : 0;
                            return (
                                <div key={diff}>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="capitalize text-slate-400">{diff}</span>
                                        <div className="flex items-center gap-1">
                                            <span className={
                                                diff === 'easy' ? 'text-emerald-400' :
                                                    diff === 'medium' ? 'text-amber-400' : 'text-red-400'
                                            }>{stats[diff].solved}</span>
                                            <span className="text-slate-600">/</span>
                                            <span className="text-slate-600">{stats[diff].total}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${diff === 'easy' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                                diff === 'medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                                                }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Achievements Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Achievements</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors cursor-default group">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">First Problem Solved</h4>
                                <p className="text-slate-500 text-xs mt-0.5">Completed your first problem</p>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors cursor-default group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Star size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">7 Day Streak</h4>
                                <p className="text-slate-500 text-xs mt-0.5">Solved problems for 7 days in a row</p>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed hover:cursor-default">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Medal size={20} />
                            </div>
                            <div>
                                <h4 className="text-slate-300 font-bold text-sm">Problem Master</h4>
                                <p className="text-slate-500 text-xs mt-0.5">Solve 100 problems ({profile.solvedCount}/100)</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
