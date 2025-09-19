// src/pages/QuizPage.js

import React, { useEffect, useState } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
// 1. Import supabase directly
import { supabase } from '../supabaseClient';

// 2. Remove `supabaseClient` from props
export default function QuizPage({ session, onLogout }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // 3. Use the imported 'supabase' object
                const { data, error } = await supabase.from('quizzes').select('*');
                if (error) throw error;
                setQuestions(data);
            } catch (err) { setError('Failed to fetch quiz questions.'); }
            finally { setLoading(false); }
        };
        fetchQuiz();
    }, []); // Dependency array now empty

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
        else setShowResults(true);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
    };

    return (
        <AnimatedBackground>
            <Navbar onLogout={onLogout} userEmail={session?.user?.email} />
            <main className="container mx-auto px-4 py-8 space-y-6">
                <h1 className="text-3xl font-extrabold">Quiz</h1>
                <GlassCard className="p-4 sm:p-6">
                    {loading && <p>Loading quiz...</p>}
                    {error && <p className="text-red-600 dark:text-red-300">{error}</p>}
                    {!loading && !error && questions.length === 0 && <p>No quiz questions available.</p>}
                    {!loading && !error && questions.length > 0 && (
                        showResults ? <Results questions={questions} selectedAnswers={selectedAnswers} onRetry={resetQuiz} /> : (
                            <Question
                                question={questions[currentQuestionIndex]}
                                index={currentQuestionIndex}
                                total={questions.length}
                                selected={selectedAnswers[currentQuestionIndex]}
                                onSelect={handleAnswerSelect}
                                onNext={handleNextQuestion}
                            />
                        )
                    )}
                </GlassCard>
            </main>
        </AnimatedBackground>
    );
}

function Question({ question, index, total, selected, onSelect, onNext }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Knowledge Check</h2>
            <p className="opacity-80 mb-6">Question {index + 1} of {total}</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xl font-semibold">{question.question}</p>
            </div>
            <div className="mt-6 space-y-3">
                {question.options.map((option, i) => (
                    <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => onSelect(i)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center border ${
                            selected === i ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <span className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 ${selected === i ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 dark:border-gray-500'}`}></span>
                        {option}
                    </motion.button>
                ))}
            </div>
            <div className="mt-8 text-right">
                <motion.button whileTap={{ scale: 0.98 }} onClick={onNext} disabled={selected === undefined}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-2 px-8 rounded-lg disabled:opacity-60">
                    {index < total - 1 ? 'Next' : 'Finish'}
                </motion.button>
            </div>
        </div>
    );
}

function Results({ questions, selectedAnswers, onRetry }) {
    const score = Object.keys(selectedAnswers).reduce((acc, idx) => {
        const i = Number(idx);
        const q = questions[i];
        const sel = selectedAnswers[i];
        return acc + (q.correct_option === sel ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);
    return (
        <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-2">Your Score:</p>
            <p className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-300 mb-6">{score} / {questions.length} ({percentage}%)</p>
            <motion.button whileTap={{ scale: 0.98 }} onClick={onRetry} className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-bold py-3 px-8 rounded-lg">Try Again</motion.button>
        </div>
    );
}