
import React, { useState } from 'react';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Heart, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  X, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { generateFullAudit, IGAuditResponse } from '../services/geminiService';

const mockData = [
  { name: 'Mon', followers: 4000, reach: 2400, impressions: 3100, engagement: 4.1, saved: 2 },
  { name: 'Tue', followers: 4500, reach: 3200, impressions: 4200, engagement: 4.3, saved: 4 },
  { name: 'Wed', followers: 4300, reach: 5000, impressions: 6100, engagement: 4.8, saved: 3 },
  { name: 'Thu', followers: 4800, reach: 4100, impressions: 5300, engagement: 4.5, saved: 5 },
  { name: 'Fri', followers: 5200, reach: 6000, impressions: 7800, engagement: 5.2, saved: 4 },
  { name: 'Sat', followers: 5800, reach: 7500, impressions: 9200, engagement: 6.0, saved: 3 },
  { name: 'Sun', followers: 6100, reach: 8200, impressions: 10500, engagement: 6.4, saved: 3 },
];

const mockFollowers = [
  { name: 'priya_m', handle: '@priya_m', followers: '12K', joined: '2d ago', avatar: 'https://picsum.photos/seed/p/100/100' },
  { name: 'rahul_vibe', handle: '@rahul_vibe', followers: '45K', joined: '5d ago', avatar: 'https://picsum.photos/seed/r/100/100' },
  { name: 'nike_india', handle: '@nike_india', followers: '1.2M', joined: '1w ago', avatar: 'https://picsum.photos/seed/n/100/100' },
  { name: 'tech_guru', handle: '@tech_guru', followers: '280K', joined: '1w ago', avatar: 'https://picsum.photos/seed/t/100/100' },
];

const mockLikedPosts = [
  { id: 1, type: 'post', caption: 'Summer glow is real! ✨', date: 'Oct 24', likes: 1200, thumb: 'https://picsum.photos/seed/s1/100/100' },
  { id: 2, type: 'reel', caption: 'How to use AI for growth 🚀', date: 'Oct 23', likes: 4500, thumb: 'https://picsum.photos/seed/s2/100/100' },
  { id: 3, type: 'post', caption: 'Morning rituals 🌿', date: 'Oct 22', likes: 800, thumb: 'https://picsum.photos/seed/s3/100/100' },
];

const StatCard = ({ label, value, trend, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="text-left w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-pink-200 group active:scale-[0.98]"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className={`flex items-center text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend} <ArrowUpRight size={14} />
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </button>
);

const IGDashboard: React.FC = () => {
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<IGAuditResponse | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  const handleGenerateAudit = async () => {
    setIsAuditLoading(true);
    const result = await generateFullAudit({ followers: '12.4K', reach: '84K', impressions: '128K' });
    if (result) {
      setAuditResult(result);
      setShowAuditModal(true);
    }
    setIsAuditLoading(false);
  };

  const DetailPanel = ({ title, onClose, children }: any) => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
          <ArrowLeft size={18} /> Back to Overview
        </button>
        <h3 className="text-lg font-black text-slate-800">{title}</h3>
        <div className="w-20" />
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  if (selectedStat) {
    return (
      <DetailPanel title={selectedStat} onClose={() => setSelectedStat(null)}>
        {selectedStat === 'Total Followers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFollowers.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <img src={f.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={f.name} />
                    <div><p className="font-bold text-slate-800">{f.name}</p><p className="text-xs text-slate-400 font-medium">{f.handle}</p></div>
                  </div>
                  <div className="text-right"><p className="text-xs font-black text-pink-600">{f.followers}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{f.joined}</p></div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-slate-400 font-bold text-sm border-2 border-dashed border-slate-200 rounded-2xl hover:text-slate-600 hover:border-slate-300">View All 12,482 Followers</button>
          </div>
        )}
        {selectedStat === 'Total Likes' && (
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Liked Content</h4>
            <div className="divide-y divide-slate-100">
              {mockLikedPosts.map((p) => (
                <div key={p.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={p.thumb} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="Post" />
                    <div><p className="font-bold text-slate-800 line-clamp-1">{p.caption}</p><p className="text-xs text-slate-400 font-medium">{p.date}</p></div>
                  </div>
                  <div className="flex items-center gap-2"><Heart size={14} className="text-red-500 fill-red-500" /><span className="text-sm font-black text-slate-700">{p.likes}</span><ChevronRight size={16} className="text-slate-300" /></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {['Total Impressions', 'Weekly Reach', 'Avg. Engagement', 'AI Saved Hours'].includes(selectedStat) && (
          <div className="space-y-8">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey={selectedStat === 'Total Impressions' ? 'impressions' : selectedStat === 'Weekly Reach' ? 'reach' : selectedStat === 'Avg. Engagement' ? 'engagement' : 'saved'} stroke="#ec4899" fill="url(#colorMain)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
              <div className="flex items-center gap-3 mb-4"><Sparkles className="text-pink-400" size={20}/><h4 className="text-sm font-black uppercase tracking-widest">AI Trend Forecast</h4></div>
              <p className="text-slate-300 text-sm leading-relaxed">Based on current trajectory, your <span className="text-white font-bold">{selectedStat}</span> is expected to grow by <span className="text-emerald-400 font-black">22%</span> in the next 14 days if you maintain the current posting frequency.</p>
            </div>
          </div>
        )}
      </DetailPanel>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        <StatCard onClick={() => setSelectedStat('Total Followers')} label="Total Followers" value="12,482" trend="+12%" icon={Users} color="pink" />
        <StatCard onClick={() => setSelectedStat('Total Likes')} label="Total Likes" value="45.2K" trend="+15%" icon={Heart} color="red" />
        <StatCard onClick={() => setSelectedStat('Total Impressions')} label="Total Impressions" value="128K" trend="+28%" icon={Zap} color="blue" />
        <StatCard onClick={() => setSelectedStat('Weekly Reach')} label="Weekly Reach" value="84.2K" trend="+42%" icon={Eye} color="indigo" />
        <StatCard onClick={() => setSelectedStat('Avg. Engagement')} label="Avg. Engagement" value="4.8%" trend="+0.5%" icon={TrendingUp} color="orange" />
        <StatCard onClick={() => setSelectedStat('AI Saved Hours')} label="AI Saved Hours" value="24h" trend="+120%" icon={Calendar} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold flex items-center gap-2">Performance Trends <span className="text-xs font-normal text-slate-400">(Last 7 Days)</span></h3></div>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={mockData}><defs><linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} /><Tooltip contentStyle={{borderRadius: '16px', border: 'none'}}/><Area type="monotone" dataKey="reach" stroke="#ec4899" fill="url(#colorReach)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6">Real-time Insights</h3>
          <div className="space-y-5 flex-1">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Heart size={16} /></div><span className="text-sm font-bold text-slate-800">High Velocity Alert</span></div><p className="text-xs text-slate-600">Your latest post about "Summer Skincare" is getting 45 likes/minute—3x faster than your average.</p></div>
            <div className="p-4 bg-blue-100/50 rounded-xl border border-blue-100"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Eye size={16} /></div><span className="text-sm font-bold text-slate-800">Impression Surge</span></div><p className="text-xs text-slate-600">Explore page traffic is up 12% today. Gemini suggests posting a Reel now.</p></div>
          </div>
          <button onClick={handleGenerateAudit} disabled={isAuditLoading} className="w-full mt-6 py-4 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">{isAuditLoading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : <><Sparkles size={18} /> Generate Full Audit</>}</button>
        </div>
      </div>

      {showAuditModal && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 bg-gradient-to-r from-pink-600 to-violet-700 text-white relative">
              <button onClick={() => setShowAuditModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
              <div className="flex items-center gap-4 mb-2"><div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><Sparkles size={32} /></div><div><h2 className="text-3xl font-black">AI Account Audit</h2><p className="text-pink-100 opacity-90">Health Check & Strategy</p></div></div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-black uppercase text-slate-400 mb-2">Health Score</p>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90"><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" /><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * auditResult.score) / 100} className="text-pink-600" /></svg>
                    <span className="absolute text-4xl font-black text-slate-800">{auditResult.score}</span>
                  </div>
                </div>
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"><h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-amber-500" size={18} /> AI Executive Summary</h3><p className="text-slate-600 leading-relaxed italic">"{auditResult.summary}"</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4"><h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">Check Strengths</h4>{auditResult.strengths.map((s, i) => (<div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-bold">{s}</div>))}</div>
                <div className="space-y-4"><h4 className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">Areas for Optimization</h4>{auditResult.weaknesses.map((w, i) => (<div key={i} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-xs font-bold">{w}</div>))}</div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <button onClick={() => { alert("Generating PDF Report... please wait."); setTimeout(() => alert("Report downloaded successfully!"), 2000); }} className="flex-1 py-4 bg-slate-50 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200"><Download size={18} /> Export PDF Report</button>
              <button onClick={() => { alert("Action plan implemented! Check your automation center."); setShowAuditModal(false); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all">Implement Action Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IGDashboard;
