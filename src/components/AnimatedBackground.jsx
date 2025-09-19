import React from 'react';

export default function AnimatedBackground({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}


