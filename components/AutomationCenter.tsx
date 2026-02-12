import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Search, 
  Filter, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  UserPlus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  SearchCheck, 
  Check, 
  X, 
  History as HistoryIcon, 
  Ban, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  Save,
  Plus,
  Send,
  ChevronDown,
  User,
  LayoutList
} from 'lucide-react';
import { IGAutomationItem, IGContact, ContactCategory, AutomationActionType } from '../types';

const AutomationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'contacts' | 'history'>('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [historyFilter, setHistoryFilter] = useState<AutomationActionType | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [tempReply, setTempReply] = useState('');
  
  // New ID search state for adding contacts
  const [newIdSearch, setNewIdSearch] = useState('');
  
  // Mock Contact Data
  const [contacts, setContacts] = useState<IGContact[]>([
    { id: 'c1', username: 'nike_india', category: 'business', avatar: 'https://picsum.photos/seed/nike/100/100' },
    { id: 'c2', username: 'rahul_vibe', category: 'friends', avatar: 'https://picsum.photos/seed/rahul/100/100' },
    { id: 'c3', username: 'skincare_guru', category: 'business', avatar: 'https://picsum.photos/seed/skin/100/100' },
    { id: 'c4', username: 'zara_lifestyle', category: 'business', avatar: 'https://picsum.photos/seed/zara/100/100' },
    { id: 'c5', username: 'amit_clicks', category: 'friends', avatar: 'https://picsum.photos/seed/amit/100/100' },
  ]);

  // Mock Interactions (Live Queue)
  const [items, setItems] = useState<IGAutomationItem[]>([
    { 
      id: '1', type: 'dm', user: 'nike_india', category: 'business', 
      message: 'Interested in a partnership for Q4.', 
      aiSuggestedReply: 'Thank you for reaching out. We are very interested. Could you please share the deck at partnerships@socialmind.ai?', 
      status: 'auto_sent', timestamp: '2m ago',
      url: 'https://www.instagram.com/direct/inbox/'
    },
    { 
      id: '2', type: 'comment', user: 'rahul_vibe', category: 'friends', 
      message: 'Bro, this reel is fire! 🔥', 
      aiSuggestedReply: 'Thanks man! Really glad you liked the edit. We should catch up soon! 🙌', 
      status: 'pending', timestamp: '10m ago',
      url: 'https://www.instagram.com/reels/C_X_X_X/'
    },
  ]);

  const [historyItems, setHistoryItems] = useState<IGAutomationItem[]>([
    { id: 'h1', type: 'like', user: 'nike_india', category: 'business', status: 'completed', timestamp: '5m ago', url: 'https://www.instagram.com/p/C-P1_abc/' },
    { id: 'h2', type: 'comment', user: 'skincare_guru', category: 'business', status: 'completed', timestamp: '1h ago', url: 'https://www.instagram.com/p/D-P1_xyz/' },
    { id: 'h3', type: 'dm', user: 'amit_clicks', category: 'friends', status: 'completed', timestamp: '3h ago', url: 'https://www.instagram.com/direct/' },
    { id: 'h4', type: 'like', user: 'zara_lifestyle', category: 'business', status: 'completed', timestamp: '1d ago', url: 'https://www.instagram.com/p/E-P1_zzz/' },
    { id: 'h5', type: 'block', user: 'spam_bot_99', category: 'business', status: 'completed', timestamp: '2d ago', url: '#' },
    { id: 'h6', type: 'block', user: 'fake_account_01', category: 'business', status: 'completed', timestamp: '3d ago', url: '#' },
  ]);

  const filteredContacts = useMemo(() => 
    contacts.filter(c => c.username.toLowerCase().includes(searchTerm.toLowerCase())),
    [contacts, searchTerm]
  );

  const filteredHistory = useMemo(() => {
    return historyItems.filter(item => {
      const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = historyFilter === 'all' || item.type === historyFilter;
      return matchesSearch && matchesType;
    });
  }, [historyItems, searchTerm, historyFilter]);

  const handleEditReply = (item: IGAutomationItem) => {
    setEditingReplyId(item.id);
    setTempReply(item.aiSuggestedReply || '');
  };

  const handleSaveReply = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, aiSuggestedReply: tempReply } : it));
    setEditingReplyId(null);
  };

  const handleApprove = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'replied' } : item));
    alert("Reply successfully sent!");
  };

  const handleDeleteContact = (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this contact from the automation list?");
    if (isConfirmed) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleUpdateCategory = (id: string, newCategory: ContactCategory) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, category: newCategory } : c));
  };

  const getCategoryBadge = (cat: ContactCategory) => {
    switch (cat) {
      case 'business': return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Briefcase size={10}/> Business</span>;
      case 'friends': return <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Users size={10}/> Friend</span>;
      default: return null;
    }
  };

  const handleAddContact = () => {
    if (!newIdSearch.trim()) return alert("Please enter an Instagram ID.");
    const usernameClean = newIdSearch.replace('@', '').trim();
    if (!usernameClean) return;
    
    const newContact: IGContact = {
      id: `c${Date.now()}`,
      username: usernameClean,
      category: 'business',
      avatar: `https://picsum.photos/seed/${usernameClean}/100/100`
    };
    setContacts(prev => [newContact, ...prev]);
    setNewIdSearch('');
    setIsAddModalOpen(false);
    alert(`Successfully added @${newContact.username} as a business contact.`);
  };

  const HistoryFilterTabs = () => (
    <div className="flex flex-wrap gap-2 mb-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
      {[
        { id: 'all', label: 'All Actions', icon: <LayoutList size={14} /> },
        { id: 'like', label: 'Likes', icon: <Heart size={14} /> },
        { id: 'comment', label: 'Comments', icon: <MessageCircle size={14} /> },
        { id: 'dm', label: 'DMs', icon: <Send size={14} /> },
        { id: 'block', label: 'Block List', icon: <Ban size={14} /> }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setHistoryFilter(tab.id as any)}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
            historyFilter === tab.id 
              ? 'bg-white text-pink-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
          {['queue', 'contacts', 'history'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Manager
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'contacts' ? "Filter contacts by ID..." : `Search ${activeTab}...`} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 shadow-sm" 
            />
          </div>
          {activeTab === 'contacts' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-3 bg-pink-600 text-white rounded-2xl shadow-lg hover:bg-pink-700 transition-all active:scale-95 flex items-center gap-2 flex-shrink-0"
            >
              <UserPlus size={20} /> <span className="hidden sm:inline text-sm font-bold">Add New ID</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'history' && <HistoryFilterTabs />}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><UserPlus className="text-pink-600" /> Add Contact ID</h3>
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instagram Username</label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text" 
                     value={newIdSearch} 
                     onChange={e => setNewIdSearch(e.target.value)} 
                     placeholder="@username" 
                     className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" 
                   />
                 </div>
               </div>
               <button onClick={handleAddContact} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">Add to Contacts</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {activeTab === 'queue' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interaction</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Response</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.length > 0 ? items.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="px-8 py-6">{item.type === 'dm' ? <div className="text-indigo-600 font-black text-[10px] uppercase flex gap-1"><MessageCircle size={14}/> DM</div> : <div className="text-pink-600 font-black text-[10px] uppercase flex gap-1"><Heart size={14}/> Comment</div>}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={`https://picsum.photos/seed/${item.user}/50/50`} className="w-9 h-9 rounded-full border shadow-sm" alt={item.user} />
                      <a href={`https://www.instagram.com/${item.user}/`} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-pink-600 transition-colors">@{item.user}</a>
                    </div>
                    {getCategoryBadge(item.category)}
                  </td>
                  <td className="px-8 py-6 max-w-xs"><p className="text-sm text-slate-600 line-clamp-2 italic">"{item.message}"</p><span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.timestamp}</span></td>
                  <td className="px-8 py-6">
                    {editingReplyId === item.id ? (
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <textarea value={tempReply} onChange={e => setTempReply(e.target.value)} className="w-full p-3 text-sm bg-white border border-pink-400 rounded-xl outline-none ring-2 ring-pink-50" rows={3} />
                        <button onClick={() => handleSaveReply(item.id)} className="absolute bottom-2 right-2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"><Save size={14}/></button>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 relative group-hover:bg-white transition-all">{item.aiSuggestedReply}</div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {item.status === 'pending' && (
                      <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleApprove(item.id)} className="p-3 bg-pink-600 text-white rounded-xl shadow-lg hover:bg-pink-700 transition-all"><Check size={18} /></button>
                        <button onClick={() => handleEditReply(item)} className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50"><Edit3 size={18} /></button>
                      </div>
                    )}
                    {(item.status === 'auto_sent' || item.status === 'replied') && <div className="text-emerald-500 flex items-center justify-end gap-1 font-black text-[10px] uppercase">Processed <CheckCircle2 size={16} /></div>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-20 text-slate-400 font-bold">No items in queue</td></tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'contacts' && (
          <div className="p-8">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-pink-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">All Contacts ({filteredContacts.length})</h3>
              </div>
              
              {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                <div key={contact.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-all group flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-4">
                    <img src={contact.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={contact.username} />
                    <div className="flex flex-col">
                      <a 
                        href={`https://www.instagram.com/${contact.username}/`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-black text-slate-800 text-base hover:text-pink-600 hover:underline transition-all flex items-center gap-1"
                      >
                        @{contact.username}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleUpdateCategory(contact.id, 'business')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                            contact.category === 'business' 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                          }`}
                        >
                          <Briefcase size={10}/> Business
                        </button>
                        <button 
                          onClick={() => handleUpdateCategory(contact.id, 'friends')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                            contact.category === 'friends' 
                              ? 'bg-pink-600 text-white shadow-sm' 
                              : 'bg-white text-slate-400 border border-slate-200 hover:border-pink-200 hover:text-pink-600'
                          }`}
                        >
                          <Users size={10}/> Friends
                        </button>
                      </div>
                      
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mt-1">Linked Oct 2024</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteContact(contact.id); }} 
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-100 flex items-center justify-center"
                      title="Remove Contact"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                  <SearchCheck size={48} className="opacity-20" />
                  <p className="font-bold">No contacts matching the criteria</p>
                  <button onClick={() => setSearchTerm('')} className="text-pink-600 text-sm font-black uppercase">Clear Search</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Result</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.length > 0 ? filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    {h.type === 'like' && <div className="text-red-500 font-black text-[10px] uppercase flex items-center gap-1"><Heart size={14} fill="currentColor"/> Liked</div>}
                    {h.type === 'comment' && <div className="text-pink-600 font-black text-[10px] uppercase flex items-center gap-1"><MessageCircle size={14}/> Commented</div>}
                    {h.type === 'dm' && <div className="text-indigo-600 font-black text-[10px] uppercase flex items-center gap-1"><Send size={14}/> DM Sent</div>}
                    {h.type === 'block' && <div className="text-slate-600 font-black text-[10px] uppercase flex items-center gap-1"><Ban size={14}/> Blocked</div>}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <img src={`https://picsum.photos/seed/${h.user}/30/30`} className="w-6 h-6 rounded-full border" alt={h.user} />
                      <a href={`https://www.instagram.com/${h.user}/`} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 text-sm hover:text-pink-600">@{h.user}</a>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                      <CheckCircle2 size={14} /> Completed
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-bold">{h.timestamp}</td>
                  <td className="px-8 py-6 text-right">
                    {h.url && h.url !== '#' ? (
                      <a href={h.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-pink-600 transition-colors inline-block">
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <span className="p-2 text-slate-200"><ExternalLink size={16} /></span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-20 text-slate-400 font-bold">No history available matching this filter</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AutomationCenter;