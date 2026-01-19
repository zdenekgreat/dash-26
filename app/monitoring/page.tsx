'use client';

import { useEffect, useState } from 'react';
import { 
  Globe, 
  Activity, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  CreditCard 
} from 'lucide-react';

interface DomainStatus {
  name: string;
  url: string;
  status: string;
  latency: number;
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
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh každých 30s
    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number | null) => {
    if (days === null) return "text-slate-500";
    return days < 14 ? "text-red-400" : days < 60 ? "text-orange-400" : "text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* HLAVIČKA */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoring domén</h2>
          {/* ZDE BYLA CHYBA - OPRAVENO NA JEDNU BARVU */}
          <p className="text-blue-400 text-sm mt-1">Status služeb a platnost licencí</p>
        </div>
        <div className="flex gap-2">
           <button onClick={fetchData} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white transition border border-slate-700">
             <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {/* KPI KARTY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div><p className="text-slate-400 text-sm font-medium">Monitorováno</p><p className="text-3xl font-bold text-white mt-2">{data.length}</p></div>
          <div className="p-3 bg-blue-500/10 rounded-lg"><Globe className="text-blue-400" size={28} /></div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div><p className="text-slate-400 text-sm font-medium">Uptime systému</p><p className="text-3xl font-bold text-green-400 mt-2">100%</p></div>
          <div className="p-3 bg-green-500/10 rounded-lg"><ShieldCheck className="text-green-400" size={28} /></div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div><p className="text-slate-400 text-sm font-medium">Prům. odezva</p><p className="text-3xl font-bold text-white mt-2">{data.length > 0 ? Math.round(data.reduce((a, b) => a + b.latency, 0) / data.length) : 0} ms</p></div>
          <div className="p-3 bg-purple-500/10 rounded-lg"><Activity className="text-purple-400" size={28} /></div>
        </div>
      </div>

      {/* TABULKA */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Služba / URL</th>
                <th className="p-4 font-semibold">Stav</th>
                <th className="p-4 font-semibold">Platnost (Expirace)</th>
                <th className="p-4 font-semibold">Odezva</th>
                <th className="p-4 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.map((item) => {
                const dSSL = getDaysRemaining(item.cert_expiry);
                const dDom = getDaysRemaining(item.domain_expiry);
                return (
                  <tr key={item.url} className="hover:bg-slate-800/50 transition border-slate-700/50">
                    <td className="p-4">
                      <div className="text-white font-bold text-lg">{item.name}</div>
                      <div className="text-blue-400 text-xs opacity-60 font-mono">{item.url}</div>
                    </td>
                    <td className="p-4">
                      {item.status === 'online' ? 
                        <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-xs font-medium w-fit border border-green-500/20"><CheckCircle size={14}/> Online</span> :
                        <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium w-fit border border-red-500/20"><XCircle size={14}/> Offline</span>
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        {item.domain_expiry && (
                          <div className={`flex items-center gap-2 text-sm font-bold ${getStatusColor(dDom)}`}>
                            <CreditCard size={14}/> Doména: {dDom} dní
                          </div>
                        )}
                        {item.cert_expiry && (
                          <div className={`flex items-center gap-2 text-xs font-medium ${getStatusColor(dSSL)}`}>
                            <Lock size={12}/> SSL: {dSSL} dní
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white font-mono text-sm">{item.latency} ms</td>
                    <td className="p-4 text-right">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors p-2 inline-block">
                        <ExternalLink size={18}/>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}