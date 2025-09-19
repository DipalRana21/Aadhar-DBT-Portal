// src/pages/Videos.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

// --- Reusable Video Card Component ---
const VideoCard = ({ video }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
        <Link to={`/videos/${video.id}`}>
            <div className="relative">
                <video
                    className="w-full aspect-video object-cover bg-black"
                    src={video.publicUrl}
                    muted
                    playsInline
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{video.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{video.description}</p>
            </div>
        </Link>
    </motion.div>
);

// --- Skeleton Loader for Video Grid ---
const VideosSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
                <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
        ))}
    </div>
);

export default function Videos({ session, onLogout }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data, error: dbError } = await supabase.from('videos').select('*');
                if (dbError) throw dbError;
                const withUrls = data.map((video) => {
                    const { data: { publicUrl } } = supabase.storage.from('educational-videos').getPublicUrl(video.video_path);
                    return { ...video, publicUrl };
                });
                setVideos(withUrls);
            } catch (err) {
                setError('Failed to fetch videos. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    return (
        <AnimatedBackground>
            <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">All Videos</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Browse our library of educational content.</p>
                </div>
                
                {loading && <VideosSkeleton />}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </main>
        </AnimatedBackground>
    );
}