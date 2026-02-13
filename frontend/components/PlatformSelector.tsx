
import React, { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Lock, 
  ChevronRight, 
  Loader2, 
  ShieldCheck, 
  Globe, 
  User, 
  Key, 
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { Platform } from '../types';

interface Props {
  onLoginSuccess: (token?: string) => void;
}

type Step = 'platform' | 'ig-choice' | 'manual-creds' | 'manual-otp' | 'oauth-redirect';

const PlatformSelector: React.FC<Props> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<Step>('platform');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Meta App Configuration (Replace with actual ID in production)
  const CLIENT_ID = 'YOUR_META_APP_ID'; 
  const REDIRECT_URI = encodeURIComponent(window.location.origin + window.location.pathname);
  const SCOPE = 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement';

  const platforms = [
    { id: 'instagram' as Platform, name: 'Instagram', icon: <Instagram className="text-pink-500" />, active: true },
    { id: 'x' as Platform, name: 'X / Twitter', icon: <Twitter className="text-slate-800" />, active: false },
    { id: 'facebook' as Platform, name: 'Facebook', icon: <Facebook className="text-blue-600" />, active: false },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: <Linkedin className="text-blue-700" />, active: false },
  ];

  const handlePlatformSelect = (p: Platform) => {
    if (p === 'instagram') {
      setStep('ig-choice');
    }
  };

  const startOAuthFlow = () => {
    setLoading(true);
    setStep('oauth-redirect');
    
    // In a real production app, you'd redirect:
    // const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;
    // window.location.href = authUrl;

    // Simulating the Meta OAuth redirect and subsequent callback
    setTimeout(() => {
      setLoading(false);
      // Simulate the redirect back with a hash
      window.location.hash = `access_token=EAAbc123Simulated_${Date.now()}&user_id=17841400000`;
      onLoginSuccess();
    }, 2500);
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to verify credentials
    setTimeout(() => {
      setLoading(false);
      setStep('manual-otp');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('MANUAL_SESSION_TOKEN');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Dynamic Header */}
        <div className="p-10 text-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 border-b border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-violet-600"></div>
          
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto mb-6 flex items-center justify-center relative z-10 transition-transform hover:scale-105 duration-300">
            {step === 'platform' && <Globe className="w-10 h-10 text-indigo-600" />}
            {step === 'ig-choice' && <Fingerprint className="w-10 h-10 text-pink-600" />}
            {step === 'manual-creds' && <User className="w-10 h-10 text-indigo-600" />}
            {step === 'manual-otp' && <ShieldCheck className="w-10 h-10 text-emerald-500" />}
            {step === 'oauth-redirect' && <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
            {step === 'platform' && 'Connect Platform'}
            {step === 'ig-choice' && 'Instagram Login'}
            {step === 'manual-creds' && 'Manual Link'}
            {step === 'manual-otp' && 'Verify Identity'}
            {step === 'oauth-redirect' && 'Authenticating'}
          </h2>
          <p className="text-slate-500 text-sm px-4">
            {step === 'platform' && 'Choose a social profile to optimize with AI.'}
            {step === 'ig-choice' && 'Select your preferred method to link Instagram.'}
            {step === 'manual-creds' && 'Enter your account details to start the sync.'}
            {step === 'manual-otp' && 'Enter the 6-digit code sent to your email.'}
            {step === 'oauth-redirect' && 'Establishing secure handshake with Meta...'}
          </p>
        </div>

        {/* Dynamic Content */}
        <div className="p-8">
          {step === 'platform' && (
            <div className="space-y-3">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  disabled={!p.active}
                  onClick={() => handlePlatformSelect(p.id)}
                  className={`w-full group flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                    p.active 
                      ? 'bg-white border-slate-100 hover:border-pink-500 hover:shadow-xl cursor-pointer translate-y-0 active:translate-y-1' 
                      : 'bg-slate-50 border-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-pink-50 transition-colors">
                      {p.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        {p.active ? 'Available' : 'Coming Soon'}
                      </p>
                    </div>
                  </div>
                  {p.active ? <ChevronRight size={18} className="text-slate-300 group-hover:text-pink-500" /> : <Lock size={16} className="text-slate-200" />}
                </button>
              ))}
            </div>
          )}

          {step === 'ig-choice' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <button
                onClick={startOAuthFlow}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all"
              >
                <img src="https://api.iconify.design/logos:facebook.svg?color=white" className="w-5 h-5 brightness-0 invert" alt="FB" />
                Continue with Meta
              </button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or</span></div>
              </div>

              <button
                onClick={() => setStep('manual-creds')}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-300 transition-all"
              >
                <User size={18} />
                Sign in with Credentials
              </button>

              <button 
                onClick={() => setStep('platform')}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}

          {step === 'manual-creds' && (
            <form onSubmit={handleManualLoginSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                    placeholder="insta_handle"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Send OTP Code'}
              </button>
              <button 
                type="button"
                onClick={() => setStep('ig-choice')}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Back to Options
              </button>
            </form>
          )}

          {step === 'manual-otp' && (
            <div className="space-y-8 animate-in fade-in zoom-in">
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleOtpVerify}
                  disabled={loading || otp.some(d => !d)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Complete Account Link'}
                </button>
                <p className="text-center text-xs text-slate-400">
                  Didn't get a code? <span className="text-pink-600 font-bold cursor-pointer">Resend</span>
                </p>
              </div>
            </div>
          )}

          {step === 'oauth-redirect' && (
            <div className="py-10 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <img src="https://api.iconify.design/logos:meta-icon.svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8" alt="Meta" />
              </div>
              <div className="text-center animate-pulse">
                <p className="font-bold text-slate-800">Redirecting to Facebook...</p>
                <p className="text-xs text-slate-400">Confirm access in the secure popup</p>
              </div>
            </div>
          )}
        </div>

        {/* Improved Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <ShieldAlert size={10} className="text-amber-500" />
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Official Graph API Connection</span>
            </div>
            <p className="text-[9px] text-slate-400 text-center max-w-[200px]">
              By linking your account, you agree to our Terms and Meta's Platform Policy.
            </p>
          </div>
        </div>

        {/* Loading Overlay for Manual Flow */}
        {loading && step !== 'oauth-redirect' && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-50 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default PlatformSelector;
