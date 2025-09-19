// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import ProgressTracker from '../components/ProgressTracker';
import Confetti from 'react-confetti';
// 1. Import supabase directly
import { supabase } from '../supabaseClient';

const OverviewIcon = () => <span className="mr-2">📌</span>;
const VideoIcon = () => <span className="mr-2">🎬</span>;
const FlashcardIcon = () => <span className="mr-2">🃏</span>;
const QuizIcon = () => <span className="mr-2">❓</span>;

// 2. Remove `supabaseClient` from the props
export default function Dashboard({ session, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [quizProgress, setQuizProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (quizProgress === 100) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [quizProgress]);

    return (
        <AnimatedBackground>
            {showConfetti && <Confetti />}
            <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
            <main className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold">Dashboard</h1>
                    <ProgressTracker percentage={quizProgress} />
                </div>

                <GlassCard className="p-2">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-2">
                        <nav className="-mb-px flex space-x-6">
                            <TabButton title="Overview" icon={<OverviewIcon />} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                            <TabButton title="Videos" icon={<VideoIcon />} isActive={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
                            <TabButton title="Flashcards" icon={<FlashcardIcon />} isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} />
                            <TabButton title="Quiz" icon={<QuizIcon />} isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
                        </nav>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 sm:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {activeTab === 'overview' && <OverviewSection />}
                            {/* 3. No props are passed to these sections anymore */}
                            {activeTab === 'videos' && <VideoSection />}
                            {activeTab === 'flashcards' && <FlashcardSection />}
                            {activeTab === 'quiz' && <QuizSection onProgress={setQuizProgress} onComplete={() => setQuizProgress(100)} />}
                        </motion.div>
                    </AnimatePresence>
                </GlassCard>
            </main>
        </AnimatedBackground>
    );
}

function TabButton({ title, icon, isActive, onClick }) {
    return (
        <button onClick={onClick}
            className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                isActive ? 'border-gray-900 dark:border-gray-100' : 'border-transparent opacity-80 hover:opacity-100'
            }`}
        >
            {icon}
            {title}
        </button>
    );
}

function OverviewSection() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Aadhaar-linked vs DBT-enabled (Aadhaar-seeded bank)</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">Aadhaar-linked account</h3>
                    <p>Bank has your Aadhaar for eKYC/identity. It does not by itself make you eligible to receive government benefit transfers.</p>
                </div>
                <div>
                    <h3 className="font-semibold">DBT-enabled (Aadhaar-seeded) account</h3>
                    <p>Your bank account is mapped (seeded) to your Aadhaar in the NPCI mapper. This marks it as the destination account for Direct Benefit Transfers like scholarships or subsidies.</p>
                </div>
                <div>
                    <h3 className="font-semibold">Why it matters</h3>
                    <p>To receive DBT, your account must be both Aadhaar-linked and Aadhaar-seeded. Seeding designates which account gets the money if you have multiple accounts.</p>
                </div>
                <div className="text-sm opacity-80">Tip: Visit your bank or use their mobile/net banking to seed Aadhaar to NPCI. You can also check seeding status on UIDAI/NPCI channels.</div>
            </div>
        </div>
    );
}

function VideoSection() { // Prop removed
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Use imported 'supabase'
                const { data, error: dbError } = await supabase.from('videos').select('*');
                if (dbError) throw dbError;
                const withUrls = data.map((video) => {
                    const { data: { publicUrl } } = supabase.storage.from('educational-videos').getPublicUrl(video.video_path);
                    return { ...video, publicUrl };
                });
                setVideos(withUrls);
            } catch (err) {
                setError('Failed to fetch videos.');
            } finally { setLoading(false); }
        };
        fetchVideos();
    }, []); // Dependency array now empty

    if (loading) return <p>Loading videos...</p>;
    if (error) return <p className="text-red-600 dark:text-red-300">{error}</p>;

    return (
        <div>
            <h2 className="text-3xl font-extrabold mb-6">Educational Videos</h2>
            {videos.length === 0 ? (
                <p className="text-white/90">No videos available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <motion.div key={video.id} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <video controls className="w-full aspect-video">
                                <source src={video.publicUrl} type="video/mp4" />
                            </video>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{video.title}</h3>
                                <p className="opacity-80 text-sm">{video.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FlashcardSection() { // Prop removed
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                // Use imported 'supabase'
                const { data, error } = await supabase.from('flashcards').select('*');
                if (error) throw error;
                setFlashcards(data);
            } catch (err) { setError('Failed to fetch flashcards.'); }
            finally { setLoading(false); }
        };
        fetchFlashcards();
    }, []); // Dependency array now empty

    if (loading) return <p>Loading flashcards...</p>;
    if (error) return <p className="text-red-600 dark:text-red-300">{error}</p>;
    if (flashcards.length === 0) return <p>No flashcards found.</p>;

    const card = flashcards[currentIndex];

    return (
        <div>
            <h2 className="text-3xl font-extrabold mb-6">Interactive Flashcards</h2>
            <Flashcard question={card.question} answer={card.answer} />
            <p className="my-4 opacity-90 font-medium text-center">Card {currentIndex + 1} of {flashcards.length}</p>
            <div className="flex justify-center space-x-4">
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCurrentIndex((p) => (p - 1 + flashcards.length) % flashcards.length)} className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-bold py-2 px-6 rounded-lg">Previous</motion.button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCurrentIndex((p) => (p + 1) % flashcards.length)} className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-bold py-2 px-6 rounded-lg">Next</motion.button>
            </div>
        </div>
    );
}

function QuizSection({ onProgress, onComplete }) { // supabaseClient prop removed
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // Use imported 'supabase'
                const { data, error } = await supabase.from('quizzes').select('*');
                if (error) throw error;
                setQuestions(data);
            } catch (err) { setError('Failed to fetch quiz questions.'); }
            finally { setLoading(false); }
        };
        fetchQuiz();
    }, []); // Dependency array now empty

    useEffect(() => {
        const total = questions.length;
        const answered = Object.keys(selectedAnswers).length;
        if (total > 0) onProgress(Math.round((answered / total) * 100));
    }, [selectedAnswers, questions, onProgress]);

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: optionIndex,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
            onComplete && onComplete();
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        onProgress && onProgress(0);
    };

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p className="text-red-600 dark:text-red-300">{error}</p>;
    if (questions.length === 0) return <p>No quiz questions available.</p>;

    if (showResults) {
        const score = Object.keys(selectedAnswers).reduce((acc, index) => {
            const q = questions[index];
            const sel = selectedAnswers[index];
            return acc + (q.correct_option === sel ? 1 : 0);
        }, 0);
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-4">Quiz Completed!</h2>
                <p className="text-xl mb-2">Your Score:</p>
                <p className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-300 mb-6">{score} / {questions.length} ({percentage}%)</p>
                <motion.button whileTap={{ scale: 0.98 }} onClick={resetQuiz} className="bg-white/10 text-white font-bold py-3 px-8 rounded-lg border border-white/20">Try Again</motion.button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h2 className="text-3xl font-extrabold mb-2">Knowledge Check</h2>
            <p className="opacity-90 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xl font-semibold">{currentQuestion.question}</p>
            </div>

            <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <motion.button key={index} whileTap={{ scale: 0.98 }} onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center border ${
                            selectedAnswers[currentQuestionIndex] === index ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <span className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 ${selectedAnswers[currentQuestionIndex] === index ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 dark:border-gray-500'}`}></span>
                        {option}
                    </motion.button>
                ))}
            </div>

            <div className="mt-8 text-right">
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-2 px-8 rounded-lg disabled:opacity-60">
                    {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </motion.button>
            </div>
        </div>
    );
}