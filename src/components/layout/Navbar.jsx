import React from 'react';
import { ShieldAlert, Globe, Settings } from 'lucide-react';

const Navbar = ({ view, setView }) => {
    return (
        <nav className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <ShieldAlert size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        PROCTORED.<span className="text-indigo-400">IO</span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setView(view === 'admin' ? 'landing' : 'admin')}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                    {view === 'admin' ? <Globe size={16} /> : <Settings size={16} />}
                    {view === 'admin' ? 'Public View' : 'Admin Panel'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
