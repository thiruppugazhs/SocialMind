import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Zap, 
  BarChart3, 
  Flame, 
  ShieldCheck,
  Instagram,
  MessageSquareCode,
  X,
  ChevronRight,
  Settings,
  ArrowLeft,
  Smartphone,
  Fingerprint,
  Key,
  Eye,
  Clock,
  Loader2,
  Shield,
  ChevronLeft,
  Power,
  GripVertical,
  Mail,
  Users
} from 'lucide-react';
import { View, IGTrend } from './types';
import PlatformSelector from './components/PlatformSelector';
import IGDashboard from './components/IGDashboard';
import PostScheduler from './components/PostScheduler';
import AutomationCenter from './components/AutomationCenter';
import AnalyticsView from './components/AnalyticsView';
import TrendHunter from './components/TrendHunter';
import GeminiAssistant from './components/GeminiAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('platform-selector');
  const [isIGLinked, setIsIGLinked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [activeSubSetting, setActiveSubSetting] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sidebar Resize Logic
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 480) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // State to pass trend data to scheduler
  const [pendingTrend, setPendingTrend] = useState<Partial<IGTrend> | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (token) {
          setAccessToken(token);
          setIsIGLinked(true);
          setCurrentView('ig-dashboard');
          try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } catch (e) {
            console.warn('URL cleaning skipped');
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLoginSuccess = (token?: string) => {
    if (token) setAccessToken(token);
    setIsIGLinked(true);
    setCurrentView('ig-dashboard');
  };

  const handleLogout = () => {
    setAccessToken(null);
    setIsIGLinked(false);
    setCurrentView('platform-selector');
    setShowProfileSettings(false);
    setActiveSubSetting(null);
    try { window.location.hash = ''; } catch (e) {}
  };

  const handleApplyTrend = (trend: IGTrend) => {
    setPendingTrend(trend);
    setCurrentView('ig-scheduler');
  };

  const renderSidebarItem = (label: string, icon: React.ReactNode, view: View) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {sidebarWidth > 180 && <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
    </button>
  );

  const SettingPanelHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
      <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      <h2 className="text-xl font-black text-slate-800">{title}</h2>
    </div>
  );

  const ProfileSettingsModal = () => {
    const [email, setEmail] = useState('hello@socialmind.ai');
    const [phone, setPhone] = useState('+91 9876543210');
    const [otp, setOtp] = useState('');
    const [verificationStep, setVerificationStep] = useState<'input' | 'otp'>('input');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [activeSecurityView, setActiveSecurityView] = useState<string | null>(null);

    const startProcessing = (callback: () => void) => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        callback();
      }, 1500);
    };

    const handleVerifyOtp = () => {
      if (otp.length === 6) {
        startProcessing(() => {
          alert("Verification Successful! Your details have been updated.");
          setVerificationStep('input');
          setActiveSubSetting(null);
          setOtp('');
        });
      } else {
        alert("Please enter a valid 6-digit code.");
      }
    };

    const renderSecurityDetail = () => {
      switch (activeSecurityView) {
        case '2fa':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 p-2">
              <button onClick={() => setActiveSecurityView(null)} className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-6 hover:text-slate-600"><ChevronLeft size={16}/> Back</button>
              <h3 className="text-lg font-black text-slate-800 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 mb-6">We'll ask for a login code in addition to your password on new devices.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">Authentication App</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recommended</span>
                  </div>
                  <button className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-xl text-xs font-black">Active</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">Text Message (SMS)</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{phone}</span>
                  </div>
                  <button className="px-4 py-1.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-black">Disabled</button>
                </div>
              </div>
            </div>
          );
        case 'login':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 p-2">
              <button onClick={() => setActiveSecurityView(null)} className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-6 hover:text-slate-600"><ChevronLeft size={16}/> Back</button>
              <h3 className="text-lg font-black text-slate-800 mb-6">Where You're Logged In</h3>
              <div className="space-y-3">
                {[
                  { device: 'iPhone 15 Pro', loc: 'Mumbai, India', active: true, time: 'Online now' },
                  { device: 'Windows PC • Chrome', loc: 'Bangalore, India', active: false, time: 'Logged in Oct 24' },
                  { device: 'MacBook Pro', loc: 'Delhi, India', active: false, time: 'Logged in Oct 20' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 rounded-lg text-slate-500"><Smartphone size={16}/></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{s.device}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.loc} • {s.time}</p>
                      </div>
                    </div>
                    {s.active ? <span className="text-emerald-500 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-full uppercase">Current</span> : <button className="text-red-500 text-[10px] font-black hover:bg-red-50 px-2 py-1 rounded-full transition-colors">LOGOUT</button>}
                  </div>
                ))}
              </div>
            </div>
          );
        case 'password':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 p-2">
              <button onClick={() => setActiveSecurityView(null)} className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-6 hover:text-slate-600"><ChevronLeft size={16}/> Back</button>
              <h3 className="text-lg font-black text-slate-800 mb-6">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" />
                </div>
                <button 
                  onClick={() => startProcessing(() => { alert("Password updated successfully!"); setActiveSecurityView(null); })}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
                </button>
              </div>
            </div>
          );
        default:
          return (
            <div className="space-y-1">
              {[
                { id: '2fa', label: 'Two-Factor Authentication', icon: <Shield size={18} className="text-blue-500" />, status: 'Enabled' },
                { id: 'login', label: 'Login Activity', icon: <Clock size={18} className="text-slate-500" />, status: '3 Sessions' },
                { id: 'password', label: 'Password Change', icon: <Key size={18} className="text-amber-500" />, status: '90 days ago' },
                { id: 'bio', label: 'Biometric Access', icon: <Fingerprint size={18} className="text-indigo-500" />, status: 'Setup Required' }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => item.id !== 'bio' ? setActiveSecurityView(item.id) : alert("Biometric setup initiated... Please use your device's fingerprint or face ID when prompted.")}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 group-hover:bg-white rounded-xl shadow-sm transition-colors">{item.icon}</div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{item.status}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          );
      }
    };

    const renderSubSetting = () => {
      switch (activeSubSetting) {
        case 'mobile':
        case 'email':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 h-full">
              <SettingPanelHeader title={activeSubSetting === 'mobile' ? "Change Mobile Number" : "Change Email"} onBack={() => { setActiveSubSetting(null); setVerificationStep('input'); }} />
              <div className="p-8 space-y-6">
                {verificationStep === 'input' ? (
                  <>
                    <p className="text-sm text-slate-500 font-medium text-center">We'll send a 6-digit verification code to your new {activeSubSetting}.</p>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New {activeSubSetting === 'mobile' ? 'Mobile Number' : 'Email Address'}</label>
                        <div className="relative">
                          {activeSubSetting === 'mobile' ? <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
                          <input 
                            type="text" 
                            value={activeSubSetting === 'mobile' ? phone : email} 
                            onChange={(e) => activeSubSetting === 'mobile' ? setPhone(e.target.value) : setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold"
                            placeholder={activeSubSetting === 'mobile' ? '+91 98765 43210' : 'new@example.com'}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => startProcessing(() => setVerificationStep('otp'))}
                        className={`w-full py-4 ${activeSubSetting === 'mobile' ? 'bg-indigo-600' : 'bg-pink-600'} text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2`}
                      >
                        {isProcessing ? <Loader2 size={20} className="animate-spin" /> : 'Send Verification Code'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-in zoom-in space-y-8 text-center">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 inline-block mx-auto mb-2"><Key size={40} className="text-pink-500" /></div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-800">Verification Required</h3>
                      <p className="text-sm text-slate-500">Enter the 6-digit code sent to <span className="font-bold text-slate-800">{activeSubSetting === 'mobile' ? phone : email}</span></p>
                    </div>
                    <div className="max-w-[280px] mx-auto">
                      <input 
                        type="text" 
                        maxLength={6}
                        autoFocus
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setOtp(val);
                        }}
                        className="w-full text-center tracking-[0.8em] text-3xl font-black py-4 border-b-2 border-slate-300 outline-none focus:border-pink-500 transition-colors bg-transparent placeholder:text-slate-100"
                      />
                    </div>
                    <div className="pt-4 space-y-4">
                      <button 
                        onClick={handleVerifyOtp}
                        disabled={isProcessing || otp.length !== 6}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 flex items-center justify-center"
                      >
                        {isProcessing ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Change'}
                      </button>
                      <button onClick={() => setVerificationStep('input')} className="text-xs font-bold text-slate-400 hover:text-pink-600 transition-colors">Didn't get the code? <span className="underline">Change details</span></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        case 'download':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 h-full">
              <SettingPanelHeader title="Download Information" onBack={() => setActiveSubSetting(null)} />
              <div className="p-8 space-y-8 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <Clock size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-800">Request Data Copy</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">Get a secure archive of all your content, metrics, and automation history.</p>
                </div>
                
                {downloadProgress > 0 ? (
                  <div className="space-y-4">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {downloadProgress < 100 ? `Packaging Data... ${downloadProgress}%` : 'Archive Ready!'}
                    </p>
                    {downloadProgress === 100 && (
                      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 animate-in bounce-in">
                         <Power size={20} /> Download .ZIP (2.4 MB)
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      let progress = 0;
                      const interval = setInterval(() => {
                        progress += 5;
                        setDownloadProgress(progress);
                        if (progress >= 100) clearInterval(interval);
                      }, 100);
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all"
                  >
                    Generate Data Archive
                  </button>
                )}
              </div>
            </div>
          );
        case 'security':
          return (
            <div className="animate-in slide-in-from-right-4 duration-300 h-full">
              <SettingPanelHeader title="Security & Privacy" onBack={() => { setActiveSubSetting(null); setActiveSecurityView(null); }} />
              <div className="p-4">
                {renderSecurityDetail()}
              </div>
            </div>
          );
        default:
          return (
            <div className="animate-in fade-in duration-300 h-full">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Settings size={20} className="text-slate-400" /> Settings
                </h2>
                <button 
                  onClick={() => setShowProfileSettings(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-2 overflow-y-auto max-h-[70vh] no-scrollbar">
                <div className="p-4 flex items-center gap-4 border-b border-slate-100 mb-2">
                  <img src="https://picsum.photos/seed/user/100/100" className="w-16 h-16 rounded-full border-2 border-white shadow-md" alt="User" />
                  <div>
                    <p className="font-black text-slate-900 text-lg">SocialMind Creator</p>
                    <p className="text-sm text-slate-500 font-medium">@creator_pro_ai</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <button onClick={() => setActiveSubSetting('mobile')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm transition-colors"><Smartphone size={18} className="text-indigo-500" /></div>
                      <div><p className="text-sm font-bold text-slate-800">Change Mobile Number</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{phone}</p></div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button onClick={() => setActiveSubSetting('email')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm transition-colors"><Key size={18} className="text-pink-500" /></div>
                      <div><p className="text-sm font-bold text-slate-800">Change Email Address</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{email}</p></div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button onClick={() => setActiveSubSetting('download')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm transition-colors"><Clock size={18} className="text-emerald-500" /></div>
                      <div><p className="text-sm font-bold text-slate-800">Download Your Information</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Get a copy of your data</p></div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button onClick={() => setActiveSubSetting('security')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm transition-colors"><Shield size={18} className="text-blue-500" /></div>
                      <div><p className="text-sm font-bold text-slate-800">Security & Privacy</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Manage account access</p></div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-2 mb-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 text-slate-800 rounded-2xl transition-all group"
                  >
                    <div className="p-2.5 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm transition-colors">
                      <Power size={18} className="text-slate-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Logout</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">End current session</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      if(confirm("Are you absolutely sure? This will permanently delete your SocialMind account and all scheduled posts.")) {
                        setIsProcessing(true);
                        setTimeout(() => {
                          alert("Account deletion successful. Good luck! 👋");
                          handleLogout();
                        }, 2000);
                      }
                    }}
                    disabled={isProcessing}
                    className="w-full flex items-center gap-4 p-4 hover:bg-red-50 text-red-500 rounded-2xl transition-all group disabled:opacity-50"
                  >
                    <div className="p-2.5 bg-red-50 rounded-xl group-hover:bg-white shadow-sm transition-colors">
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Delete Account</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Permanently erase data</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SocialMind AI v2.4.0</p>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px]">
          {renderSubSetting()}
        </div>
      </div>
    );
  };

  if (currentView === 'platform-selector') {
    return <PlatformSelector onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`flex min-h-screen bg-slate-50 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        className="bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-50 group"
      >
        <div className="flex items-center gap-2 mb-10 px-2 overflow-hidden">
          <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          {sidebarWidth > 180 && (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-700 whitespace-nowrap">
              SocialMind
            </span>
          )}
        </div>

        <nav className="space-y-2 flex-1">
          {renderSidebarItem('Overview', <LayoutDashboard size={20} />, 'ig-dashboard')}
          {renderSidebarItem('Post Scheduler', <Calendar size={20} />, 'ig-scheduler')}
          {renderSidebarItem('Automation', <Zap size={20} />, 'ig-automation')}
          {renderSidebarItem('Analytics', <BarChart3 size={20} />, 'ig-analytics')}
          {renderSidebarItem('Trend Hunter', <Flame size={20} />, 'ig-trends')}
          {renderSidebarItem('Gemini AI', <MessageSquareCode size={20} />, 'ig-chat')}
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <div className="flex-shrink-0"><Power size={20} /></div>
            {sidebarWidth > 180 && <span className="font-bold">Logout</span>}
          </button>
          <button 
            onClick={() => setCurrentView('platform-selector')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <div className="flex-shrink-0"><Instagram size={20} /></div>
            {sidebarWidth > 180 && <span className="font-bold text-sm">Switch Platform</span>}
          </button>
        </div>

        {/* Resizer Handle */}
        <div 
          onMouseDown={startResizing}
          className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-pink-500/20 active:bg-pink-500 transition-colors flex items-center justify-center overflow-visible"
        >
          <div className="w-4 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={12} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 transition-all"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {currentView === 'ig-dashboard' && 'Dashboard Overview'}
                {currentView === 'ig-scheduler' && 'Post Scheduler'}
                {currentView === 'ig-automation' && 'AI Automation Center'}
                {currentView === 'ig-analytics' && 'Growth Analytics'}
                {currentView === 'ig-trends' && 'Trend Hunter'}
                {currentView === 'ig-chat' && 'Gemini AI Assistant'}
              </h1>
              <p className="text-slate-500 text-sm">Managing Account • Secured by SocialMind AI</p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform active:scale-95"
                title="Go to Instagram"
              >
                <Instagram size={20} />
              </a>
              <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> System Healthy
              </div>
              <button 
                onClick={() => setShowProfileSettings(true)}
                className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden hover:scale-110 transition-transform active:scale-95"
              >
                 <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
              </button>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {currentView === 'ig-dashboard' && <IGDashboard onNavigate={(view) => setCurrentView(view)} />}
            {currentView === 'ig-scheduler' && (
              <PostScheduler 
                initialData={pendingTrend} 
                onClearInitial={() => setPendingTrend(null)} 
              />
            )}
            {currentView === 'ig-automation' && <AutomationCenter />}
            {currentView === 'ig-analytics' && <AnalyticsView />}
            {currentView === 'ig-trends' && <TrendHunter onApplyTrend={handleApplyTrend} />}
            {currentView === 'ig-chat' && <GeminiAssistant />}
          </div>
        </div>
      </main>

      {showProfileSettings && <ProfileSettingsModal />}
    </div>
  );
};

export default App;