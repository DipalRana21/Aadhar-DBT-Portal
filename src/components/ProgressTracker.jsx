import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressTracker({ percentage = 0 }) {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(percentage, 0), 100);
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex items-center space-x-4">
            <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} stroke="white" strokeOpacity="0.2" strokeWidth="12" fill="none" />
                    <motion.circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#34d399"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-xl">
                    {progress}%
                </div>
            </div>
        </div>
    );
}


