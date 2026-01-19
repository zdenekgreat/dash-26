'use client';

import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

// TADY JSME DEFINOVALI TYP (aby TypeScript nekřičel)
interface DomainData {
  url: string;
  currentStatus: string;
  history: {
    latency: number;
    status: string;
    time: string | Date;
  }[];
}

export default function DomainCard({ data }: { data: DomainData }) {
  const isOnline = data.currentStatus === 'online';
  
  const latestLatency = data.history.length > 0 
    ? data.history[data.history.length - 1].latency 
    : 0;
  
  const color = isOnline ? '#22c55e' : '#ef4444';

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-800">{new URL(data.url).hostname}</h3>
          <a href={data.url} target="_blank" className="text-xs text-slate-400 hover:text-blue-500">
            {data.url}
          </a>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isOnline ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-600">
          <Activity size={18} />
          <span className="font-mono text-lg font-bold">{latestLatency}ms</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Clock size={16} />
          <span>Posledních 24h</span>
        </div>
      </div>

      <div className="h-24 w-full" style={{ minHeight: '96px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.history}>
            <defs>
              <linearGradient id={`gradient-${data.url}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'auto']} width={0} />
            <Area 
              type="monotone" 
              dataKey="latency" 
              stroke={color} 
              strokeWidth={2}
              fill={`url(#gradient-${data.url})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}