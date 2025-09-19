// // src/pages/Overview.js

// import React, { useEffect, useMemo, useState } from 'react';
// import AnimatedBackground from '../components/AnimatedBackground';
// import GlassCard from '../components/GlassCard';
// import Navbar from '../components/Navbar';
// import { motion } from 'framer-motion';
// import Flashcard from '../components/Flashcard';
// // 1. Import supabase directly
// import { supabase } from '../supabaseClient';

// // 2. Remove `supabaseClient` from props
// export default function Overview({ session, onLogout }) {
//     const [videos, setVideos] = useState([]);
//     const [flashcards, setFlashcards] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchVideos = async () => {
//             try {
//                 // 3. Use the imported 'supabase' object
//                 const { data, error: dbError } = await supabase.from('videos').select('*');
//                 if (dbError) throw dbError;
//                 const withUrls = data.map((video) => {
//                     const { data: { publicUrl } } = supabase.storage.from('educational-videos').getPublicUrl(video.video_path);
//                     return { ...video, publicUrl };
//                 });
//                 setVideos(withUrls);
//                 // Fetch all flashcards once and group by video_id
//                 const { data: fcData } = await supabase.from('flashcards').select('*');
//                 setFlashcards(fcData || []);
//             } catch (err) { setError('Failed to fetch videos.'); }
//             finally { setLoading(false); }
//         };
//         fetchVideos();
//     }, []); // Dependency array now empty

//     const flashcardsByTitle = useMemo(() => {
//         const map = new Map();
//         for (const fc of flashcards) {
//             const key = fc.video_title || '';
//             const list = map.get(key) || [];
//             list.push(fc);
//             map.set(key, list);
//         }
//         return map;
//     }, [flashcards]);

//     return (
//         <AnimatedBackground>
//             <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
//             <main className="container mx-auto px-4 py-8 space-y-6">
//                 <h1 className="text-3xl font-extrabold">Overview</h1>
//                 <GlassCard className="p-4 sm:p-6 space-y-10">
//                     {loading && <p>Loading...</p>}
//                     {error && <p className="text-red-600 dark:text-red-300">{error}</p>}
//                     {!loading && !error && videos.map((video) => (
//                         <div key={video.id} className="space-y-4">
//                             <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-bold">{video.title}</motion.h2>
//                             <p className="opacity-80">{video.description}</p>
//                             {flashcardsByTitle.get(video.title)?.length ? (
//                                 <div className="space-y-4">
//                                     <h3 className="text-lg font-semibold">Flashcards</h3>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {flashcardsByTitle.get(video.title).slice(0, 3).map((fc) => (
//                                             <div key={fc.id}>
//                                                 <Flashcard question={fc.question} answer={fc.answer} variant="grid" />
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div className="text-sm">
//                                         <a href={`/videos/${video.id}`} className="underline">Get more info →</a>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="text-sm opacity-70">No flashcards available for this video yet.</div>
//                             )}
//                         </div>
//                     ))}
//                 </GlassCard>
//             </main>
//         </AnimatedBackground>
//     );
// }

// src/pages/Overview.js

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import { supabase } from '../supabaseClient';

// --- Reusable Icon for the Button ---
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

// --- Enhanced Call-to-Action Button ---
function ViewTopicButton({ videoId }) {
    return (
        <Link to={`/videos/${videoId}`} className="group inline-flex items-center justify-center px-5 py-3 mt-4 font-semibold text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View Topic
            <ArrowRightIcon />
        </Link>
    );
}

// --- Skeleton Loader for a Better Loading Experience ---
function SkeletonLoader() {
    return (
        <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
                <GlassCard key={i} className="p-6 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-gray-300 dark:bg-gray-700 rounded-lg aspect-video"></div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-40 mt-4"></div>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}

export default function Overview({ session, onLogout }) {
    const [videos, setVideos] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const { data: videoData, error: videoError } = await supabase.from('videos').select('*');
                if (videoError) throw videoError;

                const videosWithUrls = videoData.map((video) => {
                    const { data: { publicUrl } } = supabase.storage.from('educational-videos').getPublicUrl(video.video_path);
                    return { ...video, publicUrl };
                });
                setVideos(videosWithUrls);

                const { data: fcData } = await supabase.from('flashcards').select('*');
                setFlashcards(fcData || []);
            } catch (err) {
                setError('Failed to fetch page content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const flashcardsByTitle = useMemo(() => {
        const map = new Map();
        for (const fc of flashcards) {
            const key = fc.video_title || '';
            const list = map.get(key) || [];
            list.push(fc);
            map.set(key, list);
        }
        return map;
    }, [flashcards]);

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <AnimatedBackground>
            <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
            <main className="container mx-auto px-4 py-8">
                {/* --- Enhanced Page Header --- */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Course Overview</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Explore the topics below to understand Aadhaar and Direct Benefit Transfers.
                    </p>
                </div>

                {loading && <SkeletonLoader />}
                {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
                
                <motion.div
                    className="space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {!loading && !error && videos.map((video) => (
                        <motion.div key={video.id} variants={itemVariants}>
                            <GlassCard className="p-6 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    {/* --- Video Preview Column --- */}
                                    <div className="md:col-span-1">
                                        <video
                                            src={video.publicUrl}
                                            muted
                                            playsInline
                                            className="w-full aspect-video rounded-lg object-cover bg-gray-200 dark:bg-gray-800"
                                        />
                                    </div>
                                    
                                    {/* --- Content Column --- */}
                                    <div className="md:col-span-2">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h2>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">{video.description}</p>
                                        
                                        {flashcardsByTitle.get(video.title)?.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Key Flashcards</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {flashcardsByTitle.get(video.title).slice(0, 3).map((fc) => (
                                                        <Flashcard key={fc.id} question={fc.question} answer={fc.answer} variant="grid" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <ViewTopicButton videoId={video.id} />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </AnimatedBackground>
    );
}