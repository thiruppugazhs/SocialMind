
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Image as ImageIcon, 
  Globe, 
  Languages, 
  Mic, 
  MicOff, 
  Paperclip, 
  X,
  Maximize2,
  TrendingUp
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  userImage?: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your SocialMind AI assistant. How can I help you grow your Instagram today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMemeMode, setIsMemeMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{data: string, mimeType: string} | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev.trim() + ' ' + transcript).trim());
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedFile({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userMessage: Message = { 
      role: 'user', 
      text: input,
      userImage: selectedFile ? `data:${selectedFile.mimeType};base64,${selectedFile.data}` : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentFile = selectedFile;
    
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    // Initializing ai inside each function call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      if (isMemeMode) {
        const prompt = `Task: Generate a high-engagement viral meme for: "${currentInput}". 
          
          STRICT LANGUAGE RULES: You can ONLY use the following languages: English, Tamil, Telugu, Hindi, Kannada, Bengali, Malayalam.
          
          Instructions:
          1. MEME SEPARATION: Distinctly separate the visual concept, the top text, and bottom text.
          2. MULTILINGUAL: Provide the primary version in the most relevant language from the allowed list (English, Tamil, Telugu, Hindi, Kannada, Bengali, Malayalam).
          3. CULTURAL CONTEXT: Ensure humor is culturally relevant and trendy for the target audience of the chosen language.
          4. VISUALS: Create a striking image suitable for Instagram.`;

        const parts: any[] = [{ text: prompt }];
        if (currentFile) {
          parts.push({
            inlineData: {
              data: currentFile.data,
              mimeType: currentFile.mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts },
        });

        let extractedText = "";
        let extractedImage = "";

        const responseParts = response.candidates?.[0]?.content?.parts || [];
        for (const part of responseParts) {
          if (part.inlineData) {
            extractedImage = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            extractedText += part.text;
          }
        }

        setMessages(prev => [...prev, { 
          role: 'model', 
          text: extractedText || (extractedImage ? "I've architected this meme for you! 🍌✨" : "I couldn't quite catch that meme vibe. Try another concept!"),
          image: extractedImage || undefined
        }]);
      } else {
        const parts: any[] = [{ text: currentInput || "Analyze this image for Instagram growth." }];
        if (currentFile) {
          parts.push({
            inlineData: {
              data: currentFile.data,
              mimeType: currentFile.mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts },
          config: {
            systemInstruction: 'You are a social media growth expert for Instagram. Provide bold, actionable, and trendy advice. Use emojis.'
          }
        });
        
        setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that. Try again! ✨" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI engine. Please check your network. ❌" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className={`p-6 transition-all duration-500 flex items-center justify-between z-10 ${
        isMemeMode ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-pink-600 to-indigo-700'
      } text-white shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl backdrop-blur-md transition-colors ${isMemeMode ? 'bg-black/20' : 'bg-white/20'}`}>
            {isMemeMode ? <Zap size={32} className="text-white" /> : <Bot size={32} />}
          </div>
          <div>
            <h2 className="text-xl font-black">{isMemeMode ? 'Meme Lab: Indian Languages' : 'SocialMind Assistant'}</h2>
            <p className="text-xs opacity-80 flex items-center gap-1">
              {isMemeMode ? <><Languages size={12}/> EN, TA, TE, HI, KN, BN, ML Only</> : 'Powered by Gemini 3.0 Pro'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMemeMode(!isMemeMode)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              isMemeMode 
                ? 'bg-black text-white border-black shadow-lg hover:scale-105' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Sparkles size={14} className={isMemeMode ? 'animate-pulse' : ''} /> 
            {isMemeMode ? 'Switch to Chat' : 'Enter Meme Mode'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-5 rounded-3xl flex gap-4 ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                m.role === 'user' ? 'bg-white/20' : (isMemeMode ? 'bg-yellow-100 text-yellow-700' : 'bg-pink-100 text-pink-600')
              }`}>
                {m.role === 'user' ? <User size={18}/> : (isMemeMode ? <Zap size={18}/> : <Bot size={18}/>)}
              </div>
              <div className="space-y-4 flex-1">
                {m.userImage && (
                  <div className="rounded-xl overflow-hidden mb-2 max-w-sm">
                    <img src={m.userImage} alt="User upload" className="w-full h-auto rounded-xl shadow-inner border border-white/20" />
                  </div>
                )}
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.image && (
                  <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl mt-2 group relative max-w-md">
                    <img src={m.image} alt="AI Generated Meme" className="w-full h-auto max-h-[280px] object-contain bg-black" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/90 rounded-lg text-slate-800 shadow-lg" title="Full size"><Maximize2 size={14}/></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 flex gap-4 items-center shadow-sm">
              <Loader2 className={`animate-spin ${isMemeMode ? 'text-yellow-600' : 'text-pink-600'}`} size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {isMemeMode ? 'Architecting Multilingual Meme...' : 'Consulting Strategy...'}
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100 space-y-4">
        {selectedFile && (
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-bottom-2">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
              <img src={`data:${selectedFile.mimeType};base64,${selectedFile.data}`} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => setSelectedFile(null)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full hover:bg-black transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Image Attached</p>
              <p className="text-xs font-bold text-slate-600">Ready to send</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleFileSelect} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 transition-all hover:bg-pink-50 shadow-sm"
            title="Upload Media"
          >
            <Paperclip size={20} />
          </button>
          
          <button 
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
            title="Voice to Prompt"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isMemeMode ? "Describe a meme in English, Hindi, Tamil, Telugu, Kannada, Bengali or Malayalam..." : "Ask about growth strategy, viral hooks, or captions..."}
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-300 transition-all font-bold text-slate-800"
            />
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && !selectedFile) || loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-50 ${
                isMemeMode ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
           {[
             { label: isMemeMode ? "Hindi Meme 🇮🇳" : "Viral Captions", icon: isMemeMode ? Languages : Sparkles },
             { label: isMemeMode ? "Tamil Humor 🎞️" : "Growth Strategy", icon: isMemeMode ? Languages : TrendingUp },
             { label: isMemeMode ? "Telugu Viral 🎭" : "Reel Hooks", icon: isMemeMode ? Languages : Zap },
             { label: isMemeMode ? "Bengali Art 🎨" : "Niche Audit", icon: isMemeMode ? Languages : Sparkles }
           ].map(suggestion => (
             <button 
              key={suggestion.label} 
              onClick={() => setInput(suggestion.label)}
              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all flex items-center gap-2 shadow-sm"
             >
               <suggestion.icon size={14}/> {suggestion.label}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
