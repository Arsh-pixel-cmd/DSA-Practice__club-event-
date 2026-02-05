import { useState, useEffect, useCallback } from 'react';

export function useAntiCheat(isExamStarted, onViolation) {
    const [warnings, setWarnings] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const requestFullscreen = useCallback(() => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(() => { });
        }
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (isExamStarted && document.visibilityState === 'hidden') {
                setWarnings(prev => {
                    const next = prev + 1;
                    // Notify parent component if violation limit reached, but manage state locally too
                    if (next >= 3) {
                        onViolation && onViolation();
                    }
                    return next;
                });
            }
        };

        const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFSChange);
        };
    }, [isExamStarted, onViolation]);

    return {
        warnings,
        setWarnings,
        isFullscreen,
        requestFullscreen
    };
}
