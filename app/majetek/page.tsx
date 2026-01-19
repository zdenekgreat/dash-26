'use client';

import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit2
} from 'lucide-react';

// Data pro tabulku
const licenses = [
  { id: 1, name: "Adobe Creative Cloud", type: "Licence", garant: "Jan Novák", exp: "30.07.2024", status: "critical" },
  { id: 2, name: "Fortigate GIE", type: "Licence", garant: "Jan Novák", exp: "30.07.2024", status: "critical" },
  { id: 3, name: "Fortigate HW", type: "Hardware", garant: "Petr Svoboda", exp: "30.07.2024", status: "critical" },
  { id: 4, name: "VMWare vSphere", type: "Podpora", garant: "Zdeněk Mazal", exp: "12.01.2026", status: "warning" },
  { id: 5, name: "Microsoft 365 E3", type: "Licence", garant: "Zdeněk Mazal", exp: "15.05.2026", status: "ok" },
  { id: 6, name: "Dell Server R740", type: "Hardware", garant: "Jan Novák", exp: "20.08.2027", status: "ok" },
];

export default function AssetsPage() {
  
  // Pomocná funkce pro barvičky statusu
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium w-fit">
            <AlertCircle size={14} />
            <span>Kritické</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium w-fit">
            <Clock size={14} />
            <span>Blíží se</span>
          </div>
        );
      case 'ok':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium w-fit">
            <CheckCircle size={14} />
            <span>Aktivní</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HLAVIČKA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">IT Majetek</h2>
          <p className="text-slate-400 text-sm mt-1">Přehled IT infrastruktury a licencí KÚOL</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          <span>Nová položka</span>
        </button>
      </div>

      {/* 2. FILTRY */}
      <div className="flex gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Hledat (název, garant, typ)..." 
            className="w-full bg-[#0f172a] border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-slate-300 border border-slate-700 rounded-lg hover:text-white transition">
          <Filter size={18} />
          <span>Filtrovat</span>
        </button>
      </div>

      {/* 3. TABULKA */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="p-4 font-semibold">Název Aktiva</th>
                <th className="p-4 font-semibold">Typ (Licence/HW)</th>
                <th className="p-4 font-semibold">Garant</th>
                <th className="p-4 font-semibold">Expirace</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {licenses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 font-medium text-white flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                      <FileText size={16} />
                    </div>
                    {item.name}
                  </td>
                  <td className="p-4 text-slate-300">{item.type}</td>
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                      {item.garant.split(' ').map(n => n[0]).join('')}
                    </div>
                    {item.garant}
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{item.exp}</td>
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-400" title="Upravit">
                        <Edit2 size={16}/>
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400" title="Smazat">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Patička */}
        <div className="p-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Zobrazeno 6 z 42 záznamů</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">Předchozí</button>
            <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">Další</button>
          </div>
        </div>
      </div>
    </div>
  );
}