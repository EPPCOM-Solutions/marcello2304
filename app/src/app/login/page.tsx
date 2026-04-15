"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/';
        } else {
          setError(data.error || 'Login fehlgeschlagen');
        }
      } else {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setMsg(data.message || 'Passwort wurde versendet.');
          setMode('login');
        } else {
          setError(data.error || 'Fehler beim Senden.');
        }
      }
    } catch (err) {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-stone-950 to-stone-950 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-stone-900/50 to-transparent pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-10">
           <img src="https://www.eppcom.de/assets/images/Logo.webp" alt="EPPCOM" className="h-20 object-contain drop-shadow-2xl mb-4" />
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 tracking-tight leading-none text-center">
             LivingMatch
           </h1>
           <p className="text-stone-400 text-sm mt-3 flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-orange-500" /> Geschützter Bereich
           </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 shadow-2xl">
           <h2 className="text-xl font-bold text-white mb-6">
             {mode === 'login' ? 'Login' : 'Passwort zurücksetzen'}
           </h2>

           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
               {error}
             </div>
           )}
           {msg && (
             <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-xl mb-4">
               {msg}
             </div>
           )}

           <div className="space-y-4">
             <div className="relative">
               <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-500" />
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 className="w-full bg-stone-950 border border-stone-800 focus:border-orange-500 rounded-xl p-3.5 pl-11 text-white outline-none transition-all"
                 placeholder="E-Mail Adresse"
               />
             </div>
             
             {mode === 'login' && (
               <div className="relative">
                 <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-500" />
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-stone-950 border border-stone-800 focus:border-orange-500 rounded-xl p-3.5 pl-11 text-white outline-none transition-all"
                   placeholder="Passwort"
                 />
               </div>
             )}
           </div>

           {mode === 'login' && (
             <div className="mt-4 text-right">
               <button 
                 type="button" 
                 onClick={() => { setMode('forgot'); setError(''); setMsg(''); }}
                 className="text-xs text-stone-400 hover:text-orange-400 transition-colors"
               >
                 Passwort vergessen?
               </button>
             </div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             className="w-full mt-6 bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold p-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
           >
             {loading ? 'Lade...' : (mode === 'login' ? 'Anmelden' : 'Neues Passwort anfordern')}
             {!loading && mode === 'login' && <ArrowRight className="w-5 h-5" />}
           </button>

           {mode === 'forgot' && (
             <button 
               type="button" 
               onClick={() => { setMode('login'); setError(''); setMsg(''); }}
               className="w-full mt-4 text-sm text-stone-400 hover:text-white transition-colors"
             >
               Zurück zum Login
             </button>
           )}
        </form>
      </div>
    </div>
  );
}
