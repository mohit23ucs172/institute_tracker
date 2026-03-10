import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">
      
      {/* --- STYLISH MOVEMENT PARTICLES (Background) --- */}
      <div className="absolute inset-0 z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/10 blur-3xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50"
      >
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-4">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Institute Login
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Secure Document Access
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-red-50 text-red-600 text-[10px] font-black uppercase p-4 rounded-2xl mb-6 text-center border border-red-100"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="mohit@nita.ac.in"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 mt-6 disabled:opacity-50"
            >
              {isSubmitting ? "Authenticating..." : "Authorize Entry"}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}