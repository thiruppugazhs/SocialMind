import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Play, 
  Music, 
  Hash, 
  ExternalLink, 
  Sparkles, 
  Search, 
  Loader2, 
  Info, 
  TrendingUp, 
  Copy, 
  Check, 
  Volume2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { getTrendingTrends } from '../services/apiService';
import { IGTrend } from '../types';

interface Props {
  onApplyTrend?: (trend: IGTrend) => void;
}

const TrendHunter: React.FC<Props> = ({ onApplyTrend }) => {
  const [niche, setNiche] = useState('Skincare & Lifestyle');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  const [clusterCopied, setClusterCopied] = useState(false);
  
  // Demo data removed - will be populated from API
  const [trends, setTrends] = useState<IGTrend[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Sync audio tracks when trends update from AI
  useEffect(() => {
    const newTracks = trends.map(t => ({ title: t.audio, trend: 'Rising Fast' }));
    setAudioTracks(newTracks);
  }, [trends]);

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

  const copyToClipboard = (text: string, isCluster = false) => {
    navigator.clipboard.writeText(text);
    if (isCluster) {
      setClusterCopied(true);
      setTimeout(() => setClusterCopied(false), 2000);
    } else {
      setCopiedHashtag(text);
      setTimeout(() => setCopiedHashtag(null), 2000);
    }
  };

  const handleLoadMoreTracks = () => {
    setIsLoadingMore(true);
    // Simulate fetching more trending audio based on current niche
    setTimeout(() => {
      const moreTracks = [
        { title: `${niche} Mood - Instrumental`, trend: 'New' },
        { title: 'Urban Chill (Remix)', trend: 'Trending' },
        { title: 'Product Showcase Beats', trend: 'Popular' }
      ];
      setAudioTracks(prev => [...prev, ...moreTracks]);
      setIsLoadingMore(false);
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Growth Engine Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-pink-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
          <Flame size={300} strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Market Scanning</span>
            </div>
            <div className="bg-pink-600/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-pink-500/30 flex items-center gap-2">
              <Sparkles size={14} className="text-pink-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-300">Predictive AI Active</span>
            </div>
          </div>
          
          <h2 className="text-6xl font-black mb-6 tracking-tight leading-tight">
            Trend <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Hunter</span>
          </h2>
          <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-2xl font-medium">
            Analyze the digital pulse of your niche. Our Gemini-powered engine detects viral patterns, audio hooks, and high-impact metadata before they peak.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group/input">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-pink-400 transition-colors" size={24} />
              <input 
                type="text" 
                value={niche} 
                onChange={(e) => setNiche(e.target.value)} 
                placeholder="Target Niche (e.g. Luxury Travel, Crypto, Fitness...)" 
                className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/10 transition-all font-bold text-lg placeholder:text-slate-600" 
              />
            </div>
            <button 
              onClick={handleScan} 
              disabled={isScanning} 
              className="px-10 py-5 bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isScanning ? <Loader2 className="animate-spin" size={24} /> : <><Flame size={24} /> Hunt Trends</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Viral Content Formats */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-2xl font-black text-slate-800">Viral Content Formats</h3>
              <p className="text-sm text-slate-500 font-medium">Recommended posting styles for {niche}</p>
            </div>
            <div className="flex items-center gap-2 text-pink-600 bg-pink-50 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
              <Trophy size={14} /> Top Scored
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trends.map((trend, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="h-56 relative overflow-hidden bg-slate-900">
                  <img src={`https://picsum.photos/seed/trend${i}-${niche}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Trend" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 shadow-xl">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" /> {trend.type}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-pink-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                      <TrendingUp size={14} /> {trend.viralScore} Viral
                    </div>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-colors">
                      <Play fill="white" size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-pink-600 transition-colors">{trend.title}</h4>
                  
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <Music size={14} />
                    </div>
                    <span className="text-xs font-bold text-indigo-900 truncate flex-1">{trend.audio}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    <span className="font-black text-slate-800">Strategy:</span> {trend.insight}
                  </p>

                  <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {trend.hashtags?.slice(0, 3).map((tag, j) => (
                        <div key={j} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                          #{tag.substring(0,1)}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => onApplyTrend?.(trend)} 
                      className="flex items-center gap-2 text-pink-600 font-black text-xs uppercase tracking-[0.1em] group/btn hover:translate-x-1 transition-all"
                    >
                      Use Script <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Trending Audio & Hashtags */}
        <div className="lg:col-span-4 space-y-10">
          {/* Audio Library */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                <Volume2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Trending Audio</h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {audioTracks.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-slate-50 hover:border-violet-200 hover:shadow-md rounded-2xl transition-all group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Music size={18} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-black text-slate-800 truncate">{t.title}</p>
                      <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{t.trend}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-violet-600 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleLoadMoreTracks}
              disabled={isLoadingMore}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl hover:text-slate-600 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              {isLoadingMore ? <Loader2 size={14} className="animate-spin" /> : "Load More Tracks"}
            </button>
          </div>

          {/* Hashtag Clusters */}
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-600/20 blur-[60px]" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-pink-600 text-white rounded-2xl shadow-lg shadow-pink-900/40">
                <Hash size={24} />
              </div>
              <h3 className="text-xl font-black text-white">Viral Hashtags</h3>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              {hashtags.map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => copyToClipboard(`#${tag}`)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    copiedHashtag === `#${tag}` 
                      ? 'bg-emerald-500 border-emerald-400 text-white' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {copiedHashtag === `#${tag}` ? <Check size={14} /> : `#${tag}`}
                </button>
              ))}
            </div>

            <div className="pt-4 relative z-10">
              <button 
                onClick={() => copyToClipboard(hashtags.map(t => `#${t}`).join(' '), true)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
                  clusterCopied 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-white/10 text-white border-white/5 hover:bg-white/20'
                }`}
              >
                {clusterCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Cluster to Clipboard</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendHunter;