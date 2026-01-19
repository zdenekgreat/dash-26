'use client';

import { useEffect, useState } from 'react';
import { 
  Globe, 
  Activity, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  CreditCard 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface DomainStatus {
  url: string;
  status: string;
  latency: number;
  code: number;
  uptime_percent: string;
  cert_expiry: string | null;
  domain_expiry: string | null;
}

export default function MonitoringPage() {
  const [data, setData] = useState<DomainStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    // 1. Načíst hned po otevření
    fetchData();

    // 2. Nastavit interval (např. každých 30000 ms = 30 sekund)
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // 3. Úklid při odchodu ze stránky
    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = (dateString: string | null) => {
    if (!dateString) return null;
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const getStatusColor = (days: number | null) => {
    if (days === null) return "text-slate-500";
    if (days < 14) return "text-red-400";
    if (days < 60) return "text-orange-400";
    return "text-green-400";
  }

  const mockGraphData = [{ val: 40 }, { val: 30 }, { val: 45 }, { val: 50 }, { val: 48 }, { val: 60 }, { val: 55 }, { val: 70 }];

  return (
    <div className="space-y-6">
      
      {/* HLAVIČKA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoring domén</h2>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1"><span>Kompletní dohled: Uptime + SSL + Expirace domén</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition"><RefreshCw size={18} className={loading ? "animate-spin" : ""} />Obnovit</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"><Plus size={18} />Přidat</button>
        </div>
      </div>

      {/* KPI KARTY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div><p className="text-slate-400 text-sm font-medium">Monitorováno</p><p className="text-4xl font-bold text-white mt-2">{data.length}</p></div>
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400"><Globe size={24} /></div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div><p className="text-slate-400 text-sm font-medium">Status Systému</p><p className="text-4xl font-bold text-green-400 mt-2">100%</p></div>
          <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400"><ShieldCheck size={24} /></div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Prům. Odezva</p>
            <p className="text-4xl font-bold text-white mt-2">
              {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.latency, 0) / data.length) : 0} 
              <span className="text-lg text-slate-500 font-normal ml-2">ms</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400"><Activity size={24} /></div>
        </div>
      </div>

      {/* TABULKA */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Doména</th>
                <th className="p-4 font-semibold">Stav</th>
                <th className="p-4 font-semibold">Platnost (Expirace)</th>
                <th className="p-4 font-semibold">Odezva</th>
                <th className="p-4 font-semibold w-32">Trend</th>
                <th className="p-4 font-semibold text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {loading && data.length === 0 ? (<tr><td colSpan={6} className="p-8 text-center text-slate-500">Načítám...</td></tr>) : data.length === 0 ? (<tr><td colSpan={6} className="p-8 text-center text-slate-500">Žádná data. Spusťte CRON.</td></tr>) : (
                data.map((item) => {
                  const daysSSL = getDaysRemaining(item.cert_expiry);
                  const daysDom = getDaysRemaining(item.domain_expiry);

                  return (
                  <tr key={item.url} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{item.url.replace('https://', '').replace('http://', '')}</div>
                      <a href={item.url} target="_blank" className="text-xs text-blue-400 hover:underline">{item.url}</a>
                    </td>
                    <td className="p-4">
                      {item.status === 'online' ? (
                        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-2 py-1 rounded w-fit"><CheckCircle size={14} /><span className="font-medium">Online</span></div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-2 py-1 rounded w-fit"><XCircle size={14} /><span className="font-medium">Offline</span></div>
                      )}
                    </td>
                    
                    {/* DVOJITÁ EXPIRACE */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        
                        {/* 1. Řádek: DOMÉNA */}
                        {item.domain_expiry ? (
                           // ZDE JE OPRAVA: 'title' je na DIVu, ne na ikoně
                           <div title="Platnost domény (Registrátor)" className={`flex items-center gap-2 ${getStatusColor(daysDom)}`}>
                             <CreditCard size={14} />
                             <span className="font-mono font-bold">{daysDom} dní</span>
                             <span className="text-slate-500 text-xs hidden md:inline">({new Date(item.domain_expiry).toLocaleDateString('cs-CZ')})</span>
                           </div>
                        ) : (
                           <div className="text-slate-600 text-xs flex items-center gap-2"><CreditCard size={14}/> Neznámá expirace</div>
                        )}

                        {/* 2. Řádek: SSL */}
                        {item.cert_expiry ? (
                           // ZDE JE OPRAVA: 'title' je na DIVu
                           <div title="Platnost SSL certifikátu" className={`flex items-center gap-2 text-xs ${getStatusColor(daysSSL)}`}>
                             <Lock size={12} />
                             <span className="font-mono">SSL: {daysSSL} dní</span>
                           </div>
                        ) : null}

                      </div>
                    </td>

                    <td className="p-4 text-white font-mono">{item.latency} ms</td>
                    <td className="p-4">
                      <div className="h-8 w-24 opacity-50"><ResponsiveContainer width="100%" height="100%"><AreaChart data={mockGraphData}><Area type="monotone" dataKey="val" stroke={item.status === 'online' ? "#3b82f6" : "#ef4444"} fillOpacity={0} strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
                    </td>
                    <td className="p-4 text-right"><a href={item.url} target="_blank" className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white inline-block"><ExternalLink size={16}/></a></td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}