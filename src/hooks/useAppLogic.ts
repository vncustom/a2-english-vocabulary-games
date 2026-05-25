import { useState, useEffect } from 'react';
import { AppState, Subject, Question, GameSession, Settings } from '../types';
import { mockSubjects, mockQuestions } from '../data/mockQuestions';
import gameAudio from '../utils/audio';

export function useAppLogic() {
  // Global Application State (persists to LocalStorage)
  const [appState, setAppState] = useState<AppState>({
    subjects: mockSubjects,
    questions: mockQuestions,
    sessions: [],
    progress: {
      totalAttempts: 0,
      averageScore: 0,
      streakDays: 1,
      weakTopics: [],
      stars: 30 // Start with some bonus sign-up stars for children
    },
    settings: {
      theme: 'light',
      soundEnabled: true,
      autoSave: true,
      aiModel: 'gemini-3-flash-preview',
      customApiKey: ''
    }
  });

  // API Key Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // UI Active Navigation Tabs: 'games' | 'tutor' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'games' | 'tutor' | 'dashboard'>('games');

  // Active Game Session States
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean>(false);
  
  // Game metrics
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('a2_english_vocabulary_games_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setAppState(prev => {
            const updatedSettings = { ...prev.settings, ...(parsed.settings || {}) };
            // Ensure the direct helper has access to the customized API key
            localStorage.setItem('gemini_api_key_custom', updatedSettings.customApiKey || '');
            return {
              ...parsed,
              settings: updatedSettings,
              progress: { ...prev.progress, ...(parsed.progress || {}) },
              questions: parsed.questions?.length ? parsed.questions : prev.questions,
              subjects: parsed.subjects?.length ? parsed.subjects : prev.subjects,
              sessions: parsed.sessions || []
            };
          });
          gameAudio.setSoundEnabled(parsed.settings?.soundEnabled ?? true);
        }
      } catch (err) {
        console.error("Failed to parse LocalStorage payload:", err);
      }
    }
  }, []);

  // Save to LocalStorage on state changes
  const saveStateToStorage = (newState: AppState) => {
    localStorage.setItem('a2_english_vocabulary_games_data', JSON.stringify(newState));
  };

  // Toggle audio setting
  const toggleSound = () => {
    const nextVal = !appState.settings.soundEnabled;
    gameAudio.setSoundEnabled(nextVal);
    gameAudio.playClick();
    const updated = {
      ...appState,
      settings: { ...appState.settings, soundEnabled: nextVal }
    };
    setAppState(updated);
    saveStateToStorage(updated);
  };

  // Toggle visual theme
  const toggleTheme = () => {
    const nextTheme = appState.settings.theme === 'light' ? 'dark' : 'light';
    gameAudio.playClick();
    const updated = {
      ...appState,
      settings: { ...appState.settings, theme: nextTheme }
    };
    setAppState(updated);
    saveStateToStorage(updated);
    
    // Apply key class to root element
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Reward stars helper
  const handleAddStars = (starsAmount: number) => {
    const updated = {
      ...appState,
      progress: {
        ...appState.progress,
        stars: appState.progress.stars + starsAmount
      }
    };
    setAppState(updated);
    saveStateToStorage(updated);
  };

  // Update AI options from settings dashboard
  const handleUpdateSettings = (newSettings: Settings) => {
    // Sync with REST helper
    localStorage.setItem('gemini_api_key_custom', newSettings.customApiKey || '');
    const updated = {
      ...appState,
      settings: newSettings
    };
    setAppState(updated);
    saveStateToStorage(updated);
    gameAudio.setSoundEnabled(newSettings.soundEnabled);
  };

  // Import completed states
  const handleImportData = (newData: AppState) => {
    setAppState(newData);
    saveStateToStorage(newData);
    gameAudio.setSoundEnabled(newData.settings.soundEnabled);
  };

  const handleResetProgress = () => {
    gameAudio.playClick();
    const updated: AppState = {
      subjects: mockSubjects,
      questions: mockQuestions,
      sessions: [],
      progress: {
        totalAttempts: 0,
        averageScore: 0,
        streakDays: 1,
        weakTopics: [],
        stars: 30
      },
      settings: {
        theme: 'light',
        soundEnabled: true,
        autoSave: true,
        aiModel: 'gemini-3-flash-preview',
        customApiKey: ''
      }
    };
    localStorage.setItem('gemini_api_key_custom', '');
    setAppState(updated);
    saveStateToStorage(updated);
  };

  // Capture dynamic question generations from AI module
  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    // Check if custom AI Subject exists, if not, create one!
    const aiSubjectId = 'ai_tutor_topic';
    const exists = appState.subjects.some(s => s.id === aiSubjectId);
    
    let updatedSubjects = [...appState.subjects];
    if (!exists) {
      updatedSubjects.push({
        id: aiSubjectId,
        name: 'Chủ đề AI Tinh nghịch (AI-Crafted)',
        icon: 'Sparkles',
        questionsCount: newQuestions.length,
        description: 'Các câu đố tự đặt từ Trí Tuệ Nhân Tạo dành riêng cho con!'
      });
    } else {
      updatedSubjects = updatedSubjects.map(s => s.id === aiSubjectId ? {
        ...s,
        questionsCount: s.questionsCount + newQuestions.length
      } : s);
    }

    // Deduplicate or append questions
    const updatedQuestions = [...appState.questions, ...newQuestions];
    const updated = {
      ...appState,
      subjects: updatedSubjects,
      questions: updatedQuestions
    };
    setAppState(updated);
    saveStateToStorage(updated);
  };

  // Active quiz actions
  const startQuiz = (subject: Subject) => {
    gameAudio.playClick();
    // Fetch queries matching subjectId
    let queries = appState.questions.filter(q => q.subjectId === subject.id);
    
    if (queries.length === 0) {
      // fallback to mock queries matching default fallback config
      queries = mockQuestions.filter(q => q.subjectId === 'family');
    }

    // Scramble / select questions up to maximum 4 questions per quiz session so children do not get overwhelmed
    const selected = [...queries].sort(() => Math.random() - 0.5).slice(0, 4);

    setActiveSubject(subject);
    setSessionQuestions(selected);
    setCurrentQuestionIndex(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setSessionCorrectCount(0);
    setSessionScore(0);
    setTimeSpent(0);
    setIsSessionFinished(false);

    // Start clock interval
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const quitSessionEarly = () => {
    gameAudio.playClick();
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setActiveSubject(null);
    setIsSessionFinished(false);
  };

  const handleAnswerSubmit = (isCorrect: boolean, chosenOption?: string) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCurrentCorrect(isCorrect);
    if (chosenOption) {
      setSelectedAnswer(chosenOption);
    }

    if (isCorrect) {
      setSessionCorrectCount(prev => prev + 1);
      // Give 10 Stars per correct answer immediately
      setSessionScore(prev => prev + 10);
    }
  };

  const goNextQuestion = () => {
    gameAudio.playClick();
    
    if (currentQuestionIndex + 1 < sessionQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Finished all queries in current loop
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setIsSessionFinished(true);
      gameAudio.playVictory();

      // Bonus points calculation: +10 extra stars for all perfect
      const hasPerfectScore = sessionCorrectCount === sessionQuestions.length;
      const bonusStars = hasPerfectScore ? 15 : 5;
      const finalGainedStars = sessionScore + bonusStars;

      // Log session
      const newSession: GameSession = {
        id: `sess-${Date.now()}`,
        subjectId: activeSubject!.id,
        score: finalGainedStars,
        totalQuestions: sessionQuestions.length,
        correctAnswers: sessionCorrectCount,
        timeSpent: timeSpent,
        date: new Date().toISOString()
      };

      // Recalculate average accuracy indicator
      const updatedSessions = [...appState.sessions, newSession];
      const updatedStars = appState.progress.stars + finalGainedStars;
      
      // Update streak (if played today)
      let currentStreak = appState.progress.streakDays;
      if (appState.sessions.length > 0) {
        const lastPlay = new Date(appState.sessions[appState.sessions.length - 1].date);
        const diffMs = Date.now() - lastPlay.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > 1 && diffDays < 2) {
          currentStreak += 1;
        } else if (diffDays >= 2) {
          currentStreak = 1;
        }
      }

      const updated = {
        ...appState,
        sessions: updatedSessions,
        progress: {
          ...appState.progress,
          totalAttempts: updatedSessions.length,
          stars: updatedStars,
          streakDays: currentStreak
        }
      };

      setAppState(updated);
      saveStateToStorage(updated);
    }
  };

  return {
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
  };
}
