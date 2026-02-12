
import React, { useState } from 'react';
import { Flame, Play, Music, Hash, ExternalLink, Sparkles, Search, Loader2, Info } from 'lucide-react';
import { getTrendingTrends } from '../services/geminiService';
import { IGTrend } from '../types';

interface Props {
  onApplyTrend?: (trend: IGTrend) => void;
}

const TrendHunter: React.FC<Props> = ({ onApplyTrend }) => {
  const [niche, setNiche] = useState('Skincare & Lifestyle');
  const [isScanning, setIsScanning] = useState(false);
  const [trends, setTrends] = useState<IGTrend[]>([
    { 
      title: 'The "Get Ready With Me" Minimalist Edit', 
      type: 'Reel Format', 
      viralScore: '98%', 
      audio: 'Original Audio - GlowSkin India', 
      hashtags: ['GRWM', 'Minimalist'],
      insight: 'High conversion for skincare brands.'
    },
    { 
      title: 'Glass Skin Challenge 2024', 
      type: 'Hashtag Trend', 
      viralScore: '92%', 
      audio: 'Sunset Vibes by Lo-Fi Beats',
      hashtags: ['GlassSkin', 'SkinCare'],
      insight: 'Viral in metro cities.'
    },
    { 
      title: 'Sustainable Packaging Unboxing', 
      type: 'Video Format', 
      viralScore: '87%', 
      audio: 'Nature Sounds (Trending)',
      hashtags: ['EcoFriendly', 'Unboxing'],
      insight: 'Resonates with Gen Z values.'
    },
  ]);
  const [hashtags, setHashtags] = useState(['SkincareRoutine', 'GlassSkinIndia', 'AIBranding', 'MorningRituals', 'OrganicLife', 'StartupIndia', 'GenZSkincare', 'SustainableLiving', 'ViralIndia', 'CreatorEconomy']);

  const handleScan = async () => {
    if (!niche.trim()) return;
    setIsScanning(true);
    const data = await getTrendingTrends(niche);
    if (data) {
      setTrends(data.trends);
      setHashtags(data.globalHashtags);
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pink-600 via-indigo-700 to-violet-800 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700"><Flame size={180} /></div>
        <div className="relative z-10 max-w-3xl">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6 flex items-center gap-2 border border-white/10"><Sparkles size={14} className="text-pink-300 animate-pulse" /> Live Social Analysis Engine</div>
          <h2 className="text-5xl font-black mb-6 tracking-tight">Trend Hunter</h2>
          <p className="text-pink-100 text-lg leading-relaxed mb-8 opacity-90 font-medium">Predicting viral patterns with real-time metadata analysis.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Enter your niche..." className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all font-bold" />
            </div>
            <button onClick={handleScan} disabled={isScanning} className="px-8 py-4 bg-white text-indigo-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100">
              {isScanning ? <><Loader2 className="animate-spin" size={20} /> Scanning...</> : <><Flame size={20} className="text-pink-600" /> Scan Viral Trends</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map((trend, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
            <div className="h-52 relative overflow-hidden">
              <img src={`https://picsum.photos/seed/trend${i}-${niche}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Trend" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-800 uppercase flex items-center gap-2 shadow-lg"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> {trend.type}</div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end"><div className="bg-pink-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">{trend.viralScore} Viral</div><div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:bg-white/40"><Play fill="white" size={16} /></div></div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h4 className="text-xl font-black text-slate-800 mb-4 leading-tight">{trend.title}</h4>
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic"><Music size={14} className="text-indigo-500" /><span className="truncate font-semibold">{trend.audio}</span></div>
              <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed"><span className="font-bold text-indigo-600">AI Insight:</span> {trend.insight}</p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex -space-x-2">{trend.hashtags?.slice(0, 3).map((tag, j) => (<div key={j} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">#{tag.substring(0,2)}</div>))}</div>
                 <button onClick={() => onApplyTrend?.(trend)} className="flex items-center gap-2 text-pink-600 font-black text-xs uppercase tracking-wider hover:gap-3 transition-all">Apply to AI Script <ExternalLink size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendHunter;
