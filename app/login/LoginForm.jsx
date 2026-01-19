'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User } from 'lucide-react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        console.log("Odesílám přihlášení pro:", username);

        try {
            // Volání signIn pro Auth.js v5
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            console.log("Odezva ze serveru:", res);

            if (res?.error) {
                // Pokud Auth.js vrátí chybu (např. 'CredentialsSignin')
                setError('PŘÍSTUP ODMÍTNUT - NEPLATNÉ ÚDAJE');
                setLoading(false);
            } else if (res?.ok) {
                // Přihlášení proběhlo v pořádku
                console.log("Přihlášení úspěšné, přesměrovávám...");
                router.push('/monitoring');
                router.refresh();
            }
        } catch (err) {
            console.error("Chyba při volání signIn:", err);
            setError('SYSTÉMOVÁ CHYBA KOMUNIKACE');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-112.5 bg-[#111c2a]/80 backdrop-blur-md border border-blue-500/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(59,130,246,0.15)] text-center transition-all">
            
            {/* LOGO SHIELD */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-blue-500/40 rounded-full"></div>
                    <div className="relative bg-[#060b13] border-2 border-blue-400 p-4 rounded-2xl shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                        <ShieldCheck size={42} className="text-blue-400" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            {/* TITULKY */}
            <h1 className="text-white text-3xl font-bold tracking-[0.3em] uppercase mb-1">
                SENTINEL
            </h1>
            <p className="text-blue-400 text-[10px] font-semibold tracking-[0.4em] mb-8 uppercase opacity-80">
                KÚOL IT DASHBOARD
            </p>

            <h2 className="text-white text-lg font-medium mb-8">
                Interní Portál - Přihlášení
            </h2>

            {/* FORMULÁŘ */}
            <form onSubmit={handleLogin} className="space-y-5 text-left">
                <div className="relative">
                    <User className="absolute left-3 top-3 text-blue-500/50" size={18} />
                    <input 
                        type="text" 
                        placeholder="Uživatelské jméno" 
                        className="w-full bg-[#060b13] border border-blue-500/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-blue-500/50" size={18} />
                    <input 
                        type="password" 
                        placeholder="Heslo" 
                        className="w-full bg-[#060b13] border border-blue-500/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-[10px] font-bold tracking-widest text-center animate-pulse uppercase">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.97] shadow-lg shadow-blue-900/20 uppercase tracking-widest text-sm mt-4"
                >
                    {loading ? 'Ověřování...' : 'Vstoupit do systému'}
                </button>
            </form>

            {/* PATIČKA */}
            <div className="mt-10 pt-6 border-t border-slate-700/30">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                    <ShieldCheck size={14} className="text-blue-500/40" />
                    <span>Zabezpečeno IT KÚOL</span>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;