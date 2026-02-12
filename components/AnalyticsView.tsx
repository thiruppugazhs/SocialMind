
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
  Pie
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
  Download
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

const AnalyticsView: React.FC = () => {
  const [locationTab, setLocationTab] = useState<'country' | 'state' | 'city'>('country');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

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
      alert("Competitor analysis complete: Your account is in the top 5% of your niche! Keep it up. 🏆");
    }, 2000);
  };

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
