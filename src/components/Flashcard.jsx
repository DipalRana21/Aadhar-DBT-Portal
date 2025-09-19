import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ question, answer, variant = 'default' }) {
    const [flipped, setFlipped] = useState(false);

    let wrapperClass = 'w-full max-w-2xl h-80 perspective-1000 mx-auto';
    let frontTextClass = 'text-2xl';
    let backTextClass = 'text-lg';
    if (variant === 'compact') {
        wrapperClass = 'w-[22rem] h-64 perspective-1000';
        frontTextClass = 'text-xl';
        backTextClass = 'text-base';
    } else if (variant === 'grid') {
        wrapperClass = 'w-full h-72 perspective-1000';
        frontTextClass = 'text-xl';
        backTextClass = 'text-base';
    }

    return (
        <div className={wrapperClass}>
            <motion.div
                className={`relative w-full h-full transform-style-3d cursor-pointer`}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => setFlipped(!flipped)}
            >
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 rounded-2xl shadow-xl border bg-gradient-to-br from-blue-700 to-blue-400 text-white border-blue-500 dark:bg-none dark:bg-blue-900/40 dark:text-white dark:border-blue-700">
                    <p className={`${frontTextClass} font-semibold text-center`}>{question}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 rounded-2xl shadow-xl border bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 border-blue-300 dark:bg-none dark:bg-blue-900/40 dark:text-gray-100 dark:border-blue-700">
                    <p className={`${backTextClass} text-center`}>{answer}</p>
                </div>
            </motion.div>
        </div>
    );
}


