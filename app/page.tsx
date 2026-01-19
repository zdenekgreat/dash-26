export default function Home() {
  return (
    <div className="space-y-6">
      
      {/* Nadpis sekce */}
      <h2 className="text-2xl font-bold text-white mb-6">Centrála - Přehled IT infrastruktury KÚOL</h2>

      {/* KPI KARTY (Horní řada) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Karta 1 */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium uppercase">Kritické Expirace</h3>
          <p className="text-4xl font-bold text-white mt-2">3</p>
          <div className="mt-4 text-xs text-red-400 font-medium">Nutno vyřešit do 7 dnů</div>
        </div>

        {/* Karta 2 */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium uppercase">Problémy Domén</h3>
          <p className="text-4xl font-bold text-white mt-2">1</p>
          <div className="mt-4 text-xs text-orange-400 font-medium">SSL certifikát expiruje</div>
        </div>

        {/* Karta 3 */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium uppercase">Tým Online</h3>
          <p className="text-4xl font-bold text-white mt-2">8<span className="text-slate-500 text-xl">/12</span></p>
          <div className="mt-4 text-xs text-green-400 font-medium">Většina týmu dostupná</div>
        </div>

        {/* Karta 4 */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium uppercase">Moje Úkoly</h3>
          <p className="text-4xl font-bold text-white mt-2">5</p>
          <div className="mt-4 text-xs text-blue-400 font-medium">Synchronizováno s O365</div>
        </div>
      </div>

      {/* SPODNÍ SEKCE (Grid 2 sloupce) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Tabulka Expirací */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Nejbližší Expirace</h3>
          <div className="space-y-4">
             {/* Řádek tabulky */}
             <div className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0">
                <div className="text-white">Fortigate Support</div>
                <div className="text-red-400 text-sm font-mono">12. ledna 2026</div>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0">
                <div className="text-white">Adobe Creative Cloud</div>
                <div className="text-orange-400 text-sm font-mono">20. února 2026</div>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0">
                <div className="text-white">Dell Server R7</div>
                <div className="text-green-400 text-sm font-mono">15. května 2026</div>
             </div>
          </div>
        </div>

        {/* Semafor Služeb */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Stav Klíčových Služeb</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-slate-300">GINIS</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              <span className="text-slate-300">Portál Občana</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-slate-300">VPN Brána</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              <span className="text-slate-300">Tiskový Server</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}