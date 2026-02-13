import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Clapperboard, 
  Music, 
  UserPlus, 
  MapPin, 
  Users, 
  PenTool, 
  Sparkles, 
  Upload, 
  X,
  Smile,
  Check,
  Calendar,
  Clock,
  Layout,
  Loader2,
  Zap,
  ChevronRight,
  MoreHorizontal,
  PlusSquare,
  ChevronLeft,
  Eye,
  Maximize2,
  Heart,
  History,
  Edit2,
  Save,
  Send,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2
} from 'lucide-react';
import { generateInstagramContent } from '../services/apiService';

type ContentType = 'post' | 'reel';

const EMOJIS = [
  '❤️', '🙌', '🔥', '✨', '😍', '📸', '🚀', '💯', '📍', '✅', '👑', '🧿',
  '🌟', '💪', '💙', '💜', '🖤', '🤍', '🤎', '🧡', '💛', '💚', '💎', '🌈',
  '🎉', '🎈', '🎁', '🎂', '🥂', '🍿', '🎬', '🎧', '🎸', '🎨', '💼', '💻',
  '🌸', '🌿', '🌊', '☀️', '🌙', '☁️', '⚡', '❄️', '🍎', '🍓', '🍕', '🍩',
  '🐶', '🐱', '🦄', '🌍', '✈️', '🏝️', '🏠', '💡', '⏰', '📌', '📎', '💬'
];

interface TimelineItem {
  id: string;
  type: ContentType;
  date: Date;
  status: 'past' | 'present' | 'future';
  title: string;
  caption?: string;
  media?: string[];
  location?: string;
  tag?: string;
  music?: string;
  collab?: string;
}

interface Props {
  initialData?: any;
  onClearInitial?: () => void;
}

const PostScheduler: React.FC<Props> = ({ initialData, onClearInitial }) => {
  const [contentType, setContentType] = useState<ContentType>('post');
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [music, setMusic] = useState('');
  const [collab, setCollab] = useState('');
  
  // Schedule state
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleHour, setScheduleHour] = useState('12');
  const [scheduleMin, setScheduleMin] = useState('00');
  const [schedulePeriod, setSchedulePeriod] = useState<'AM' | 'PM'>('PM');
  
  const [advSettings, setAdvSettings] = useState(false);
  const [hideLikes, setHideLikes] = useState(false);
  const [disableComments, setDisableComments] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setContentType(initialData.type === 'Reel Format' ? 'reel' : 'post');
      setCaption(`Trend: ${initialData.title}\n\n${initialData.insight}\n\n${initialData.hashtags?.map((h:string) => `#${h}`).join(' ')}`);
      setMusic(initialData.audio || '');
      onClearInitial?.();
    }
  }, [initialData]);

  const [timelineData, setTimelineData] = useState<TimelineItem[]>([
    { 
      id: '1', type: 'reel', date: new Date(Date.now() - 86400000 * 3), status: 'past', title: 'Summer Vlog',
      caption: 'Exploring the hidden gems of the city! 🏙️ #SummerVibes',
      media: ['https://picsum.photos/seed/vlog1/1080/1920'],
      location: 'Mumbai, India',
      music: 'Summer Chill - Lofi'
    },
    { 
      id: '2', type: 'post', date: new Date(Date.now() - 86400000 * 2), status: 'past', title: 'New Product Launch',
      caption: 'Our new organic serum is finally here! ✨ Link in bio.',
      media: ['https://picsum.photos/seed/product/1080/1080'],
      location: 'Global Store'
    },
    { id: '4', type: 'reel', date: new Date(), status: 'present', title: 'Create New Post' },
    { 
      id: '5', type: 'post', date: new Date(Date.now() + 86400000), status: 'future', title: 'Scheduled: Daily Tip',
      caption: 'Daily Tip: Always wear sunscreen! ☀️ #SkincareTips',
      media: ['https://picsum.photos/seed/tip/1080/1080'],
      tag: '@skincare_expert',
      location: 'Dermatology Clinic'
    },
  ]);

  const handleTimelineClick = (item: TimelineItem) => {
    if (item.status === 'present') {
      setEditingItemId(null);
      setContentType('post');
      setMediaList([]);
      setCaption('');
      setTag('');
      setLocation('');
      setMusic('');
      setCollab('');
      setScheduleDate('');
      return;
    }

    setEditingItemId(item.id);
    setContentType(item.type);
    setMediaList(item.media || []);
    setCaption(item.caption || '');
    setTag(item.tag || '');
    setLocation(item.location || '');
    setMusic(item.music || '');
    setCollab(item.collab || '');
    
    if (item.date) {
      const d = item.date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setScheduleDate(`${year}-${month}-${day}`);
      
      let hours = d.getHours();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      setScheduleHour(String(hours).padStart(2, '0'));
      setScheduleMin(String(d.getMinutes()).padStart(2, '0'));
      setSchedulePeriod(period);
    }
    
    setActiveMediaIndex(0);
    document.getElementById('main-editor-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = () => {
    if (!caption && mediaList.length === 0) return alert("Add some content first!");
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      alert(editingItemId ? "Successfully updated on Instagram!" : "Successfully posted to Instagram!");
    }, 2000);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const limit = contentType === 'post' ? 20 : 1;
    const remainingSlots = limit - mediaList.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaList(prev => [...prev, reader.result as string].slice(0, limit));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateAI = async () => {
    if (!caption && mediaList.length === 0) return alert("Provide context for AI.");
    setAiLoading(true);
    const result = await generateInstagramContent({ topic: caption, target: "Followers", tone: "Trendy" });
    if (result) setCaption(result.caption + '\n\n' + result.hashtags.map(h => `#${h}`).join(' '));
    setAiLoading(false);
  };

  const IGMenuItem = ({ icon: Icon, label, value, state, setState, placeholder, type = 'text', children }: any) => {
    const isEditing = activeField === label;
    return (
      <div className="border-b border-slate-100 last:border-none">
        <button onClick={() => setActiveField(isEditing ? null : label)} className="w-full flex items-center justify-between py-4 hover:bg-slate-50 transition-colors px-4 text-left">
          <div className="flex items-center gap-4"><Icon size={20} className="text-slate-700" /><span className="text-sm font-medium text-slate-800">{label}</span></div>
          <div className="flex items-center gap-2 overflow-hidden max-w-[150px]"><span className="text-xs text-blue-500 font-bold truncate">{state || value || ''}</span><ChevronRight size={16} className={`text-slate-300 transition-transform ${isEditing ? 'rotate-90' : ''}`} /></div>
        </button>
        {isEditing && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            {children ? children : (
              <input type={type} autoFocus value={state} onChange={(e) => setState(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Preview Modal Inlined to fix mounting issues */}
      {showPreviewModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowPreviewModal(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-6 right-6 z-20 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Instagram Mockup Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <img src="https://picsum.photos/seed/user/100/100" className="w-8 h-8 rounded-full border" alt="Avatar" />
              <div className="flex-1">
                <p className="text-xs font-black text-slate-900 leading-none">socialmind_creator</p>
                {location && <p className="text-[10px] text-slate-500 mt-0.5">{location}</p>}
              </div>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>

            {/* Media Content */}
            <div className={`relative bg-slate-100 ${contentType === 'reel' ? 'aspect-[9/16]' : 'aspect-square'}`}>
              {mediaList.length > 0 ? (
                <img src={mediaList[activeMediaIndex]} className="w-full h-full object-cover" alt="Post Content" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={48} />
                  <p className="text-[10px] font-black uppercase mt-2">No Media Uploaded</p>
                </div>
              )}
              
              {contentType === 'reel' && (
                 <div className="absolute bottom-16 left-4 right-12 text-white drop-shadow-lg pointer-events-none">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm">socialmind_creator</span>
                      <button className="px-2 py-0.5 border border-white rounded-md text-[10px] font-bold">Follow</button>
                   </div>
                   <p className="text-xs line-clamp-2 mb-2">{caption || "Your Reel Caption Here..."}</p>
                   {music && <div className="flex items-center gap-2 text-xs"><Music size={12}/> {music}</div>}
                 </div>
              )}
            </div>

            {/* Interactions */}
            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Heart size={24} className="text-slate-800" />
                    <MessageCircle size={24} className="text-slate-800" />
                    <Share2 size={24} className="text-slate-800" />
                  </div>
                  <Bookmark size={24} className="text-slate-800" />
               </div>
               {!hideLikes && <p className="text-xs font-black text-slate-900">Liked by others</p>}
               <div className="space-y-1">
                 <span className="text-xs font-black text-slate-900 mr-2">socialmind_creator</span>
                 <span className="text-xs text-slate-800 whitespace-pre-wrap">{caption || "Write a compelling caption to see it here!"}</span>
               </div>
               {disableComments && <p className="text-[10px] text-slate-400">Comments are disabled.</p>}
            </div>

            {/* CTA Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
               <button 
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg"
               >
                 Looks Great!
               </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline */}
      <div className="mb-8 overflow-hidden bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl"><Calendar size={20} /></div>
          <div><h3 className="text-lg font-black text-slate-800">Content Timeline</h3><p className="text-xs text-slate-400 font-medium">Manage past and upcoming scheduled content</p></div>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {timelineData.map((item) => (
            <div key={item.id} onClick={() => handleTimelineClick(item)} className={`flex-shrink-0 w-36 rounded-3xl p-4 flex flex-col items-center justify-between transition-all border-2 cursor-pointer group hover:scale-105 relative overflow-hidden ${item.status === 'past' ? 'bg-slate-50 opacity-60' : item.status === 'present' ? 'bg-gradient-to-br from-pink-50 to-indigo-50 border-pink-500 shadow-lg' : 'bg-white border-slate-100'}`}>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 text-white flex-col gap-1"><Edit2 size={24} /><span className="text-[10px] font-black uppercase">Edit</span></div>
              <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-400">{item.date.toLocaleDateString('en-US', { weekday: 'short' })}</p><p className="text-sm font-bold text-slate-800">{item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p></div>
              <div className={`my-4 p-2 rounded-xl ${item.status === 'present' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{item.type === 'post' ? <ImageIcon size={20} /> : <Clapperboard size={20} />}</div>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'past' ? 'bg-slate-200' : 'bg-indigo-50 text-indigo-600'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Header */}
      <div id="main-editor-section" className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-100 sticky top-0 z-40 shadow-sm">
        <button onClick={() => { setEditingItemId(null); setCaption(''); setMediaList([]); }} className="text-slate-800 p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
        <h2 className="text-lg font-black tracking-tight">{editingItemId ? `Edit ${contentType}` : `New ${contentType}`}</h2>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowPreviewModal(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 hover:bg-slate-100"
           >
             <Eye size={16} /> Preview
           </button>
           <button onClick={handleShare} disabled={isSharing} className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-pink-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
             {isSharing ? <Loader2 size={18} className="animate-spin" /> : editingItemId ? <><Save size={18}/> Update</> : <><Send size={18}/> Share</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 w-fit mx-auto shadow-sm">
            {(['post', 'reel'] as const).map((type) => (
              <button key={type} onClick={() => setContentType(type)} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${contentType === type ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                {type === 'post' ? <ImageIcon size={14} className="inline mr-2"/> : <Clapperboard size={14} className="inline mr-2"/>}{type}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            <div className={`relative bg-slate-50 ${contentType === 'reel' ? 'aspect-[9/16]' : 'aspect-square'}`}>
              {mediaList.length > 0 ? (
                <>
                  <img src={mediaList[activeMediaIndex]} className="w-full h-full object-cover animate-in fade-in" alt="Media" />
                  {activeMediaIndex > 0 && <button onClick={() => setActiveMediaIndex(prev => prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white"><ChevronLeft size={24}/></button>}
                  {activeMediaIndex < mediaList.length - 1 && <button onClick={() => setActiveMediaIndex(prev => prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white"><ChevronRight size={24}/></button>}
                  
                  <button 
                    onClick={() => setMediaList([])}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                  <div className="p-10 bg-white rounded-[2rem] shadow-inner border border-slate-100"><PlusSquare size={60} className="opacity-10" /></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Upload {contentType}</p>
                </div>
              )}
            </div>
            {mediaList.length === 0 && <div className="p-8"><button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl"><Upload size={20} /> Select from Device</button></div>}
            <input type="file" hidden multiple ref={fileInputRef} accept={contentType === 'reel' ? 'video/*' : 'image/*'} onChange={handleMediaUpload} />
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <img src="https://picsum.photos/seed/user/100/100" className="w-12 h-12 rounded-full border" alt="Profile" />
              <div className="flex-1 relative bg-white rounded-2xl p-4 border border-slate-200 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-50 transition-all shadow-sm">
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-48 py-2 text-base text-black placeholder-slate-400 border-none outline-none focus:ring-0 resize-none font-bold leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2 relative border-t border-slate-100 pt-4">
                  <div className="relative">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-slate-500 hover:text-pink-500 transition-colors p-2"><Smile size={24} /></button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-wrap gap-2 w-72 h-48 overflow-y-auto no-scrollbar z-50 animate-in zoom-in">
                        {EMOJIS.map(e => <button key={e} onClick={() => { setCaption(c => c + e); setShowEmojiPicker(false); }} className="text-2xl hover:scale-125 transition-transform p-1">{e}</button>)}
                      </div>
                    )}
                  </div>
                  <button onClick={handleGenerateAI} disabled={aiLoading} className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${aiLoading ? 'bg-slate-100 text-slate-400' : 'bg-gradient-to-tr from-pink-500 to-violet-600 text-white shadow-lg hover:scale-105 active:scale-95'}`}>{aiLoading ? <Loader2 size={14} className="animate-spin" /> : <><Sparkles size={14} /> AI Refresh</>}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">Settings</div>
            <IGMenuItem icon={UserPlus} label="Tag People" state={tag} setState={setTag} placeholder="Add @username" />
            <IGMenuItem icon={Users} label="Add Collaborator" state={collab} setState={setCollab} placeholder="Search for collaborator..." />
            <IGMenuItem icon={MapPin} label="Location" state={location} setState={setLocation} placeholder="Search location" />
            <IGMenuItem icon={Music} label="Music" state={music} setState={setMusic} placeholder="Add audio track" />
            
            <IGMenuItem 
              icon={Clock} 
              label="Schedule Post" 
              state={scheduleDate ? `${scheduleDate} ${scheduleHour}:${scheduleMin} ${schedulePeriod}` : ''} 
              placeholder="Choose Date & Time"
            >
               <div className="space-y-6 p-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="date" 
                         value={scheduleDate} 
                         onChange={(e) => setScheduleDate(e.target.value)}
                         className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 font-bold"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Time</label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={scheduleHour} 
                        onChange={(e) => setScheduleHour(e.target.value)}
                        className="flex-1 px-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span className="font-bold">:</span>
                      <select 
                        value={scheduleMin} 
                        onChange={(e) => setScheduleMin(e.target.value)}
                        className="flex-1 px-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(['AM', 'PM'] as const).map(p => (
                          <button 
                            key={p} 
                            onClick={() => setSchedulePeriod(p)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-black transition-all ${schedulePeriod === p ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-400'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 flex items-start gap-3">
                    <Sparkles size={16} className="text-pink-600 mt-0.5" />
                    <p className="text-[10px] font-bold text-pink-700 leading-relaxed">
                      Gemini's Predictive Analysis:<br/>
                      <span className="font-black">Best performance at 6:45 PM Today</span>
                    </p>
                  </div>
               </div>
            </IGMenuItem>
            
            <button onClick={() => setAdvSettings(!advSettings)} className="w-full flex items-center justify-between py-5 px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4"><MoreHorizontal size={20} className="text-slate-700" /><span className="text-sm font-medium text-slate-800">Advanced Settings</span></div>
              <ChevronRight size={16} className={`text-slate-300 transition-transform ${advSettings ? 'rotate-90' : ''}`} />
            </button>
            {advSettings && (
              <div className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2">
                 <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Hide like counts</span><button onClick={() => setHideLikes(!hideLikes)} className={`w-10 h-5 rounded-full relative transition-colors ${hideLikes ? 'bg-blue-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${hideLikes ? 'right-1' : 'left-1'}`} /></button></div>
                 <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Turn off comments</span><button onClick={() => setDisableComments(!disableComments)} className={`w-10 h-5 rounded-full relative transition-colors ${disableComments ? 'bg-blue-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${disableComments ? 'right-1' : 'left-1'}`} /></button></div>
              </div>
            )}
          </div>
          
          <div className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Ready to Launch?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostScheduler;