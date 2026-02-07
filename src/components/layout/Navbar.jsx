import React from 'react';
import { Globe, Settings } from 'lucide-react';
import Logo from '../common/Logo';

const Navbar = ({ view, setView }) => {
    return (
        <nav className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div className="cursor-pointer" onClick={() => setView('landing')}>
                <Logo size="medium" />
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
