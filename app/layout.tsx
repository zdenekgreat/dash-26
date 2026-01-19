import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Importujeme náš nový Sidebar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SENTINEL | KÚOL IT",
  description: "Správa IT infrastruktury Olomouckého kraje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a] text-slate-200`}
      >
        <div className="flex h-screen overflow-hidden">
          
          {/* LEVÝ PANEL (SIDEBAR) */}
          <Sidebar />

          {/* PRAVÁ ČÁST (OBSAH) */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            
            {/* Horní lišta (Search bar atd.) - volitelné */}
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0B1120]">
              <input 
                type="text" 
                placeholder="Vyhledat v systému..." 
                className="bg-slate-800 border-none text-sm rounded-lg px-4 py-2 w-96 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center gap-4">
                 {/* Sem přijdou notifikace zvoneček atd. */}
                 <div className="w-8 h-8 rounded-full bg-slate-700"></div>
              </div>
            </header>

            {/* Zde se vykreslí app/page.tsx */}
            <div className="p-8">
              {children}
            </div>

          </main>
        </div>
      </body>
    </html>
  );
}