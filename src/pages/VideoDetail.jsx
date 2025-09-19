// src/pages/VideoDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import { supabase } from '../supabaseClient';
// UPDATED: Added AnimatePresence to the import
import { motion, AnimatePresence } from 'framer-motion';

// --- Skeleton Loader for this page ---
const VideoDetailSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
        <div className="lg:col-span-1 h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    </div>
);

export default function VideoDetail({ session, onLogout }) {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data, error: dbError } = await supabase.from('videos').select('*').eq('id', id).single();
                if (dbError) throw dbError;
                
                const { data: { publicUrl } } = supabase.storage.from('educational-videos').getPublicUrl(data.video_path);
                setVideo({ ...data, publicUrl });

                const { data: fcData, error: fcErr } = await supabase.from('flashcards').select('*').eq('video_title', data.title);
                if (fcErr) throw fcErr;
                setFlashcards(fcData || []);
            } catch (err) {
                setError('Failed to load video content.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePrev = () => setCurrentIndex((p) => (p - 1 + flashcards.length) % flashcards.length);
    const handleNext = () => setCurrentIndex((p) => (p + 1) % flashcards.length);

    return (
        <AnimatedBackground>
            <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/overview" className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Overview
                    </Link>
                </div>

                {loading && <VideoDetailSkeleton />}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && video && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- Main Video Content --- */}
                        <div className="lg:col-span-2">
                            <GlassCard className="p-6">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{video.title}</h1>
                                    <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                                        <video key={video.id} controls className="w-full h-full bg-black">
                                            <source src={video.publicUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 pt-2">{video.description}</p>
                                </motion.div>
                            </GlassCard>
                        </div>

                        {/* --- Flashcards Sidebar --- */}
                        <div className="lg:col-span-1">
                            {flashcards.length > 0 && (
                                <GlassCard className="p-6 sticky top-24">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Flashcards</h2>
                                        <AnimatePresence mode="wait">
                                            <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                                <Flashcard question={flashcards[currentIndex].question} answer={flashcards[currentIndex].answer} />
                                            </motion.div>
                                        </AnimatePresence>
                                        <div className="flex items-center justify-between mt-4">
                                            <button onClick={handlePrev} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Card {currentIndex + 1} of {flashcards.length}</p>
                                            <button onClick={handleNext} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                </GlassCard>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </AnimatedBackground>
    );
}