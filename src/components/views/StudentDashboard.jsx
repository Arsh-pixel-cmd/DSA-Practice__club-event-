import React from 'react';
import { LayoutDashboard, Code2, User, Settings, Search, Bell, ChevronRight, CheckCircle, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'problems', icon: Code2, label: 'Problems' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <Logo size="medium" />
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-indigo-600 shadow-lg shadow-indigo-900/20 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* User Profile Snippet (Bottom) */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">User Name</div>
                        <div className="text-xs text-slate-500 truncate">Student</div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const DashboardView = ({ questions, userStats, setActiveTab, onOpenProblem }) => {
    return (
        <div className="ml-64 p-8">
            {/* Topbar */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-64 transition-all"
                        />
                    </div>
                    <button className="relative text-slate-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950"></span>
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label="Problems Solved"
                    value="3/12"
                    subtext="Problems Solved"
                    icon={<Code2 size={24} className="text-indigo-400" />}
                    progress={25}
                    color="indigo"
                />
                <StatCard
                    label="Success Rate"
                    value="25%"
                    subtext="Success Rate"
                    icon={<CheckCircle size={24} className="text-emerald-400" />}
                    progress={25}
                    color="emerald"
                />
                <StatCard
                    label="Global Ranking"
                    value="#1,247"
                    subtext="Ranking"
                    icon={<LayoutDashboard size={24} className="text-amber-400" />}
                    progress={75}
                    color="amber"
                />
                <StatCard
                    label="Weekly Streak"
                    value="7 days"
                    subtext="Weekly Streak"
                    icon={<LayoutDashboard size={24} className="text-purple-400" />}
                    progress={100}
                    color="purple"
                />
            </div>

            {/* Recent Problems Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Problems</h2>
                    <button
                        onClick={() => setActiveTab('problems')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {questions.slice(0, 4).map((q, idx) => (
                        <div
                            key={q.id}
                            onClick={() => onOpenProblem && onOpenProblem(q)}
                            className="group flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                    {idx === 0 ? <CheckCircle size={20} /> : <FileCode size={20} />}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{q.id}. {q.title}</div>
                                    <div className="text-xs text-slate-500">2 days ago</div>
                                </div>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                {q.difficulty}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProblemsView = ({ questions, onOpenProblem }) => {
    const [filter, setFilter] = React.useState('All');

    const filteredQuestions = questions.filter(q => {
        if (filter === 'All') return true;
        return q.difficulty === filter;
    });

    // Helper to get color for the underline
    const getUnderlineColor = () => {
        switch (filter) {
            case 'Easy': return 'bg-emerald-500';
            case 'Medium': return 'bg-amber-500';
            case 'Hard': return 'bg-red-500';
            default: return 'bg-indigo-500';
        }
    };

    return (
        <div className="ml-64 p-8">
            <header className="mb-10">
                <div className="inline-block relative mb-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Available Problems</h1>
                    <motion.div
                        layoutId="underline"
                        className={`h-1 rounded-full mt-1 ${getUnderlineColor()}`}
                        initial={false}
                        animate={{
                            width: filter === 'All' ? '40%' : '100%',
                            backgroundColor: filter === 'Easy' ? '#10b981' : filter === 'Medium' ? '#f59e0b' : filter === 'Hard' ? '#ef4444' : '#6366f1'
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === f
                                ? f === 'Easy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : f === 'Medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                        : f === 'Hard' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                            : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="divide-y divide-slate-800">
                    {filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            onClick={() => onOpenProblem && onOpenProblem(q)}
                            className="group flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    {/* Mock status check logic - assuming 'Two Sum' is solved for demo */}
                                    {q.title === 'Two Sum' ? <CheckCircle size={18} className="text-emerald-500" /> : <FileCode size={18} />}
                                </div>
                                <span className="text-slate-500 font-mono text-sm w-6">
                                    {q.id}.
                                </span>
                                <span className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                                    {q.title}
                                </span>
                            </div>

                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {q.difficulty}
                            </span>
                        </div>
                    ))}
                </div>
                {filteredQuestions.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No problems found directly matching this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

const StudentDashboard = ({ questions, userStats, onOpenProblem }) => {
    const [activeTab, setActiveTab] = React.useState('dashboard');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'dashboard' && <DashboardView questions={questions} userStats={userStats} setActiveTab={setActiveTab} onOpenProblem={onOpenProblem} />}
            {activeTab === 'problems' && <ProblemsView questions={questions} onOpenProblem={onOpenProblem} />}
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon, progress, color }) => {
    // Color mapping for dynamic styles
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500',
        emerald: 'text-emerald-400 bg-emerald-500',
        amber: 'text-amber-400 bg-amber-500',
        purple: 'text-purple-400 bg-purple-500',
    };

    const strokeColor = {
        indigo: '#818cf8',
        emerald: '#34d399',
        amber: '#fbbf24',
        purple: '#c084fc',
    }[color];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Circular Progress (Simplified SVG) */}
            <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                        className="text-slate-800"
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    />
                    {/* Progress Circle */}
                    <path
                        className={colors[color]?.split(' ')[0]} // Use text color class
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Icon in Center */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/50 m-2`}>
                    {icon}
                </div>
            </div>

            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{subtext}</div>
        </motion.div>
    );
};

export default StudentDashboard;
