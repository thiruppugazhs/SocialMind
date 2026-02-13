
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
  ChevronRight,
  UserPlus,
  ExternalLink,
  FileText,
  Clock,
  PieChart as PieChartIcon,
  Navigation,
  Globe,
  Share2,
  Bookmark
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { generateFullAudit } from '../services/apiService';
import { View } from '../types';

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
  { name: 'Priya Sharma', handle: 'priya_m', followers: '12K', joined: '2d ago', avatar: 'https://picsum.photos/seed/p/100/100' },
  { name: 'Rahul Vibe', handle: 'rahul_vibe', followers: '45K', joined: '5d ago', avatar: 'https://picsum.photos/seed/r/100/100' },
  { name: 'Nike India', handle: 'nike_india', followers: '1.2M', joined: '1w ago', avatar: 'https://picsum.photos/seed/n/100/100' },
  { name: 'Tech Guru', handle: 'tech_guru', followers: '280K', joined: '1w ago', avatar: 'https://picsum.photos/seed/t/100/100' },
  { name: 'Aman Deep', handle: 'aman_clicks', followers: '8.4K', joined: '3w ago', avatar: 'https://picsum.photos/seed/a/100/100' },
];

const mockLikedPosts = [
  { id: 1, type: 'post', caption: 'Summer glow is real! ✨ #skincare #lifestyle', date: 'Oct 24', likes: 1200, thumb: 'https://picsum.photos/seed/s1/100/100' },
  { id: 2, type: 'reel', caption: 'How to use AI for growth 🚀 #socialmedia #tips', date: 'Oct 23', likes: 4500, thumb: 'https://picsum.photos/seed/s2/100/100' },
  { id: 3, type: 'post', caption: 'Morning rituals 🌿 #peaceful #mindset', date: 'Oct 22', likes: 800, thumb: 'https://picsum.photos/seed/s3/100/100' },
];

const engagementTypesData = [
  { name: 'Reels', value: 6.8, color: '#ec4899' },
  { name: 'Carousels', value: 4.2, color: '#818cf8' },
  { name: 'Static Posts', value: 2.5, color: '#94a3b8' },
];

const impressionSourcesData = [
  { name: 'Home', value: 45, color: '#6366f1' },
  { name: 'Explore', value: 32, color: '#ec4899' },
  { name: 'Profile', value: 15, color: '#8b5cf6' },
  { name: 'Hashtags', value: 8, color: '#f43f5e' },
];

const aiSavingsData = [
  { category: 'Content Creation', hours: 10, icon: <Sparkles size={16}/> },
  { category: 'Automation', hours: 8, icon: <Zap size={16}/> },
  { category: 'Trend Scanning', hours: 4, icon: <TrendingUp size={16}/> },
  { category: 'Analytics Reporting', hours: 2, icon: <BarChart3 size={16}/> },
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

interface Props {
  onNavigate?: (view: View) => void;
}

const IGDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState<any | null>(null);
  const [isFollowersExpanded, setIsFollowersExpanded] = useState(false);

  const handleGenerateAudit = async () => {
    setIsAuditLoading(true);
    try {
      const result = await generateFullAudit({ 
        followers: '6,124', 
        reach: '45.2K', 
        impressions: '128K',
        likes: '8.4K',
        engagement: '4.8%' 
      });
      if (result) {
        setAuditResult(result);
        setShowAuditModal(true);
      }
    } catch (error) {
      console.error('Error generating audit:', error);
    }
    setIsAuditLoading(false);
  };

  const handleExportPdf = () => {
    alert("Generating PDF Audit Report... Please wait.");
    setTimeout(() => {
      alert("SocialMind Audit Report (Oct 2024) downloaded successfully! 📄✨");
    }, 1500);
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

  // Drill-down Logic
  if (selectedStat === 'Total Followers') {
    const displayedFollowers = isFollowersExpanded ? mockFollowers : mockFollowers.slice(0, 5);
    return (
      <DetailPanel title="Total Followers (6,124)" onClose={() => setSelectedStat(null)}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedFollowers.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <img src={f.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={f.name} />
                  <div>
                    <p className="font-bold text-slate-800">{f.name}</p>
                    <a href={`https://instagram.com/${f.handle}`} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-600 font-bold hover:underline flex items-center gap-1">@{f.handle} <ExternalLink size={10} /></a>
                  </div>
                </div>
                <div className="text-right"><p className="text-xs font-black text-slate-500">{f.followers}</p></div>
              </div>
            ))}
          </div>
        </div>
      </DetailPanel>
    );
  }

  if (selectedStat === 'Total Likes') {
    return (
      <DetailPanel title="Recent Engagement" onClose={() => setSelectedStat(null)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLikedPosts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
              <img src={p.thumb} className="w-full aspect-square object-cover" alt="Post" />
              <div className="p-4">
                <p className="font-bold text-slate-800 line-clamp-1">{p.caption}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-pink-600 font-black text-xs">{p.likes} Likes</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{p.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DetailPanel>
    );
  }

  if (selectedStat === 'Total Impressions') {
    return (
      <DetailPanel title="Discovery & Impressions Breakdown" onClose={() => setSelectedStat(null)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h4 className="text-xl font-black text-slate-800">Traffic Sources</h4>
            <div className="space-y-6">
              {impressionSourcesData.map(item => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
               <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase mb-2"><TrendingUp size={16}/> Trend Insight</div>
               <p className="text-sm text-indigo-900 leading-relaxed">Impressions from <span className="font-black">Explore</span> have increased by 24% this week, indicating high viral potential for your current content theme.</p>
            </div>
          </div>
          <div className="h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={impressionSourcesData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {impressionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DetailPanel>
    );
  }

  if (selectedStat === 'Weekly Reach') {
    return (
      <DetailPanel title="Weekly Reach Analysis" onClose={() => setSelectedStat(null)}>
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorReachFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Area type="monotone" dataKey="reach" stroke="#6366f1" fill="url(#colorReachFull)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Followers Reached</p>
              <p className="text-2xl font-black text-slate-800">42,102</p>
              <p className="text-xs text-slate-500 mt-1">68% of total</p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Non-Followers</p>
              <p className="text-2xl font-black text-slate-800">19,820</p>
              <p className="text-xs text-slate-500 mt-1">32% of total</p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Peak Day</p>
              <p className="text-2xl font-black text-pink-600">Sunday</p>
              <p className="text-xs text-slate-500 mt-1">10.5K reached</p>
            </div>
          </div>
        </div>
      </DetailPanel>
    );
  }

  if (selectedStat === 'Avg. Engagement') {
    return (
      <DetailPanel title="Engagement Optimization" onClose={() => setSelectedStat(null)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-80">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Efficiency by Post Type</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementTypesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontWeight: 700}} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                  {engagementTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-pink-600 p-8 rounded-[2.5rem] text-white shadow-xl">
               <Zap className="text-pink-200 mb-4" size={32} />
               <h4 className="text-lg font-black mb-2">Reels are winning!</h4>
               <p className="text-sm text-pink-50 opacity-90 leading-relaxed">Your Reels have a 170% higher engagement rate than static posts. Gemini recommends converting your top 3 blog posts into Reels this week.</p>
            </div>
            <div className="flex gap-4">
               <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 text-center">
                 <p className="text-2xl font-black text-slate-800">128</p>
                 <p className="text-[10px] font-black uppercase text-slate-400">Shares/Week</p>
               </div>
               <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 text-center">
                 <p className="text-2xl font-black text-slate-800">342</p>
                 <p className="text-[10px] font-black uppercase text-slate-400">Saves/Week</p>
               </div>
            </div>
          </div>
        </div>
      </DetailPanel>
    );
  }

  if (selectedStat === 'AI Saved Hours') {
    return (
      <DetailPanel title="AI Productivity Log" onClose={() => setSelectedStat(null)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
               <h4 className="text-4xl font-black mb-1">24.5 Hours</h4>
               <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Time saved this week</p>
               <div className="mt-8 flex gap-2">
                 {[1,2,3,4,5,6,7].map(i => <div key={i} className="flex-1 h-12 bg-white/10 rounded-lg relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 bg-pink-500 transition-all duration-1000" style={{ height: `${Math.random() * 80 + 20}%` }} /></div>)}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {aiSavingsData.map((item, idx) => (
                 <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all">
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 mb-3">{item.icon}</div>
                   <p className="text-xl font-black text-slate-800">{item.hours}h</p>
                   <p className="text-[10px] font-black uppercase text-slate-400">{item.category}</p>
                 </div>
               ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Sparkles className="text-pink-500" size={20}/> Automation ROI</h4>
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">72%</div>
                 <div><p className="text-sm font-bold text-slate-800">Auto-Reply Accuracy</p><p className="text-xs text-slate-500">Gemini successfully handled 124 DMs without human intervention.</p></div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">15min</div>
                 <div><p className="text-sm font-bold text-slate-800">Content Gen Time</p><p className="text-xs text-slate-500">Average time to generate a full campaign, down from 4 hours.</p></div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">Real</div>
                 <div><p className="text-sm font-bold text-slate-800">Trend Adaptation</p><p className="text-xs text-slate-500">Time to adapt to a viral audio reduced to minutes via AI notifications.</p></div>
               </div>
            </div>
          </div>
        </div>
      </DetailPanel>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        <StatCard onClick={() => setSelectedStat('Total Followers')} label="Total Followers" value="6,124" trend="+12%" icon={Users} color="pink" />
        <StatCard onClick={() => setSelectedStat('Total Likes')} label="Total Likes" value="8.4K" trend="+15%" icon={Heart} color="red" />
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
                    <svg className="w-full h-full transform -rotate-90"><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" /><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * (auditResult.score || 0)) / 100} className="text-pink-600" /></svg>
                    <span className="absolute text-4xl font-black text-slate-800">{auditResult.score || 0}</span>
                  </div>
                </div>
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"><h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-amber-500" size={18} /> AI Executive Summary</h3><p className="text-slate-600 leading-relaxed italic">"{auditResult.summary || 'No summary available'}"</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4"><h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">Check Strengths</h4>{(auditResult.strengths || []).map((s: string, i: number) => (<div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-bold">{s}</div>))}</div>
                <div className="space-y-4"><h4 className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">Areas for Optimization</h4>{(auditResult.weaknesses || []).map((w: string, i: number) => (<div key={i} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-xs font-bold">{w}</div>))}</div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <button onClick={handleExportPdf} className="flex-1 py-4 bg-slate-50 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 transition-all">
                <FileText size={18} /> Export PDF Report
              </button>
              <button onClick={() => { onNavigate?.('ig-automation'); setShowAuditModal(false); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all">
                Implement Action Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IGDashboard;
