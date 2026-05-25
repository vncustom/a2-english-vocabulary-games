import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Sparkle, Bot, User, Volume2 } from 'lucide-react';
import { ChatMessage, Settings } from '../types';
import gameAudio from '../utils/audio';
import { generateContentWithFallback } from '../utils/geminiClient';

interface AITutorPanelProps {
  settings: Settings;
  onAddStars: (stars: number) => void;
}

const SUGGESTED_QUESTIONS = [
  "Nghĩa của từ 'backpack' là gì thế ạ thầy?",
  "Làm sao để nói 'con thỏ' bằng tiếng Anh?",
  "Cho con ví dụ vui nhộn về từ 'mother' đi ạ!",
  "Đố con một câu hỏi tiếng Anh về chủ đề tự nhiên!"
];

export default function AITutorPanel({ settings, onAddStars }: AITutorPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Xin chào bé ngoan! Thầy là **Ben** - Gia sư Trí Tuệ Nhân Tạo của bé. Thầy rất vui được đồng hành học Tiếng Anh cùng con. Con muốn rèn luyện từ vựng nào hôm nay hay có câu hỏi gì kể thầy nghe nhé! ✨",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    gameAudio.playClick();
    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    setErrorText(null);

    try {
      // Pack the chat history (excluding the first welcome message and any errors)
      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const systemInstruction = "You are Ben, a playful, warm, and extremely supportive English tutor for primary school students in Grade 3 in Vietnam. You only teach A2 vocabulary. Keep sentences short, enthusiastic, and easy to read. Translate difficult keywords to Vietnamese inside brackets e.g. 'rabbit [con thỏ]'. Use emojis to animate the explanation! Congratulate the child for asking good questions.";

      // Call our resilient direct/retry client!
      const result = await generateContentWithFallback({
        prompt: textToSend,
        history: chatHistory,
        systemInstruction,
        customApiKey: settings.customApiKey,
        selectedModel: settings.aiModel
      });

      if (result.success && result.text) {
        const newBotMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'model',
          text: result.text || "Thầy chưa nghĩ ra câu giải đáp, con nói lại rõ hơn được không?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newBotMessage]);
        // Reward 2 bonus stars for chatting with the AI tutor
        onAddStars(2);
      } else {
        setErrorText(result.error || "Có lỗi bất ngờ từ máy chủ rồi bé ơi!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(`Đã dừng do lỗi: ${err.message || 'Mạng không thể truyền tin, con kiểm tra lại kết nối Wifi nhé!'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    gameAudio.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Look for purely english text parts to pronounce or try to voice all
      // For children, we speak in English with a default language synthesis or fallback.
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*|##|\*|\[.*?\]/g, ''));
      utterance.rate = 0.85; // Speak clearly
      // Set to English if simple, or default
      const englishWordMatch = text.match(/[a-zA-Z]{3,20}/);
      if (englishWordMatch) {
         utterance.lang = 'en-US';
      } else {
         utterance.lang = 'vi-VN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Safe manual markdown parser for bold, italic, and brackets to color-code English words for Grade 3
  const renderMessageText = (text: string) => {
    // 1. Convert brackets [việt] to secondary highlight
    // 2. Convert **bold** to primary dynamic color
    // 3. Keep breaks safe
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let parts: React.ReactNode[] = [];
      let currentString = line;
      let keyCounter = 0;

      // regex for **bold** and [translation]
      const regex = /(\*\*.*?\*\*|\[.*?\])/g;
      const subParts = currentString.split(regex);

      const formatted = subParts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerText = part.slice(2, -2);
          return (
            <strong key={pIdx} className="font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1 py-0.5 rounded transition-all">
              {innerText}
            </strong>
          );
        } else if (part.startsWith('[') && part.endsWith(']')) {
          const innerText = part.slice(1, -1);
          return (
            <span key={pIdx} className="text-emerald-500 font-medium whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/20 px-1 rounded mx-0.5 text-xs">
              ({innerText})
            </span>
          );
        }
        return part;
      });

      return (
        <p key={idx} className="mb-1 leading-relaxed text-sm text-slate-700 dark:text-slate-300">
          {formatted}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[550px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden" id="ai-tutor-container">
      {/* Panel Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-1.5">
              Thầy Ben Vui Tính
              <Sparkle className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            </h3>
            <p className="text-xs text-indigo-100">Gia sư đàm thoại Tiếng Anh thông minh</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full text-yellow-200 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          Học vui vẻ!
        </div>
      </div>

      {/* Suggested Questions Quick List */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Bé muốn hỏi:</span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-750 px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap hover:border-blue-300 cursor-pointer transition-all shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-900/40">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col">
                <div className={`p-4 rounded-2xl shadow-sm text-sm relative ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-850 border border-slate-100 dark:border-slate-750 rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="leading-relaxed text-sm whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderMessageText(msg.text)
                  )}

                  {msg.role === 'model' && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="absolute -bottom-3 -right-2 p-1.5 bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-200 rounded-full shadow border border-slate-100 dark:border-slate-650 cursor-pointer transition"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[70%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-755 shadow-sm text-sm max-w-[150px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce delay-0"></span>
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-300 text-xs rounded-xl border border-red-100 dark:border-red-900/40 text-center mx-auto max-w-[90%]">
            💡 {errorText}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Hỏi thầy từ bất kỳ... Ví dụ: Nghĩa của từ sister?"
          disabled={isLoading}
          maxLength={150}
          className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm border border-slate-150 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-slate-200 disabled:to-slate-300 text-white disabled:text-slate-400 dark:disabled:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
