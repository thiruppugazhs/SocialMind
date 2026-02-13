import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Edit3,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Smile,
  Type,
  ImagePlus,
  Loader2,
  AlertCircle,
  Zap,
  Send,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Hash,
  AtSign,
  Link2,
  Volume2,
  Music
} from 'lucide-react';
import { generateInstagramContent } from '../services/apiService';

type ContentType = 'post' | 'reel';

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

  // Demo data removed - will be populated from API
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([
    { id: '4', type: 'reel', date: new Date(), status: 'present', title: 'Create New Post' },
  ]);

  const handleTimelineClick = (item: TimelineItem) => {
    if (item.status === 'present') {
      setCaption(item.caption || '');
      setMediaList(item.media || []);
      setActiveMediaIndex(0);
    } else {
      setEditingItemId(item.id);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setMediaList(prev => [...prev, url]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList(prev => prev.filter((_, i) => i !== index));
    if (activeMediaIndex >= mediaList.length - 1) {
      setActiveMediaIndex(Math.max(0, mediaList.length - 2));
    }
  };

  const handleGenerateCaption = async () => {
    if (!caption.trim()) return;
    setAiLoading(true);
    try {
      const result = await generateInstagramContent({
        topic: caption,
        target: tag || 'General audience',
        tone: 'Professional'
      });
      if (result) {
        setCaption(result.caption);
      }
    } catch (error) {
      console.error('Error generating caption:', error);
    }
    setAiLoading(false);
  };

  const handleSchedulePost = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      setCaption('');
      setMediaList([]);
      setTag('');
      setLocation('');
      setMusic('');
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-10 rounded-[3rem] text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Music size={28} className="text-cyan-200" />
          <h2 className="text-4xl font-black">Content Scheduler</h2>
        </div>
        <p className="text-blue-100 font-medium">Schedule your posts, reels, and stories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
            <h3 className="text-2xl font-black text-slate-800 mb-6">Create & Edit</h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-black uppercase text-slate-600 mb-2 block">Content Type</label>
                <div className="flex gap-3">
                  {(['post', 'reel'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className={`px-6 py-3 rounded-xl font-black capitalize transition-all ${
                        contentType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-black uppercase text-slate-600 mb-2 block">Media</label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors"
                >
                  <ImagePlus size={32} className="text-blue-500" />
                  <span className="font-black text-slate-700">Upload Images or Videos</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />

                {mediaList.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {mediaList.map((media, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                        <span className="text-sm font-bold text-slate-700">Media {idx + 1}</span>
                        <button
                          onClick={() => handleRemoveMedia(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-black uppercase text-slate-600 mb-2 block">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none h-32"
                />
                <button
                  onClick={handleGenerateCaption}
                  disabled={aiLoading}
                  className="mt-3 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-black hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  Generate with AI
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-600 mb-2 block">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-600 mb-2 block">Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="@mention"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSchedulePost}
                disabled={!caption.trim() || isSharing}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg">
            <h3 className="text-xl font-black text-slate-800 mb-4">Schedule</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 mb-2 block">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={scheduleHour}
                  onChange={(e) => setScheduleHour(e.target.value)}
                  className="w-16 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-slate-400 font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={scheduleMin}
                  onChange={(e) => setScheduleMin(e.target.value)}
                  className="w-16 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <select
                  value={schedulePeriod}
                  onChange={(e) => setSchedulePeriod(e.target.value as 'AM' | 'PM')}
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg">
            <h3 className="text-lg font-black text-slate-800 mb-4">Settings</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-slate-50 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={hideLikes}
                  onChange={(e) => setHideLikes(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-slate-700">Hide Like Count</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-slate-50 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={disableComments}
                  onChange={(e) => setDisableComments(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-slate-700">Disable Comments</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostScheduler;
