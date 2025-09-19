// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import AnimatedBackground from '../components/AnimatedBackground';
// import GlassCard from '../components/GlassCard';
// import Navbar from '../components/Navbar';

// // 1. Import supabase directly from the client file.
// //    (Adjust the path '../' if your file structure is different)
// import { supabase } from '../supabaseClient';

// // 2. Remove the { supabaseClient } prop. It's no longer needed.
// export default function Home() {
//     return (
//         <AnimatedBackground>
//             <Navbar />
//             <main className="container mx-auto px-4 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
//                     <GlassCard className="p-6 lg:p-8">
//                         {/* 3. No need to pass the prop down anymore */}
//                         <AuthPanel />
//                     </GlassCard>
//                     <GlassCard className="p-6 lg:p-8">
//                         <Infographic />
//                     </GlassCard>
//                 </div>
//             </main>
//         </AnimatedBackground>
//     );
// }

// // 4. Also remove the { supabaseClient } prop from here.
// function AuthPanel() {
//     const [isLogin, setIsLogin] = useState(true);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');

//     const handleAuthAction = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setMessage('');

//         // 5. Use the imported 'supabase' object directly instead of the old prop.
//         //    I've updated every instance of 'supabaseClient' to 'supabase'.
//         if (!supabase) {
//             setError('Supabase client is not initialized.');
//             setLoading(false);
//             return;
//         }

//         try {
//             let response;
//             if (isLogin) {
//                 response = await supabase.auth.signInWithPassword({ email, password });
//             } else {
//                 response = await supabase.auth.signUp({ email, password });
//                 if (!response.error) {
//                     setMessage('Success! Please check your email for a verification link.');
//                 }
//             }
//             if (response.error) throw response.error;
            
//             // Note: A hard redirect like this can be slow. 
//             // The onAuthStateChange listener in App.js will handle the redirect automatically.
//             // You might not even need this line.
//             if (isLogin && !response.error) {
//                  window.location.href = '/overview';
//             }
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-white mb-2">
//                 {isLogin ? 'Welcome Back!' : 'Create Account'}
//             </motion.h2>
//             <p className="text-white/80 mb-6">{isLogin ? 'Sign in to access your dashboard.' : 'Get started with your learning journey.'}</p>

//             <form onSubmit={handleAuthAction} className="space-y-4">
//                 <div>
//                     <label className="block text-white/90 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
//                     <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-3 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-400/40"
//                         placeholder="you@example.com" required />
//                 </div>
//                 <div>
//                     <label className="block text-white/90 text-sm font-semibold mb-2" htmlFor="password">Password</label>
//                     <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-3 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400/40"
//                         placeholder="••••••••" required />
//                 </div>
//                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !supabase}
//                     className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-black/10 disabled:opacity-70">
//                     {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
//                 </motion.button>
//             </form>

//             {error && <p className="mt-4 text-sm text-red-100 bg-red-500/30 p-3 rounded-lg">{error}</p>}
//             {message && <p className="mt-4 text-sm text-green-100 bg-emerald-500/30 p-3 rounded-lg">{message}</p>}

//             <p className="text-center text-sm text-white/80 mt-6">
//                 {isLogin ? "Don't have an account?" : "Already have an account?"}
//                 <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-white hover:underline ml-1">
//                     {isLogin ? 'Sign Up' : 'Sign In'}
//                 </button>
//             </p>
//         </div>
//     );
// }

// // No changes needed for Infographic
// function Infographic() {
//     const points = [
//         { title: 'Aadhaar Linked Account', description: 'Your Aadhaar is connected to your bank account for identity verification (eKYC).', color: 'from-blue-500 to-indigo-500' },
//         { title: 'DBT-Enabled Account', description: 'Account seeded to NPCI mapper to receive Direct Benefit Transfers.', color: 'from-emerald-500 to-teal-500' }
//     ];

//     return (
//         <div className="h-full flex flex-col justify-center">
//             <h2 className="text-4xl font-extrabold text-white mb-4">Aadhaar-Linked vs. DBT-Enabled</h2>
//             <p className="text-white/90 text-lg mb-8">Know the difference to receive scholarships and benefits smoothly.</p>
//             <div className="space-y-6">
//                 {points.map((point) => (
//                     <motion.div key={point.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
//                         className="p-6 rounded-2xl bg-white/10 border border-white/20 text-white">
//                         <div className={`inline-flex items-center mb-3 px-3 py-1 rounded-full text-sm bg-gradient-to-r ${point.color} text-white shadow`}>{point.title}</div>
//                         <p className="text-white/90">{point.description}</p>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';

export default function Home() {
    return (
        <AnimatedBackground>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <GlassCard className="p-6 lg:p-8">
                        <AuthPanel />
                    </GlassCard>
                    <GlassCard className="p-6 lg:p-8">
                        <Infographic />
                    </GlassCard>
                </div>
            </main>
        </AnimatedBackground>
    );
}

function AuthPanel() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (!supabase) {
            setError('Supabase client is not initialized.');
            setLoading(false);
            return;
        }

        try {
            let response;
            if (isLogin) {
                response = await supabase.auth.signInWithPassword({ email, password });
            } else {
                response = await supabase.auth.signUp({ email, password });
                if (!response.error) {
                    setMessage('Success! Please check your email for a verification link.');
                }
            }
            if (response.error) throw response.error;
            
            if (isLogin && !response.error) {
                 window.location.href = '/overview';
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* UPDATED: Text color now adapts to light/dark mode */}
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
            </motion.h2>
            {/* UPDATED: Text color now adapts to light/dark mode */}
            <p className="text-gray-600 dark:text-white/80 mb-6">{isLogin ? 'Sign in to access your dashboard.' : 'Get started with your learning journey.'}</p>

            <form onSubmit={handleAuthAction} className="space-y-4">
                <div>
                    {/* UPDATED: Label color now adapts to light/dark mode */}
                    <label className="block text-gray-700 dark:text-white/90 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                    {/* UPDATED: Input field styling for better visibility in both modes */}
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-4 focus:ring-teal-400/40"
                        placeholder="you@example.com" required />
                </div>
                <div>
                    {/* UPDATED: Label color now adapts to light/dark mode */}
                    <label className="block text-gray-700 dark:text-white/90 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                    {/* UPDATED: Input field styling for better visibility in both modes */}
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-400/40"
                        placeholder="••••••••" required />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !supabase}
                    className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-black/10 disabled:opacity-70">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </motion.button>
            </form>

            {error && <p className="mt-4 text-sm text-red-100 bg-red-500/30 p-3 rounded-lg">{error}</p>}
            {message && <p className="mt-4 text-sm text-green-100 bg-emerald-500/30 p-3 rounded-lg">{message}</p>}

            {/* UPDATED: Text color now adapts to light/dark mode */}
            <p className="text-center text-sm text-gray-600 dark:text-white/80 mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                {/* UPDATED: Button color now adapts for better visibility */}
                <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-indigo-600 dark:text-teal-300 hover:underline ml-1">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
    );
}

function Infographic() {
    const points = [
        { title: 'Aadhaar Linked Account', description: 'Your Aadhaar is connected to your bank account for identity verification (eKYC).', color: 'from-blue-500 to-indigo-500' },
        { title: 'DBT-Enabled Account', description: 'Account seeded to NPCI mapper to receive Direct Benefit Transfers.', color: 'from-emerald-500 to-teal-500' }
    ];

    return (
        <div className="h-full flex flex-col justify-center">
            {/* UPDATED: Text color now adapts to light/dark mode */}
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Aadhaar-Linked vs. DBT-Enabled</h2>
            {/* UPDATED: Text color now adapts to light/dark mode */}
            <p className="text-gray-600 dark:text-white/90 text-lg mb-8">Know the difference to receive scholarships and benefits smoothly.</p>
            <div className="space-y-6">
                {points.map((point) => (
                    <motion.div key={point.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        // UPDATED: Styling for the info boxes to work in both modes
                        className="p-6 rounded-2xl bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white"
                    >
                        <div className={`inline-flex items-center mb-3 px-3 py-1 rounded-full text-sm bg-gradient-to-r ${point.color} text-white shadow`}>{point.title}</div>
                        {/* UPDATED: Text color now adapts to light/dark mode */}
                        <p className="text-gray-700 dark:text-white/90">{point.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}