import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie,
  LineChart,
  Line
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Globe, 
  MapPin, 
  Building2,
  Navigation,
  Compass,
  Sparkles,
  Info,
  Loader2,
  Download,
  ArrowLeft,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Trophy
} from 'lucide-react';

const sentimentData = [
  { name: 'Positive', value: 72, color: '#10b981' },
  { name: 'Neutral', value: 18, color: '#f59e0b' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

const ageData = [
  { name: '13-17', count: 1200 },
  { name: '18-24', count: 4500 },
  { name: '25-34', count: 3200 },
  { name: '35-44', count: 1100 },
  { name: '45-54', count: 650 },
  { name: '55+', count: 230 },
];

const genderData = [
  { name: 'Female', value: 58, color: '#ec4899' },
  { name: 'Male', value: 35, color: '#6366f1' },
  { name: 'Non-binary', value: 7, color: '#94a3b8' },
];

const countryData = [
  { name: 'India', value: 65 },
  { name: 'USA', value: 15 },
  { name: 'UAE', value: 8 },
  { name: 'UK', value: 7 },
  { name: 'Canada', value: 5 },
];

const stateData = [
  { name: 'Maharashtra', value: 28 },
  { name: 'Karnataka', value: 22 },
  { name: 'Delhi', value: 18 },
  { name: 'Tamil Nadu', value: 12 },
  { name: 'Telangana', value: 10 },
  { name: 'Others', value: 10 },
];

const cityData = [
  { name: 'Mumbai', value: 35 },
  { name: 'Bangalore', value: 28 },
  { name: 'New Delhi', value: 15 },
  { name: 'Pune', value: 12 },
  { name: 'Hyderabad', value: 10 },
];

const competitorData = [
  { name: 'You', engagement: 4.8, growth: 12, frequency: 5 },
  { name: 'Niche Avg', engagement: 3.2, growth: 8, frequency: 3 },
  { name: 'Top Leader', engagement: 6.5, growth: 25, frequency: 12 },
];

const AnalyticsView: React.FC = () => {
  const [locationTab, setLocationTab] = useState<'country' | 'state' | 'city'>('country');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showCompetitorPanel, setShowCompetitorPanel] = useState(false);
  const [competitorSearch, setCompetitorSearch] = useState('');

  const getLocationData = () => {
    switch (locationTab) {
      case 'country': return countryData;
      case 'state': return stateData;
      case 'city': return cityData;
      default: return countryData;
    }
  };

  const handlePdfGen = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      alert("AI Growth Roadmap generated and downloaded successfully! 🚀");
    }, 2500);
  };

  const handleCompetitor = () => {
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setShowCompetitorPanel(true);
    }, 2000);
  };

  const CompetitorPanel = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCompetitorPanel(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h3 className="text-xl font-black text-slate-800">Competitor Benchmarks</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Niche: Skincare & Lifestyle</p>
          </div>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Analyze @competitor..." 
            value={competitorSearch}
            onChange={(e) => setCompetitorSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h4 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
             <TrendingUp className="text-pink-600" size={20} /> 
             Engagement Rate vs. Competitors
           </h4>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={competitorData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="%" />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                 <Bar dataKey="engagement" radius={[10, 10, 0, 0]} barSize={60}>
                    {competitorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'You' ? '#ec4899' : '#818cf8'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <Trophy className="absolute top-4 right-4 text-pink-400 opacity-20" size={100} />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-300 mb-2">Performance Rank</p>
                <h3 className="text-4xl font-black mb-1">Top 5%</h3>
                <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                  You are outperforming 95% of creators in the Skincare niche this week.
                </p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Winning Tactics</h5>
              <div className="space-y-3">
                 {[
                   { t: "Story Polls", s: "Leader uses 3+ daily", v: "High" },
                   { t: "Reel Covers", s: "Consistent branding", v: "Med" },
                   { t: "SEO Keywords", s: "Optimized Bio/Captions", v: "Critical" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-sm font-bold text-slate-700">{item.t}</span>
                     <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h4 className="text-lg font-black text-slate-800 mb-8">AI Gap Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <CheckCircle2 size={24} />
                <span className="font-black text-xs uppercase tracking-widest">Strength</span>
              </div>
              <p className="text-sm text-emerald-900 font-bold leading-relaxed">
                Your Reels have 42% higher retention than the top leader due to fast-paced editing.
              </p>
           </div>
           <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <div className="flex items-center gap-3 mb-4 text-amber-600">
                <AlertTriangle size={24} />
                <span className="font-black text-xs uppercase tracking-widest">Opportunity</span>
              </div>
              <p className="text-sm text-amber-900 font-bold leading-relaxed">
                Leaders post 2.4x more frequently. Increasing volume by 1 post/day could boost reach by 28%.
              </p>
           </div>
           <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <Zap size={24} />
                <span className="font-black text-xs uppercase tracking-widest">Next Move</span>
              </div>
              <p className="text-sm text-indigo-900 font-bold leading-relaxed">
                Shift focus to "Educational Carousels" which are currently seeing a 15% engagement surge for competitors.
              </p>
           </div>
        </div>
      </div>
    </div>
  );

  if (showCompetitorPanel) {
    return <CompetitorPanel />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div><h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Users className="text-pink-500" size={24} /> Audience Age</h3><p className="text-sm text-slate-500">Distribution across age groups</p></div>
            <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Top: 18-24</div>
          </div>
          <div className="h-64 flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} /><Bar dataKey="count" radius={[6, 6, 0, 0]}>{ageData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.name === '18-24' ? '#ec4899' : '#e2e8f0'} />))}</Bar></BarChart></ResponsiveContainer></div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div><h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Target className="text-indigo-500" size={24} /> Audience Gender</h3><p className="text-sm text-slate-500">Gender identity of followers</p></div>
          </div>
          <div className="flex items-center">
            <div className="h-64 w-1/2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">{genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} /></PieChart></ResponsiveContainer></div>
            <div className="w-1/2 pl-8 space-y-4">{genderData.map(item => (<div key={item.name} className="flex flex-col gap-1"><div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-700 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} /> {item.name}</span><span className="text-sm font-black text-slate-900">{item.value}%</span></div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{width: `${item.value}%`, backgroundColor: item.color}} /></div></div>))}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div><h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><MapPin className="text-pink-600" size={28} /> Location Intelligence</h3></div>
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full md:w-auto">{(['country', 'state', 'city'] as const).map((tab) => (<button key={tab} onClick={() => setLocationTab(tab)} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${locationTab === tab ? 'bg-white text-pink-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>))}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 h-[400px]"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={getLocationData()} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 13, fontWeight: 700}} width={100} /><Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none'}} /><Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>{getLocationData().map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? '#ec4899' : '#818cf8'} fillOpacity={1 - (index * 0.12)} />))}</Bar></BarChart></ResponsiveContainer></div>
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100"><h4 className="font-bold text-slate-800 mb-2">Location Insight</h4><p className="text-sm text-slate-600 leading-relaxed">Your content has the highest impact in <span className="font-black text-pink-600">{getLocationData()[0].name}</span>.</p></div>
            <div className="p-6 bg-indigo-900 text-white rounded-3xl shadow-xl overflow-hidden group"><div className="flex items-center justify-between mb-4"><h4 className="text-xs font-black uppercase tracking-widest opacity-80">Density</h4><TrendingUp size={18} className="text-pink-400" /></div><div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-black">{getLocationData()[0].value}%</span></div><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{width: `${getLocationData()[0].value}%`}} /></div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"><h3 className="text-xl font-black text-slate-800 mb-6">Sentiment</h3><div className="space-y-5">{sentimentData.map(item => (<div key={item.name}><div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5"><span>{item.name}</span><span>{item.value}%</span></div><div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width: `${item.value}%`, backgroundColor: item.color}} /></div></div>))}</div></div>
        <div className="lg:col-span-2 bg-gradient-to-br from-pink-600 via-indigo-700 to-violet-800 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div><h3 className="text-3xl font-black mb-4 flex items-center gap-3">AI Growth Strategy <Sparkles size={24} className="text-pink-300 animate-pulse" /></h3><p className="text-pink-100 text-lg max-w-xl leading-relaxed">Focus on "Behind the Scenes" content to reach Females 18-24 in Mumbai.</p></div>
             <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={handlePdfGen} disabled={isGeneratingPdf} className="px-8 py-4 bg-white text-indigo-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  {isGeneratingPdf ? <Loader2 className="animate-spin" size={18}/> : <><Download size={18}/> Generate PDF Roadmap</>}
                </button>
                <button onClick={handleCompetitor} disabled={isComparing} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isComparing ? <Loader2 className="animate-spin" size={18}/> : 'View Competitor Benchmarks'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
