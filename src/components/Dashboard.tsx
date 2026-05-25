import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, Star, Zap, Activity, Download, Upload, Shield, 
  HelpCircle, Eye, EyeOff, Check, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { AppState, Settings as AppSettings, Subject } from '../types';
import gameAudio from '../utils/audio';

interface DashboardProps {
  appState: AppState;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetProgress: () => void;
  onImportData: (data: AppState) => void;
}

export default function Dashboard({ appState, onUpdateSettings, onResetProgress, onImportData }: DashboardProps) {
  const { settings, progress, sessions, subjects } = appState;
  
  const [apiKeyInput, setApiKeyInput] = useState(settings.customApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Model Selection
  const [selectedModel, setSelectedModel] = useState(settings.aiModel || 'gemini-3.5-flash');

  // Trigger JSON Export Configuration
  const handleExport = () => {
    gameAudio.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `a2_english_progress_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle file importation
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameAudio.playClick();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && parsed.progress && parsed.settings) {
          onImportData(parsed);
          gameAudio.playVictory();
          alert("🎉 Khôi phục dữ liệu học tập thành công!");
        } else {
          alert("❌ File không đúng định dạng sao lưu.");
        }
      } catch (err) {
        alert("❌ Lỗi khi đọc file sao lưu.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    gameAudio.playClick();
    onUpdateSettings({
      ...settings,
      customApiKey: apiKeyInput,
      aiModel: selectedModel
    });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  // Convert sessions and statistics
  const totalCompleted = sessions.length;
  const accuracy = totalCompleted > 0 
    ? Math.round((sessions.reduce((acc, curr) => acc + (curr.correctAnswers / curr.totalQuestions), 0) / totalCompleted) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 1. Star Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Stars */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-5 border border-amber-300 shadow-sm text-slate-900 text-center relative overflow-hidden"
        >
          <div className="absolute right-2 top-2 opacity-15">
            <Star className="w-20 h-20 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider block opacity-85">KHO SAO VÀNG</span>
          <span className="text-3xl font-extrabold mt-1.5 block">{progress.stars} ⭐</span>
          <span className="text-[10px] mt-1 block font-medium">Bé ngoan tuyệt vời!</span>
        </motion.div>

        {/* Total Attempts */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden"
        >
          <div className="absolute right-2 top-2 opacity-5 text-indigo-500">
            <Activity className="w-20 h-20" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">LƯỢT THỬ SỨC</span>
          <span className="text-3xl font-extrabold mt-1.5 block text-slate-800 dark:text-slate-100">{totalCompleted} Lần</span>
          <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 block font-medium">Luyện tập đều nhé con!</span>
        </motion.div>

        {/* Accuracy */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden"
        >
          <div className="absolute right-2 top-2 opacity-5 text-emerald-500">
            <Award className="w-20 h-20" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ĐỘ CHÍNH XÁC</span>
          <span className="text-3xl font-extrabold mt-1.5 block text-emerald-600 dark:text-emerald-400">{accuracy}%</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-medium">Chỉ số thuộc bài xuất sắc!</span>
        </motion.div>

        {/* Streak */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 border border-orange-300 shadow-sm text-white text-center relative overflow-hidden"
        >
          <div className="absolute right-2 top-2 opacity-15">
            <Zap className="w-20 h-20 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider block opacity-85">CHUỖI NGÀY</span>
          <span className="text-3xl font-extrabold mt-1.5 block">{progress.streakDays} Ngày</span>
          <span className="text-[10px] mt-1 block font-medium">Lửa chăm học đang rực rỡ! 🔥</span>
        </motion.div>
      </div>

      {/* 2. System Settings & Keys Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Credentials */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-150">Cấu Hình Trí Tuệ Gemini AI</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            {/* Custom API Key Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Nhập API Key Cá Nhân của ba mẹ (Tùy chọn):
                </label>
                <span className="text-[10px] text-indigo-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Ưu tiên máy chủ tự động
                </span>
              </div>
              
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AI Studio đã cung cấp khóa mẫu, bạn có thể thay đổi ở đây..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border border-slate-150 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowKey(!showKey);
                    gameAudio.playClick();
                  }}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Model Selector & Submit Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-450 mb-1.5 uppercase">LỰA CHỌN MÔ HÌNH NHÂN CẬN:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    gameAudio.playClick();
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border border-slate-150 dark:border-slate-700 rounded-xl px-3 py-3 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Nhanh nhất & Miễn phí)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Suy luận sâu)</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Tiết kiệm)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 ml-0 font-bold text-white text-xs py-3.5 px-4 rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  {keySaved ? (
                    <>
                      <Check className="w-4.5 h-4.5 text-emerald-300" />
                      <span>Đã Lưu Cài Đặt!</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Cập Nhật Động Cơ AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
              💡 <strong>Lưu ý:</strong> API Key sẽ được ghi nhớ an toàn trong ứng dụng thông qua bộ nhớ <code>LocalStorage</code> của trình duyệt. Bạn có thể sử dụng hoàn toàn miễn phí hệ thống đề mẫu có sẵn ngoại tuyến mà không cần cấu hình khóa API.
            </div>
          </form>
        </div>

        {/* Backup / Restore */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-2.5">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-150">Sao Lưu & Khôi Phục</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Lưu giữ toàn bộ sao vàng đạt được, lịch sử thi cử và điểm số của bé để không bị mất khi dọn ổ cứng!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-750 dark:text-slate-300 py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              Tải Xuống File Sao Lưu (.JSON)
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="restore-file-input"
              />
              <label
                htmlFor="restore-file-input"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed dark:bg-slate-800 dark:border-slate-700 text-slate-650 dark:text-slate-400 py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4 text-emerald-500 animate-bounce" />
                Chọn File Khôi Phục Tiến Trình
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm("⚠️ Chú ý! Con có chắc chắn muốn xoá hết Lịch Sử Học và Sao Vàng đã tích lũy không?")) {
                  onResetProgress();
                }
              }}
              className="w-full text-red-500 hover:text-red-700 text-xs font-bold py-2 mt-2 transition text-center cursor-pointer"
            >
              Đặt lại từ đầu (Xoá hết sao)
            </button>
          </div>
        </div>
      </div>

      {/* 3. History session ledger board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-150 mb-4">Lịch Sử Những Trận Đấu Sôi Nổi</h3>
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border-2 border-dashed border-slate-150 dark:border-slate-800">
            🏖️ Hiện tại bé chưa thi đấu trận nào đâu! Bé hãy chọn những đề Học & Chơi hôm nay nhé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-450 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Ngày chơi</th>
                  <th className="py-2.5">Chủ đề</th>
                  <th className="py-2.5">Điểm số</th>
                  <th className="py-2.5">Độ chuẩn xác</th>
                  <th className="py-2.5">Thời gian trôi</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice().reverse().map((sess) => {
                  const subObj = subjects.find(s => s.id === sess.subjectId) || { name: 'Chủ đề AI' };
                  return (
                    <tr key={sess.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-3 font-medium text-slate-500">
                        {new Date(sess.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-bold text-slate-850 dark:text-slate-200">
                        {subObj.name}
                      </td>
                      <td className="py-3 text-amber-500 font-extrabold text-sm">
                        +{sess.score} ⭐
                      </td>
                      <td className="py-3">
                        <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">
                          {sess.correctAnswers} / {sess.totalQuestions}
                        </span>
                      </td>
                      <td className="py-3">
                        {sess.timeSpent} giây
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
