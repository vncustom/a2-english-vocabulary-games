import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, GraduationCap, Sparkles, Trees, Star, Volume2, VolumeX, 
  Settings as SettingsIcon, LayoutDashboard, BrainCircuit, Play, 
  Award, ChevronRight, HelpCircle, ArrowLeft, Trophy, Clock, Moon, Sun, ShieldCheck
} from 'lucide-react';

import { Subject } from './types';
// Components imports
import AITutorPanel from './components/AITutorPanel';
import AIQuizGenerator from './components/AIQuizGenerator';
import MatchingGame from './components/MatchingGame';
import GapFillingGame from './components/GapFillingGame';
import GuessWordGame from './components/GuessWordGame';
import DragDropGame from './components/DragDropGame';
import Dashboard from './components/Dashboard';
import ApiKeyModal from './components/ApiKeyModal';
import { useAppLogic } from './hooks/useAppLogic';
export default function App() {
  const {
    appState,
    activeTab,
    setActiveTab,
    activeSubject,
    setActiveSubject,
    sessionQuestions,
    currentQuestionIndex,
    isAnswered,
    selectedAnswer,
    isCurrentCorrect,
    sessionCorrectCount,
    sessionScore,
    timeSpent,
    isSessionFinished,
    toggleSound,
    toggleTheme,
    handleAddStars,
    handleUpdateSettings,
    handleImportData,
    handleResetProgress,
    handleQuestionsGenerated,
    startQuiz,
    quitSessionEarly,
    handleAnswerSubmit,
    goNextQuestion,
    setIsSessionFinished,
    isApiModalOpen,
    setIsApiModalOpen
  } = useAppLogic();

  // Check if API Key is missing and open the modal as compulsory
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedKey = appState.settings.customApiKey || localStorage.getItem('gemini_api_key_custom') || '';
      if (!savedKey) {
        setIsApiModalOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [appState.settings.customApiKey, setIsApiModalOpen]);

  // Helper mapping string icon descriptions to React elements
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-6 h-6 text-blue-500" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-indigo-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Trees': return <Trees className="w-6 h-6 text-emerald-500" />;
      default: return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  const getSubjectStyles = (id: string) => {
    switch (id) {
      case 'family':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          progressBarColor: 'bg-red-400',
          emoji: '👨👩👧',
          accentText: 'text-red-600 dark:text-red-400'
        };
      case 'school':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          progressBarColor: 'bg-blue-400',
          emoji: '🏫',
          accentText: 'text-blue-600 dark:text-blue-400'
        };
      case 'hobbies':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          progressBarColor: 'bg-orange-400',
          emoji: '🎨',
          accentText: 'text-orange-600 dark:text-orange-400'
        };
      case 'nature':
        return {
          bg: 'bg-green-50 dark:bg-green-950/20',
          progressBarColor: 'bg-green-400',
          emoji: '🌳',
          accentText: 'text-green-600 dark:text-green-400'
        };
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          progressBarColor: 'bg-amber-400',
          emoji: '✨',
          accentText: 'text-amber-600 dark:text-amber-400'
        };
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col md:flex-row font-sans ${appState.settings.theme === 'dark' ? 'dark' : ''}`}>
      
      {/* 🧭 DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => { setActiveTab('games'); setActiveSubject(null); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="text-xl font-black italic">E</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">EduPlay A2</h1>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab('games'); setActiveSubject(null); gameAudio.playClick(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition text-left ${
                activeTab === 'games' 
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-5 text-center text-base">🎮</span> Dashboard
            </button>
            <button 
              onClick={() => { setActiveTab('tutor'); gameAudio.playClick(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition text-left ${
                activeTab === 'tutor' 
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-5 text-center text-base">🧠</span> Trò chơi & AI
            </button>
            <button 
              onClick={() => { setActiveTab('dashboard'); gameAudio.playClick(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-5 text-center text-base">📊</span> Tiến độ & Điểm
            </button>
          </nav>
        </div>

        {/* Sidebar bottom persistent card */}
        <div className="mt-auto p-6">
          <div className="bg-orange-50 dark:bg-orange-950/10 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Gia sư AI Đang Chờ
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-tight">
              Có từ vựng tiếng Anh nào con chưa hiểu không? Hỏi thầy Ben ngay!
            </p>
            <button 
              onClick={() => { setActiveTab('tutor'); gameAudio.playClick(); }}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition"
            >
              Hỏi Gemini AI
            </button>
          </div>
        </div>
      </aside>

      {/* ⚡ MAIN BODY COLUMN */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-y-auto">
        
        {/* 🚀 ROUNDED METRICS HEADER */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile design Logo brand */}
            <div className="flex md:hidden items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('games'); setActiveSubject(null); }}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-black text-xs shadow">
                E
              </div>
              <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">EduPlay</span>
            </div>

            {/* Stars score */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-slate-750 dark:text-slate-200">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold text-xs sm:text-sm">{appState.progress.stars} Sao</span>
            </div>

            {/* Streak days */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-slate-755 dark:text-slate-200">
              <span className="text-orange-500">🔥</span>
              <span className="font-bold text-xs sm:text-sm">{appState.progress.streakDays} Ngày</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Bé Chăm Học</p>
              <p className="text-xs text-slate-450 dark:text-slate-505">Học sinh Lớp 3</p>
            </div>
            
            <div className="w-10 h-10 select-none rounded-full bg-blue-100 border-2 border-white dark:border-slate-850 shadow-sm flex items-center justify-center text-xl">
              👦
            </div>

            {/* Settings (API Key) & Warning label */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3 shrink-0">
              <span className="text-[10px] text-red-500 font-extrabold hidden lg:inline animate-pulse select-none">
                🔴 Lấy API key để sử dụng app
              </span>
              <button
                onClick={() => {
                  gameAudio.playClick();
                  setIsApiModalOpen(true);
                }}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black px-3 py-2 rounded-xl text-[10px] flex items-center gap-1 cursor-pointer transition shadow-md hover:shadow-red-500/20 uppercase tracking-wide"
                title="Cấu hình Trí tuệ & API Key"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Settings (API Key)</span>
              </button>
            </div>

            {/* Utilities Toolbar inside header */}
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
              <button
                onClick={toggleSound}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition text-slate-500"
                title="Bật/Tắt âm thanh"
              >
                {appState.settings.soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 opacity-45" />}
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition text-slate-500"
                title="Chế độ nền"
              >
                {appState.settings.theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* 🧭 DEV RESPONSIVE SCROLL WINDOW */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 md:gap-8 max-w-6xl w-full mx-auto">
          
          {/* If NO subject is active */}
          {!activeSubject ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Navigation Tabs bar on mobile screen size */}
              <div className="flex md:hidden bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs justify-between max-w-sm w-full mx-auto">
                <button
                  onClick={() => { setActiveTab('games'); gameAudio.playClick(); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'games'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-805'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Chơi</span>
                </button>

                <button
                  onClick={() => { setActiveTab('tutor'); gameAudio.playClick(); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'tutor'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-805'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Ben AI</span>
                </button>

                <button
                  onClick={() => { setActiveTab('dashboard'); gameAudio.playClick(); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-805'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Điểm</span>
                </button>
              </div>

              {/* NAVIGATION PANES VIEW */}
              <div className="flex-1 space-y-8">
                {activeTab === 'games' && (
                  <div className="space-y-8">
                    
                    {/* Welcome Banner matching exact Polish specifications */}
                    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden flex items-center shadow-xl">
                      <div className="flex-1 relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Chào Bé! Sẵn sàng học chưa?</h2>
                        <p className="text-blue-100 text-lg opacity-90">Học mà chơi, chơi mà học! Khám phá từ vựng A2 cùng Thầy Ben.</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button 
                            onClick={() => {
                              const target = appState.subjects.find(s => s.id === 'family') || appState.subjects[0];
                              startQuiz(target);
                            }}
                            className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full text-sm cursor-pointer shadow-md hover:bg-slate-50 transition"
                          >
                            Bắt đầu ngay 🚀
                          </button>
                          <button 
                            onClick={() => {
                              setActiveTab('tutor');
                              gameAudio.playClick();
                            }}
                            className="px-6 py-2 bg-blue-500 bg-opacity-30 text-white font-bold rounded-full text-sm border border-blue-400 border-opacity-30 cursor-pointer hover:bg-opacity-40 transition"
                          >
                            Bí quyết học AI 🧠
                          </button>
                        </div>
                      </div>
                      <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white opacity-10 rounded-full select-none pointer-events-none"></div>
                      <div className="absolute right-10 bottom-0 text-9xl opacity-20 select-none pointer-events-none">🚀</div>
                    </section>

                    {/* Highly polished subject selection grid */}
                    <section className="flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chủ đề học tập (A2)</h3>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Chọn đề để chơi</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {appState.subjects.map((subj) => {
                          const styles = getSubjectStyles(subj.id);
                          const subSessionsCount = appState.sessions.filter(s => s.subjectId === subj.id).length;
                          const progressPercent = Math.min(100, subSessionsCount > 0 ? (subSessionsCount * 25) + 30 : 15);

                          return (
                            <div 
                              key={subj.id}
                              onClick={() => startQuiz(subj)}
                              className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
                            >
                              <div className={`w-16 h-16 rounded-2xl ${styles.bg} text-3xl flex items-center justify-center mb-4 transition duration-300 group-hover:scale-108`}>
                                {styles.emoji}
                              </div>
                              
                              <h4 className="font-bold text-slate-805 dark:text-slate-150 mb-1 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition text-sm">
                                {subj.name}
                              </h4>
                              
                              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 line-clamp-2">
                                {subj.description}
                              </p>

                              <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2.5 py-1 rounded-md mb-4 inline-block">
                                📚 {subj.questionsCount} Từ Vựng
                              </span>

                              {/* Progress bar matching design guidelines */}
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-auto">
                                <div 
                                  className={`${styles.progressBarColor} h-full transition-all duration-500`} 
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>

                              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition duration-200">
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* AI Generator Integration */}
                    <div className="pt-4">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-wider">Nếu Bé Muốn Tạo Đề Khác:</h3>
                      <AIQuizGenerator 
                        settings={appState.settings}
                        onQuestionsGenerated={handleQuestionsGenerated}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'tutor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <AITutorPanel 
                        settings={appState.settings}
                        onAddStars={handleAddStars}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-150 mb-2 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          Bí Quyết Học Cùng Thầy Ben
                        </h4>
                        <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2.5 list-disc pl-4 leading-relaxed">
                          <li>Học sinh tiểu học có thể hỏi bất kỳ từ tiếng Anh nào con gặp trong sách.</li>
                          <li>Được cộng ngay <strong>+2 sao vàng</strong> cho mỗi câu hỏi thông minh con gõ.</li>
                          <li>Khi thầy Ben giải thích kèm từ tiếng Anh nằm trong dấu <code>**bôi đậm**</code> hoặc <code>[dịch]</code>, con hãy bấm loa phát âm để luyện nói theo nhé!</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-555/10 border border-indigo-200/40 p-5 rounded-3xl shadow-xs">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Mừng Ngày Luyện Hội Thoại</h4>
                        <p className="text-xs text-slate-500 dark:text-indigo-200 leading-normal">
                          Nâng cao khả năng phản xạ nghe hiểu với trợ lý AI bản xứ mỗi ngày con tự giác học.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'dashboard' && (
                  <Dashboard 
                    appState={appState}
                    onUpdateSettings={handleUpdateSettings}
                    onResetProgress={handleResetProgress}
                    onImportData={handleImportData}
                  />
                )}
              </div>
            </div>
          ) : (
            
            /* 🕹️ ACTIVE GAME PLAYING MODULE */
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-2">
              
              {/* Navigator header bar for game sessions */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm mb-6">
                <button
                  onClick={quitSessionEarly}
                  className="text-xs font-bold text-slate-500 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-full cursor-pointer transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Thoát</span>
                </button>

                <div className="text-center">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest leading-none">{activeSubject.name}</h4>
                  <p className="font-black text-xs text-slate-800 dark:text-slate-100 mt-1">
                    Câu hỏi {currentQuestionIndex + 1} / {sessionQuestions.length}
                  </p>
                </div>

                {/* Clock indicator */}
                <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{timeSpent} giây</span>
                </div>
              </div>

              {/* Progress indicators */}
              {!isSessionFinished ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    {sessionQuestions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentQuestionIndex
                            ? 'w-8 bg-blue-600'
                            : idx < currentQuestionIndex
                            ? 'w-2.5 bg-emerald-500'
                            : 'w-2.5 bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Animation transition container */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-md"
                  >
                    {/* Render sub-games */}
                    {sessionQuestions[currentQuestionIndex].type === 'matching' && (
                      <MatchingGame 
                        q={sessionQuestions[currentQuestionIndex]}
                        onCorrect={() => handleAnswerSubmit(true)}
                        onIncorrect={() => handleAnswerSubmit(false)}
                        isAnswered={isAnswered}
                      />
                    )}

                    {sessionQuestions[currentQuestionIndex].type === 'gap-filling' && (
                      <GapFillingGame 
                        question={sessionQuestions[currentQuestionIndex]}
                        onAnswer={(isCorrect) => handleAnswerSubmit(isCorrect, isAnswered ? undefined : 'options')}
                        isAnswered={isAnswered}
                        selectedAnswer={selectedAnswer}
                      />
                    )}

                    {sessionQuestions[currentQuestionIndex].type === 'guess-word' && (
                      <GuessWordGame 
                        question={sessionQuestions[currentQuestionIndex]}
                        onAnswer={(isCorrect) => handleAnswerSubmit(isCorrect, isAnswered ? undefined : 'word')}
                        isAnswered={isAnswered}
                        selectedAnswer={selectedAnswer}
                      />
                    )}

                    {sessionQuestions[currentQuestionIndex].type === 'drag-drop' && (
                      <DragDropGame 
                        question={sessionQuestions[currentQuestionIndex]}
                        onAnswer={(isCorrect) => handleAnswerSubmit(isCorrect)}
                        isAnswered={isAnswered}
                      />
                    )}
                  </motion.div>

                  {/* Feedback response panel overlay */}
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${
                          isCurrentCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-355'
                            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-355'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shrink-0 select-none text-2xl bg-white/50">
                            {isCurrentCorrect ? '🎉' : '💡'}
                          </div>
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-wide">
                              {isCurrentCorrect ? 'Bé giỏi quá! Đáp án đúng rồi!' : 'Bé học thêm kiến thức nhé!'}
                            </h4>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                              {sessionQuestions[currentQuestionIndex].explanation}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={goNextQuestion}
                          className="w-full md:w-auto bg-slate-900 dark:bg-slate-705 dark:hover:bg-slate-800 hover:bg-slate-800 ml-0 shrink-0 text-white font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-102"
                        >
                          <span>CÂU TIẾP THEO</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                
                /* 🏆 PERFECT PROGRESS COMPLETED SCOREPANEL SCREEN */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[2rem] p-8 text-center shadow-lg max-w-lg mx-auto"
                >
                  <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-yellow-100">
                    <Trophy className="w-12 h-12 text-slate-900 animate-bounce" />
                  </div>

                  <h2 className="text-2xl font-black text-indigo-700 dark:text-indigo-400">CHIẾN THẮNG TUYỆT VỜI!</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-widest">Bé đã hoàn thành giáo án thử thách</p>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">SỐ CÂU ĐÚNG</span>
                      <span className="text-lg font-black text-slate-850 dark:text-slate-200 block mt-1 animate-pulse">
                        {sessionCorrectCount} / {sessionQuestions.length}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">THỜI GIAN</span>
                      <span className="text-lg font-black text-slate-850 dark:text-slate-200 block mt-1">
                        {timeSpent} giây
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 p-5 rounded-2xl border border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 font-extrabold text-sm flex items-center justify-center gap-1.5 mb-6">
                    <Star className="w-5 h-5 fill-amber-500 stroke-amber-600 animate-spin-slow" />
                    Chúc mừng bé nhận được 
                    <span className="text-lg text-orange-600 font-black">+{sessionScore + (sessionCorrectCount === sessionQuestions.length ? 15 : 5)} ⭐</span> 
                    sao vàng!
                  </div>

                  <button
                    onClick={() => {
                      gameAudio.playClick();
                      setActiveSubject(null);
                      setIsSessionFinished(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 ml-0 font-extrabold text-white text-xs py-4 rounded-xl uppercase tracking-widest cursor-pointer shadow-md border-b-3 border-blue-800 transition"
                  >
                    CHINH PHỤC CHỦ ĐỀ KHÁC 🎮
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </main>

        {/* 📝 FOOTER BRAND CREDENTIALS */}
        <footer className="mt-auto bg-white dark:bg-slate-900 py-6 px-4 border-t border-slate-200 dark:border-slate-850 text-center transition">
          <div className="max-w-7xl mx-auto space-y-1">
            <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium">
              Phát triển bởi <strong>Trí Tuệ Nhân Tạo Gemini</strong> cho học sinh Lớp 3 Tiểu Học tại Việt Nam.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
              © 2026 - Ghi nhớ từ vựng khoa học A2 English Quest.
            </p>
          </div>
        </footer>

        <ApiKeyModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          apiKey={appState.settings.customApiKey || localStorage.getItem('gemini_api_key_custom') || ''}
          selectedModel={appState.settings.aiModel}
          onSave={(key, model) => {
            handleUpdateSettings({
              ...appState.settings,
              customApiKey: key,
              aiModel: model
            });
          }}
          isCompulsory={!(appState.settings.customApiKey || localStorage.getItem('gemini_api_key_custom') || '')}
        />
      </div>
    </div>
  );
}
