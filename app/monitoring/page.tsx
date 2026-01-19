'use client';

import { 
  Globe, 
  Activity, 
  Download, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Data pro malé grafy (sparklines) v tabulce
const mockGraphData1 = [
  { val: 40 }, { val: 30 }, { val: 45 }, { val: 50 }, { val: 48 }, { val: 60 }, { val: 55 }, { val: 70 }
];
const mockGraphData2 = [
  { val: 60 }, { val: 62 }, { val: 61 }, { val: 65 }, { val: 64 }, { val: 66 }, { val: 68 }, { val: 67 }
];
const mockGraphDataError = [
  { val: 50 }, { val: 50 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }
];

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      
      {/* 1. HLAVIČKA A TLAČÍTKA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Správa a monitoring domén</h2>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white">Domény</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition">
            <Download size={18} />
            Export reportu
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
            <Plus size={18} />
            Nová doména
          </button>
        </div>
      </div>

      {/* 2. KPI KARTY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Aktivních domén</p>
            <p className="text-4xl font-bold text-white mt-2">45</p>
          </div>
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400">
            <Globe size={24} />
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Celkový provoz (24h)</p>
            <p className="text-4xl font-bold text-white mt-2">1.2M <span className="text-lg text-slate-500 font-normal">zobrazení</span></p>
          </div>
          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* 3. HLAVNÍ TABULKA */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
        
        {/* Filtry v hlavičce tabulky */}
        <div className="p-4 border-b border-slate-700 flex gap-4">
           <input 
             type="text" 
             placeholder="Hledat doménu..." 
             className="bg-[#0f172a] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-blue-500"
           />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Doména</th>
                <th className="p-4 font-semibold">Stav (Uptime)</th>
                <th className="p-4 font-semibold">SSL Certifikát</th>
                <th className="p-4 font-semibold">Návštěvnost (24h)</th>
                <th className="p-4 font-semibold w-32">Trend (30 dní)</th>
                <th className="p-4 font-semibold">Registrátor</th>
                <th className="p-4 font-semibold text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              
              {/* ŘÁDEK 1: olkraj.cz */}
              <tr className="hover:bg-slate-800/50 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-white">olkraj.cz</div>
                  <a href="https://olkraj.cz" target="_blank" className="text-xs text-blue-400 hover:underline">Otevřít web</a>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-2 py-1 rounded w-fit">
                    <CheckCircle size={14} />
                    <span className="font-medium">Online (99.9%)</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>Platný (240 dní)</span>
                  </div>
                </td>
                <td className="p-4 text-white font-mono">850K (GA4)</td>
                <td className="p-4">
                  <div className="h-8 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockGraphData1}>
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="p-4 text-slate-400">CZ.NIC</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ExternalLink size={16}/></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><MoreVertical size={16}/></button>
                  </div>
                </td>
              </tr>

              {/* ŘÁDEK 2: portal.olkraj.cz */}
              <tr className="hover:bg-slate-800/50 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-white">portal.olkraj.cz</div>
                  <span className="text-xs text-slate-500">Portál občana</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-2 py-1 rounded w-fit">
                    <CheckCircle size={14} />
                    <span className="font-medium">Online</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertTriangle size={14} />
                    <span>Končí za 14 dní</span>
                  </div>
                </td>
                <td className="p-4 text-white font-mono">210K</td>
                <td className="p-4">
                  <div className="h-8 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockGraphData2}>
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="p-4 text-slate-400">Active24</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ExternalLink size={16}/></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><MoreVertical size={16}/></button>
                  </div>
                </td>
              </tr>

              {/* ŘÁDEK 3: kultura.olkraj.cz (OFFLINE) */}
              <tr className="hover:bg-slate-800/50 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-white">kultura.olkraj.cz</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-2 py-1 rounded w-fit">
                    <XCircle size={14} />
                    <span className="font-medium">Offline (Chyba 503)</span>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>Platný</span>
                  </div>
                </td>
                <td className="p-4 text-white font-mono">N/A</td>
                <td className="p-4">
                  <div className="h-8 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockGraphDataError}>
                        <Area type="monotone" dataKey="val" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="p-4 text-slate-400">CZ.NIC</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ExternalLink size={16}/></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><MoreVertical size={16}/></button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}