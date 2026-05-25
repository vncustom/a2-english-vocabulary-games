import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Flame, Star, BookOpen, Settings } from 'lucide-react';
import { Question, Settings as AppSettings } from '../types';
import gameAudio from '../utils/audio';

interface AIQuizGeneratorProps {
  settings: AppSettings;
  onQuestionsGenerated: (newQuestions: Question[]) => void;
}

const POPULAR_TOPICS = [
  { label: '🍉 Đồ ăn (Food)', value: 'Food and Fruits' },
  { label: '🎨 Màu sắc (Colors)', value: 'Colors and Drawing' },
  { label: '🚗 Phương tiện (Vehicles)', value: 'Vehicles and Transport' },
  { label: '🧸 Đồ chơi (Toys)', value: 'Toys and Games' }
];

export default function AIQuizGenerator({ settings, onQuestionsGenerated }: AIQuizGeneratorProps) {
  const [topicInput, setTopicInput] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleGenerate = async (finalTopic: string) => {
    if (!finalTopic.trim() || isLoading) return;

    gameAudio.playClick();
    setIsLoading(true);
    setErrorText(null);
    setSuccessCount(null);

    try {
      const response = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: finalTopic,
          difficulty: difficulty,
          count: questionCount,
          customApiKey: settings.customApiKey,
          model: settings.aiModel
        })
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.questions)) {
        // Map the generated simple questions to Question format
        const generated: Question[] = data.questions.map((q: any, index: number) => {
          let type = q.type || 'guess-word';
          // Check for fallback types
          if (type !== 'matching' && type !== 'gap-filling' && type !== 'guess-word') {
            type = 'guess-word';
          }

          // Build a matching structure or direct clean answers
          const matchedPairs = type === 'matching' ? [
            { left: q.options?.[0] || 'apple', right: 'quả táo' },
            { left: q.options?.[1] || 'banana', right: 'quả chuối' },
            { left: q.options?.[2] || 'orange', right: 'quả cam' },
            { left: q.options?.[3] || 'grape', right: 'quả nho' }
          ] : undefined;

          return {
            id: `ai_${Date.now()}_${index}`,
            subjectId: 'ai_tutor_topic', // Store under a special virtual AI Topic
            content: q.content || "Question generated",
            type: type,
            options: q.options || ['A', 'B', 'C', 'D'],
            correctAnswer: q.correctAnswer || 'answer',
            explanation: q.explanation || 'Giải thích chuẩn mực từ giáo viên AI.',
            difficulty: q.difficulty || difficulty,
            clue: q.clue || '✨ Khám phá câu hỏi thú vị',
            matchedPairs
          };
        });

        onQuestionsGenerated(generated);
        setSuccessCount(generated.length);
        setTopicInput('');
        gameAudio.playVictory();
      } else {
        setErrorText(data.error || "Máy chủ phản hồi sai định dạng, bé hãy thử lại nhé!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorText("Mạng không ổn định hoặc chưa cấu hình API Key chính xác bé ơi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-md">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Bí Quyết Thông Minh: Sáng Tạo Đề Học Nhóm</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Dùng Trí Tuệ Gemini tự tạo câu hỏi mini-game theo chủ đề hoàn toàn mới!</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Input Topic */}
        <div>
          <label className="block text-xs font-bold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wide">
            Nhập chủ đề con yêu thích (Tiếng Việt hoặc Anh):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="ví dụ: Trái cây ngọt, Sắc màu kỳ diệu, Siêu xe..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-150 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1.5 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Quick Topics */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setTopicInput(topic.value);
                gameAudio.playClick();
              }}
              className="text-xs bg-amber-50/50 dark:bg-amber-950/10 hover:bg-amber-100 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/45 px-3 py-1.5 rounded-lg cursor-pointer transition"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Difficulty and count select row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-450 mb-1.5">MỨC ĐỘ KHÓ:</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setDifficulty(diff);
                    gameAudio.playClick();
                  }}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-semibold capitalize transition ${
                    difficulty === diff
                      ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Vừa' : 'Khó'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-450 mb-1.5">SỐ CÂU HỎI:</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {([3, 5] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setQuestionCount(num);
                    gameAudio.playClick();
                  }}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition ${
                    questionCount === num
                      ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit action */}
        <button
          onClick={() => handleGenerate(topicInput)}
          disabled={!topicInput.trim() || isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-slate-200 disabled:to-slate-300 ml-0 font-bold text-white py-3 px-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Thầy Ben đang soạn giáo án AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Cầu kỳ soạn câu hỏi tự động!</span>
            </>
          )}
        </button>

        {/* Dynamic messages feedback */}
        {successCount && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-sm flex items-center justify-center gap-2 font-medium">
            <Check className="w-4.5 h-4.5 text-emerald-500" />
            Đã soạn xong {successCount} câu hỏi mới thuộc chủ đề "{topicInput}"! Bé nhấn chơi ngay nhé!
          </div>
        )}

        {errorText && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-300 text-xs rounded-xl border border-red-100 dark:border-red-900/45 text-center">
            💡 {errorText}
          </div>
        )}
      </div>
    </div>
  );
}
