import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Sparkles, Check, HelpCircle, AlertTriangle, ExternalLink, Shield } from 'lucide-react';
import gameAudio from '../utils/audio';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  selectedModel: string;
  onSave: (key: string, model: string) => void;
  isCompulsory: boolean;
}

const AVAILABLE_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.5 Flash',
    badge: 'Khuyên Dùng',
    desc: 'Tốc độ siêu nhanh, phản hồi tức thì, tiết kiệm quota và cực kỳ ổn định cho bé học chơi.',
    color: 'border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/10'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3.1 Pro',
    badge: 'Suy Luận Sâu',
    desc: 'Khả năng tư duy cao cấp, thích hợp cho các giải thích từ vựng học thuật sâu sắc.',
    color: 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/10'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Mẫu Cũ Ổn Định',
    desc: 'Mô hình thế hệ trước, tốc độ trung bình, ổn định và tin cậy.',
    color: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10'
  }
];

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  selectedModel,
  onSave,
  isCompulsory
}: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [modelSelect, setModelSelect] = useState(selectedModel || 'gemini-3-flash-preview');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gameAudio.playClick();

    if (!keyInput.trim()) {
      setErrorMsg('Vui lòng điền API Key để kích hoạt trí tuệ nhân tạo Gemini bé yêu nhé!');
      return;
    }

    onSave(keyInput.trim(), modelSelect);
    setErrorMsg(null);
    gameAudio.playVictory();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isCompulsory) {
              gameAudio.playClick();
              onClose();
            }
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8 z-10"
        >
          {/* Header Title */}
          <div className="flex items-center space-x-3.5 mb-6">
            <div className="p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-md">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-850 dark:text-slate-100 flex items-center gap-2">
                Cài Đặt Động Cơ Trí Tuệ Gemini
                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Nhập API Key cá nhân của phụ huynh để kích hoạt trợ lý học tập đàm thoại AI thông minh.
              </p>
            </div>
          </div>

          {/* Compulsory warning notice */}
          {isCompulsory && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-300 text-xs flex gap-2.5 items-start">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <strong className="font-bold text-sm block mb-0.5">Yêu cầu cấu hình ban đầu:</strong>
                Để học tập cùng Thầy Ben và tự sáng tạo đề thi vui nhộn từ Gemini AI, ba mẹ vui lòng nhập mã khóa API bên dưới. Khóa API sẽ được ghi nhớ an toàn trên thiết bị của con!
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Key Row */}
            <div>
              <label className="block text-xs font-black text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                1. MÃ KHÓA API KEY CỦA BA MẸ:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Điền khóa API AI Studio (Ví dụ: AIzaSy...)"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100 text-sm border-2 border-slate-150 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono"
                />
                <Key className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" />
              </div>

              {/* Instructions on how to get API Key */}
              <div className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-450 font-medium">Ba mẹ chưa có khóa? Tạo miễn phí chỉ trong 10 giây:</span>
                </div>
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition"
                  onClick={() => gameAudio.playClick()}
                >
                  <span>Lấy API Key Ngay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Model Card Selection */}
            <div>
              <label className="block text-xs font-black text-slate-600 dark:text-slate-450 mb-3.5 uppercase tracking-wider">
                2. LỰA CHỌN MÔ HÌNH TRÍ TUỆ (CARDS):
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = modelSelect === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        setModelSelect(model.id);
                        gameAudio.playClick();
                      }}
                      className={`relative rounded-2xl p-4 border-2 flex flex-col justify-between cursor-pointer transition-all duration-300 ${model.color} ${
                        isSelected
                          ? 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20 scale-102 shadow-md'
                          : 'opacity-70 hover:opacity-100 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-extrabold text-slate-850 dark:text-slate-150 text-sm">
                            {model.name}
                          </span>
                          <span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-black px-2 py-0.5 rounded-full uppercase scale-90">
                            {model.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {model.desc}
                        </p>
                      </div>

                      {/* Selected checkmark overlay */}
                      {isSelected && (
                        <div className="absolute right-2 bottom-2 bg-amber-500 text-white p-1 rounded-full shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center text-xs text-red-650 dark:text-red-400 font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit Button Row */}
            <div className="flex gap-3 pt-2">
              {!isCompulsory && (
                <button
                  type="button"
                  onClick={() => {
                    gameAudio.playClick();
                    onClose();
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 py-3.5 rounded-2xl text-sm font-extrabold cursor-pointer transition"
                >
                  HỦY BỎ
                </button>
              )}
              
              <button
                type="submit"
                className="flex-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3.5 rounded-2xl text-sm font-extrabold shadow-lg cursor-pointer transition hover:scale-101 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>KÍCH HOẠT ĐỘNG CƠ AI 🚀</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
