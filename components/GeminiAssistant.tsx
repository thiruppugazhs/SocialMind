
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Bot, User, Sparkles, Wand2, Zap } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your SocialMind AI assistant. How can I help you grow your Instagram today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: 'You are a social media growth expert for Instagram. Provide bold, actionable, and trendy advice. Use emojis.'
        }
      });
      
      const modelMessage: Message = { role: 'model', text: response.text || "I'm sorry, I couldn't process that. Try again! ✨" };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI engine. Please check your network. ❌" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-pink-600 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><Bot size={32} /></div>
          <div><h2 className="text-xl font-black">SocialMind Assistant</h2><p className="text-xs text-pink-100 opacity-80">Powered by Gemini 3.0 Pro</p></div>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> AI Engine Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] p-5 rounded-3xl flex gap-4 ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-white/20' : 'bg-pink-100 text-pink-600'}`}>
                {m.role === 'user' ? <User size={18}/> : <Bot size={18}/>}
              </div>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex gap-4 items-center">
              <Loader2 className="animate-spin text-pink-600" size={18} />
              <span className="text-xs font-bold text-slate-400">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about growth strategy, captions, or trends..."
            className="w-full pl-6 pr-16 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-300 transition-all font-bold text-slate-800"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-4 flex gap-4 justify-center">
           {[
             { label: "Caption ideas", icon: Wand2 },
             { label: "Growth strategy", icon: TrendingUp },
             { label: "Viral hook", icon: Zap }
           ].map(suggestion => (
             <button 
              key={suggestion.label} 
              onClick={() => setInput(suggestion.label)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-600 transition-colors flex items-center gap-1.5"
             >
               <suggestion.icon size={12}/> {suggestion.label}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

const TrendingUp = (props:any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

export default GeminiAssistant;
