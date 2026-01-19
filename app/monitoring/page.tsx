'use client';

import { useEffect, useState } from 'react';
import { 
  Globe, 
  Activity, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  CreditCard 
} from 'lucide-react';

// DEFINICE TYPŮ
interface DomainStatus {
  name: string;
  url: string;
  status: string;
  latency: number;
  cert_expiry: string | null;
  domain_expiry: string | null;
}

interface NearestExpiry {
  name: string;
  cert_expiry?: string;
  domain_expiry?: string;
}

export default function MonitoringPage() {
  const [data, setData] = useState<DomainStatus[]>([]);
  const [nearSSL, setNearSSL] = useState<NearestExpiry | null>(null);
  const [nearDom, setNearDom] = useState<NearestExpiry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json.domains || []);
      setNearSSL(json.nearestSSL || null);
      setNearDom(json.nearestDomain || null);
    } catch (e) { 
      console.error("Chyba při načítání dat:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = (dateStr: string | undefined | null) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number | null) => {
    if (days === null) return "text-slate-500";
    if (days < 0) return "text-red-600 font-black animate-pulse";
    return days < 14 ? "text-red-400" : days < 60 ? "text-orange-400" : "text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* HLAVIČKA */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoring domén</h2>
          <p className="text-blue-400 text-sm mt-1 font-medium">Status služeb a platnost licencí</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchData} 
             className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white transition border border-slate-700 active:scale-95"
           >
             <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {/* KRITICKÉ KARTY (EXPIRACE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Karta: Nejbližší SSL - OPRAVENO NA bg-linear-to-br */}
        <div className="bg-linear-to-br from-[#1e293b] to-[#0f172a] p-5 rounded-xl border border-orange-500/30 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">Nejbližší expirace SSL</p>
              <h3 className="text-white font-bold text-xl mt-1 truncate max-w-50">{nearSSL?.name || '---'}</h3>
              <p className={`text-3xl font-black mt-2 ${getStatusColor(getDaysRemaining(nearSSL?.cert_expiry))}`}>
                {nearSSL ? `${getDaysRemaining(nearSSL.cert_expiry)} dní` : '--'}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-400"><Lock size={28} /></div>
          </div>
        </div>

        {/* Karta: Nejbližší Doména - OPRAVENO NA bg-linear-to-br */}
        <div className="bg-linear-to-br from-[#1e293b] to-[#0f172a] p-5 rounded-xl border border-red-500/30 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Nejbližší konec domény</p>
              <h3 className="text-white font-bold text-xl mt-1 truncate max-w-50">{nearDom?.name || '---'}</h3>
              <p className={`text-3xl font-black mt-2 ${getStatusColor(getDaysRemaining(nearDom?.domain_expiry))}`}>
                {nearDom ? `${getDaysRemaining(nearDom.domain_expiry)} dní` : '--'}
              </p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-full text-red-400"><CreditCard size={28} /></div>
          </div>
        </div>
      </div>

      {/* STATISTIKY (KPI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Monitorováno</p>
            <p className="text-2xl font-bold text-white">{data.length}</p>
          </div>
          <Globe className="text-blue-500/50" size={24} />
        </div>
        
        <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Uptime systému</p>
            <p className="text-2xl font-bold text-green-400">100%</p>
          </div>
          <ShieldCheck className="text-green-500/50" size={24} />
        </div>

        <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase">Prům. odezva</p>
            <p className="text-2xl font-bold text-white">
              {data.length > 0 ? Math.round(data.reduce((a, b) => a + (b.latency || 0), 0) / data.length) : 0} ms
            </p>
          </div>
          <Activity className="text-purple-500/50" size={24} />
        </div>
      </div>

      {/* TABULKA */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-widest text-center">
                <th className="p-4 font-semibold text-left">Služba / URL</th>
                <th className="p-4 font-semibold">Stav</th>
                <th className="p-4 font-semibold text-left">Expirace</th>
                <th className="p-4 font-semibold">Odezva</th>
                <th className="p-4 text-right">Odkaz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.map((item) => {
                const dSSL = getDaysRemaining(item.cert_expiry);
                const dDom = getDaysRemaining(item.domain_expiry);
                return (
                  <tr key={item.url} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-white font-bold text-base hover:text-blue-400 transition-colors block leading-tight">
                        {item.name}
                      </a>
                      <span className="text-blue-400/50 text-[10px] font-mono block mt-1 truncate max-w-64">{item.url}</span>
                    </td>
                    <td className="p-4 text-center text-[10px] font-bold uppercase tracking-tighter">
                      <div className="flex justify-center">
                        {item.status === 'online' ? 
                          <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-500/20">Online</span> :
                          <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-500/20">Offline</span>
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {item.domain_expiry && (
                          <div className={`flex items-center gap-2 text-xs font-bold ${getStatusColor(dDom)}`}>
                            <CreditCard size={12} className="shrink-0" /> {dDom} d.
                          </div>
                        )}
                        {item.cert_expiry && (
                          <div className={`flex items-center gap-2 text-[10px] font-medium ${getStatusColor(dSSL)}`}>
                            <Lock size={10} className="shrink-0" /> SSL: {dSSL} d.
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white font-mono text-xs text-center">{item.latency} ms</td>
                    <td className="p-4 text-right">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-all p-2 inline-block bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-500 shadow-sm active:scale-95">
                        <ExternalLink size={16}/>
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