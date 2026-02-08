import React from 'react';
import { Globe, Settings, LogOut, Code2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const Navbar = ({ isAuthenticated, onLogout, isAdmin }) => {
    const location = useLocation();

    // Don't show navbar on login page
    if (location.pathname === '/login') return null;

    return (
        <nav className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <Link to="/" className="cursor-pointer">
                <Logo size="medium" />
            </Link>

            <div className="flex items-center gap-6">
                {(isAuthenticated || isAdmin) && (
                    <>
                        {isAdmin && (
                            <Link
                                to={location.pathname === '/admin' ? "/" : "/admin"}
                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                            >
                                {location.pathname === '/admin' ? <Globe size={16} /> : <Settings size={16} />}
                                {location.pathname === '/admin' ? 'Public View' : 'Admin Panel'}
                            </Link>
                        )}

                        <div className="h-4 w-px bg-slate-800" />

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-xs font-bold text-red-500/80 hover:text-red-400 transition-colors uppercase tracking-widest"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
