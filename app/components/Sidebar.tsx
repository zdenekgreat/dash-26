'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Monitor, 
  Globe, 
  Users, 
  Lock, 
  CheckSquare, 
  FileText, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Funkce pro aktivní odkazy
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
        : 'hover:text-white hover:bg-slate-800 text-slate-400'
    }`;
  };

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0">
      
      {/* 1. LOGO */}
      <div className="p-6 flex items-center gap-3 text-white">
        <ShieldCheck className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold tracking-wider">SENTINEL</h1>
          <p className="text-xs text-cyan-400 tracking-[0.2em]">KÚOL IT</p>
        </div>
      </div>

      {/* 2. PROFIL */}
      <div className="px-6 pb-6 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">ZM</div>
          <div className="text-sm">
            <p className="text-white font-medium">Zdeněk Mazal</p>
            <p className="text-slate-500 text-xs">Administrátor (O365)</p>
          </div>
        </div>
      </div>

      {/* 3. NAVIGACE */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        
        {/* SKUPINA: HLAVNÍ PŘEHLEDY */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Hlavní přehledy</p>
          <ul className="space-y-1">
            <li>
              <Link href="/" className={getLinkClass('/')}>
                <LayoutDashboard size={18} />
                <span className="font-medium">Centrála</span>
              </Link>
            </li>
            <li>
              <Link href="/majetek" className={getLinkClass('/majetek')}>
                <Monitor size={18} />
                <span>IT Majetek</span>
                <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">3</span>
              </Link>
            </li>
            <li>
              <Link href="/monitoring" className={getLinkClass('/monitoring')}>
                <Globe size={18} />
                <span>Monitoring webů</span>
              </Link>
            </li>
            <li>
              <Link href="/tym" className={getLinkClass('/tym')}>
                <Users size={18} />
                <span>Přítomnost týmu</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* SKUPINA: OSOBNÍ NÁSTROJE */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Osobní nástroje</p>
          <ul className="space-y-1">
            <li>
              <Link href="/trezor" className={getLinkClass('/trezor')}>
                <Lock size={18} />
                <span>Můj Trezor</span>
              </Link>
            </li>
            <li>
              <Link href="/ukoly" className={getLinkClass('/ukoly')}>
                <CheckSquare size={18} />
                <span>Moje Úkoly</span>
                <span className="ml-auto w-5 h-5 flex items-center justify-center text-xs bg-blue-600 text-white rounded-full">5</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* SKUPINA: SPRÁVA */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Správa</p>
          <ul className="space-y-1">
            <li>
              <Link href="/audit" className={getLinkClass('/audit')}>
                <FileText size={18} />
                <span>Audit a Výstupy</span>
              </Link>
            </li>
          </ul>
        </div>

      </nav>

      {/* 4. PATIČKA */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white transition-colors">
          <LogOut size={18} />
          <span>Odhlásit se</span>
        </button>
      </div>

    </aside>
  );
}