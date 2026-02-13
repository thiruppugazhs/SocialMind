import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Upload,
  Smile,
  Copy,
  Check,
  Loader2,
  Volume2,
  Image as ImageIcon,
  Zap,
  Globe,
  Brain,
  Play,
  Square,
  Download,
  RotateCcw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageData?: string;
  audioUrl?: string;
}

interface MemeConfig {
  topText: string;
  bottomText: string;
  textSize: number;
  textPosition: 'center' | 'top' | 'bottom';
  mirrorText: boolean;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'meme'>('chat');
  const [language, setLanguage] = useState('EN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const [memeConfig, setMemeConfig] = useState<MemeConfig>({
    topText: 'When you finally',
    bottomText: 'understand the algorithm',
    textSize: 32,
    textPosition: 'center',
    mirrorText: false,
  });
  
  const [memeOutput, setMemeOutput] = useState<string | null>(null);
  const [memeInputImage, setMemeInputImage] = useState<string | null>(null);
  
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'TA', name: 'Tamil' },
    { code: 'TE', name: 'Telugu' },
    { code: 'HI', name: 'Hindi' },
    { code: 'KN', name: 'Kannada' },
    { code: 'BN', name: 'Bengali' },
    { code: 'ML', name: 'Malayalam' },
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInputValue((prev) => prev + transcript);
          } else {
            interim_transcript += transcript;
          }
        }
        if (interim_transcript) {
          setInputValue((prev) => prev.split(' ').slice(0, -1).join(' ') + ' ' + interim_transcript);
        }
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
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setIsListening(true);
        recognitionRef.current.start();
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (view === 'meme') {
          setMemeInputImage(dataUrl);
        } else {
          setSelectedImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      imageData: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // TODO: Replace with actual backend API call
      // const response = await apiService.generateAIMessage(inputValue, language, selectedImage);
      
      // For now, simulate API response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Great question about "${inputValue}"! Here's what I think would work best for your Instagram content. The key is to focus on engagement and authenticity. Would you like me to generate a specific caption or analyze this further?`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateMeme = () => {
    if (!memeInputImage) return;

    // Simulated meme generation
    setIsLoading(true);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        
        const textColor = '#FFFFFF';
        const strokeColor = '#000000';
        const fontSize = memeConfig.textSize;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';

        if (memeConfig.mirrorText) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }

        const topY = 50 + fontSize;
        const bottomY = canvas.height - 30;

        // Draw top text
        ctx.strokeText(memeConfig.topText, canvas.width / 2, topY);
        ctx.fillText(memeConfig.topText, canvas.width / 2, topY);

        // Draw bottom text
        ctx.strokeText(memeConfig.bottomText, canvas.width / 2, bottomY);
        ctx.fillText(memeConfig.bottomText, canvas.width / 2, bottomY);

        const memeUrl = canvas.toDataURL('image/png');
        setMemeOutput(memeUrl);
        setIsLoading(false);
      };
      img.src = memeInputImage;
    }, 1500);
  };

  const downloadMeme = () => {
    if (memeOutput) {
      const link = document.createElement('a');
      link.href = memeOutput;
      link.download = `meme-${Date.now()}.png`;
      link.click();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black">Gemini AI Assistant</h2>
            <p className="text-indigo-100 text-sm font-medium">Powered by Google Gemini • Language: {language}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setView('chat')}
            className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${
              view === 'chat' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Chat Mode
          </button>
          <button
            onClick={() => setView('meme')}
            className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${
              view === 'meme' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Meme Lab
          </button>
        </div>
      </div>

      {view === 'chat' ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-6 pr-4 min-h-[400px] max-h-[600px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-6 rounded-[1.5rem] ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {message.imageData && (
                    <img
                      src={message.imageData}
                      alt="Uploaded"
                      className="max-w-xs rounded-xl mb-3"
                    />
                  )}
                  <p className="font-medium leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs font-bold mt-2 ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 p-6 rounded-[1.5rem] rounded-bl-none flex items-center gap-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-medium">Generating response...</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-lg space-y-4">
            {selectedImage && (
              <div className="relative inline-block">
                <img src={selectedImage} alt="Selected" className="max-w-xs rounded-xl" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your Instagram content..."
                className="flex-1 px-6 py-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
              />

              <button
                onClick={toggleListening}
                className={`p-4 rounded-2xl transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Speech to Text"
              >
                {isListening ? <Square size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl transition-all flex items-center justify-center"
                title="Upload Image"
              >
                <Upload size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-black text-slate-600">LANGUAGE:</span>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    language === lang.code
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Canvas Setup</h3>

            {memeInputImage ? (
              <div className="relative">
                <img src={memeInputImage} alt="Meme Input" className="w-full rounded-2xl" />
                <button
                  onClick={() => setMemeInputImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-12 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
              >
                <ImageIcon size={32} className="text-slate-400" />
                <span className="font-black text-slate-600">Upload Image for Meme</span>
              </button>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-600 mb-2 block">Top Text</label>
                <input
                  type="text"
                  value={memeConfig.topText}
                  onChange={(e) => setMemeConfig({ ...memeConfig, topText: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 mb-2 block">Bottom Text</label>
                <input
                  type="text"
                  value={memeConfig.bottomText}
                  onChange={(e) => setMemeConfig({ ...memeConfig, bottomText: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 mb-2 block">Text Size: {memeConfig.textSize}px</label>
                <input
                  type="range"
                  min="16"
                  max="60"
                  value={memeConfig.textSize}
                  onChange={(e) => setMemeConfig({ ...memeConfig, textSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={memeConfig.mirrorText}
                  onChange={(e) => setMemeConfig({ ...memeConfig, mirrorText: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-bold text-slate-700">Mirror Text</span>
              </label>
            </div>

            <button
              onClick={generateMeme}
              disabled={!memeInputImage || isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
              Generate Meme
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Preview</h3>

            {memeOutput ? (
              <div className="space-y-4">
                <img src={memeOutput} alt="Generated Meme" className="w-full rounded-2xl" />
                <div className="flex gap-3">
                  <button
                    onClick={downloadMeme}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download
                  </button>
                  <button
                    onClick={() => {
                      setMemeOutput(null);
                      setMemeInputImage(null);
                    }}
                    className="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-black hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} /> Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold">
                <div className="text-center">
                  <Smile size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Your meme will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
