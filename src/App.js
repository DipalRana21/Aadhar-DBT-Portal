import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Videos from './pages/Videos';
import VideoDetail from './pages/VideoDetail';
import QuizPage from './pages/Quiz';

// 1. Import the single supabase instance
import { supabase } from './supabaseClient'; 

// --- Reusable Icon Components (No changes needed here) ---
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FlashcardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const QuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


// --- Main App Component ---
export default function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. We removed the old useEffect that initialized the client.
    // This one useEffect now handles all auth logic.
    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for changes in authentication state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Cleanup subscription on unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []); // This effect runs only once

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-xl font-semibold">Loading...</div></div>;
    }

    // 3. We no longer need to pass supabaseClient or a complex onLogout function
    return (
        <Router>
            <AnimatedRoutes session={session} />
        </Router>
    );
}

// 4. Simplified the props here
function AnimatedRoutes({ session }) {
    const location = useLocation();
    
    // A simplified logout handler
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Updated route logic for clarity */}
                <Route path="/" element={!session ? <PageTransition><Home /></PageTransition> : <Navigate to="/overview" replace />} />
                <Route path="/overview" element={session ? <PageTransition><Overview session={session} onLogout={handleLogout} /></PageTransition> : <Navigate to="/" replace />} />
                <Route path="/videos" element={session ? <PageTransition><Videos session={session} onLogout={handleLogout} /></PageTransition> : <Navigate to="/" replace />} />
                <Route path="/videos/:id" element={session ? <PageTransition><VideoDetail session={session} onLogout={handleLogout} /></PageTransition> : <Navigate to="/" replace />} />
                <Route path="/quiz" element={session ? <PageTransition><QuizPage session={session} onLogout={handleLogout} /></PageTransition> : <Navigate to="/" replace />} />
                {/* A fallback route for any other path */}
                <Route path="*" element={<Navigate to={session ? '/overview' : '/'} replace />} />
            </Routes>
        </AnimatePresence>
    );
}


function PageTransition({ children }) {
    // Note: Any child component needing supabase can now simply import it:
    // import { supabase } from '../supabaseClient';
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {children}
        </motion.div>
    );
}