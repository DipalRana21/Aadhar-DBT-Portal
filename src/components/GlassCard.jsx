import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function GlassCard({ className = '', children }) {
    return (
        <div
            className={twMerge(
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl',
                'transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl',
                className
            )}
        >
            {children}
        </div>
    );
}


