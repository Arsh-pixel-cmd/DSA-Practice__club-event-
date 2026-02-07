import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Logo = ({ size = 'medium' }) => {
    // Size variants
    const sizes = {
        small: {
            container: 'w-8 h-8 rounded-lg',
            icon: 16,
            text: 'text-lg',
        },
        medium: {
            container: 'w-10 h-10 rounded-xl',
            icon: 20,
            text: 'text-xl',
        },
        large: {
            container: 'w-12 h-12 rounded-2xl',
            icon: 24,
            text: 'text-2xl',
        }
    };

    const { container, icon, text } = sizes[size];

    return (
        <div className="flex items-center gap-3 select-none">
            <div className={`${container} bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                <ShieldAlert size={icon} className="text-white" fill="currentColor" fillOpacity={0.2} />
            </div>
            <div className={`font-bold ${text} tracking-tight text-white`}>
                PROCTORED<span className="text-indigo-400">.IO</span>
            </div>
        </div>
    );
};

export default Logo;
