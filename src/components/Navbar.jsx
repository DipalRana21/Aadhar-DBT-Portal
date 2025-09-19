import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onLogout, userEmail }) {
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="w-full">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                <Link to="/" className="font-extrabold text-xl tracking-wide">
                    Student Awareness
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <button onClick={toggleTheme} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>
                    <Link to="/overview" className="hover:opacity-90">Overview</Link>
                    <Link to="/videos" className="hover:opacity-90">Videos</Link>
                    <Link to="/quiz" className="hover:opacity-90">Quiz</Link>
                    {userEmail && <span className="text-gray-600 dark:text-gray-300 text-sm">{userEmail}</span>}
                    {onLogout && (
                        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Logout
                        </button>
                    )}
                </div>

                <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
                    {open ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden mx-4 overflow-hidden"
                    >
                        <div className="flex flex-col space-y-3 rounded-xl p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                            <button onClick={() => { toggleTheme(); setOpen(false); }} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-left">
                                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                            </button>
                            <Link to="/overview" onClick={() => setOpen(false)} className="hover:opacity-90">Overview</Link>
                            <Link to="/videos" onClick={() => setOpen(false)} className="hover:opacity-90">Videos</Link>
                            <Link to="/quiz" onClick={() => setOpen(false)} className="hover:opacity-90">Quiz</Link>
                            {onLogout && (
                                <button onClick={() => { setOpen(false); onLogout(); }} className="bg-red-500 text-white px-4 py-2 rounded-lg text-left">
                                    Logout
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}


