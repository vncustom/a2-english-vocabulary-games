import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, Sparkles, HelpCircle, Eye } from 'lucide-react';
import { Question } from '../types';
import gameAudio from '../utils/audio';

interface GapFillingGameProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
  selectedAnswer: string | null;
}

export default function GapFillingGame({ question, onAnswer, isAnswered, selectedAnswer }: GapFillingGameProps) {
  const [showClue, setShowClue] = useState(false);
  const [localSelection, setLocalSelection] = useState<string | null>(null);

  // Reset local state when question changes
  useEffect(() => {
    setShowClue(false);
    setLocalSelection(null);
  }, [question]);

  // Handle selected option from the list
  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    
    setLocalSelection(option);
    const isCorrect = option.toLowerCase() === question.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      gameAudio.playCorrect();
    } else {
      gameAudio.playIncorrect();
    }
    
    onAnswer(isCorrect);
  };

  // Replace '___' in the sentence with the chosen word OR keep the prompt blank with a highlighted box
  const renderSentence = () => {
    const defaultBlank = "___";
    const currentWord = isAnswered 
      ? question.correctAnswer 
      : (localSelection || defaultBlank);
    
    const parts = question.content.split('___');
    if (parts.length < 2) {
      return (
        <div className="text-xl font-bold text-center tracking-wide text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-slate-800 p-5 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900 mx-auto max-w-md">
          {question.content}
        </div>
      );
    }

    return (
      <div className="text-lg md:text-xl font-bold text-center leading-relaxed text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/30 p-5 px-6 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-inner max-w-xl mx-auto">
        {parts[0]}
        <motion.span
          key={currentWord}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`mx-2 inline-block px-4 py-1.5 rounded-xl border-2 align-middle ${
            currentWord === defaultBlank
              ? 'border-dashed border-indigo-300 dark:border-slate-600 bg-indigo-50/20 text-indigo-400 text-xs tracking-widest'
              : isAnswered
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:text-emerald-400 font-extrabold text-lg'
              : 'border-blue-500 bg-blue-50 text-blue-700 font-extrabold text-lg'
          }`}
        >
          {currentWord}
        </motion.span>
        {parts[1]}
      </div>
    );
  };

  const options = question.options || ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
          <Sparkles className="w-3.5 h-3.5" />
          Rèn luyện: Trò Chơi Điền Chữ Vào Chỗ Trống
        </span>
        <h3 className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Chọn một từ tiếng Anh chính xác nhất để điền vào chỗ trống nhé:
        </h3>
      </div>

      {/* The Active Blank Sentence */}
      <div className="py-4">
        {renderSentence()}
      </div>

      {/* Clue Panel */}
      <div className="flex justify-center">
        {question.clue && (
          <div className="flex flex-col items-center">
            {!showClue ? (
              <button
                type="button"
                onClick={() => {
                  setShowClue(true);
                  gameAudio.playClick();
                }}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/35 cursor-pointer hover:shadow-xs transition"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem Gợi Ý Từ Giáo Viên AI
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40 px-4 py-2 rounded-xl text-center flex items-center gap-2 max-w-sm"
              >
                <span>💡 Gợi ý:</span>
                <span className="font-semibold">{question.clue}</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto px-4">
        {options.map((opt, idx) => {
          const isSelected = localSelection === opt || selectedAnswer === opt;
          const isCorrectAnswer = opt.toLowerCase() === question.correctAnswer.toLowerCase();
          
          let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750';
          
          if (isAnswered) {
            if (isCorrectAnswer) {
              btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200';
            } else if (isSelected) {
              btnStyle = 'bg-red-500 border-red-650 text-white shadow-red-200';
            } else {
              btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-500';
            }
          } else if (isSelected) {
            btnStyle = 'bg-blue-600 border-blue-700 text-white scale-102 ring-2 ring-blue-300';
          }

          return (
            <motion.button
              key={`${idx}-${opt}`}
              onClick={() => handleOptionClick(opt)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              className={`py-4 px-5 rounded-2xl border-2 font-bold text-center text-sm md:text-base cursor-pointer shadow-sm transition-all focus:outline-none ${btnStyle}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{opt}</span>
                {isAnswered && isCorrectAnswer && <Check className="w-4 h-4 shrink-0 text-white bg-white/20 rounded-full p-0.5" />}
                {isAnswered && isSelected && !isCorrectAnswer && <X className="w-4 h-4 shrink-0 text-white bg-white/20 rounded-full p-0.5" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
