import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, Award, CornerDownLeft, Eraser } from 'lucide-react';
import { Question } from '../types';
import gameAudio from '../utils/audio';

interface GuessWordGameProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
  selectedAnswer: string | null;
}

export default function GuessWordGame({ question, onAnswer, isAnswered, selectedAnswer }: GuessWordGameProps) {
  const targetWord = question.correctAnswer.toLowerCase().trim();
  const [showClue, setShowClue] = useState(false);
  
  // User guess assembled as letters array
  const [userLetters, setUserLetters] = useState<string[]>([]);
  // Scrambled letters lists (keeps letter identity from scrambling)
  const [scrambledPool, setScrambledPool] = useState<{ char: string; index: number; used: boolean }[]>([]);

  // Setup scrambled pool when question changes
  useEffect(() => {
    setShowClue(false);
    setUserLetters([]);

    // Extract letters, scramble them
    const chars = targetWord.split('');
    const pool = chars.map((char, index) => ({ char, index, used: false }));
    
    // Add 2 extra random consonants/vowels to make it slightly more challenging if word is short (< 5 letters)
    if (chars.length < 5) {
      const extraSource = 'aeioubcdfghjlmpqrstvwxyz';
      for (let i = 0; i < 2; i++) {
        const randChar = extraSource[Math.floor(Math.random() * extraSource.length)];
        pool.push({ char: randChar, index: pool.length, used: false });
      }
    }

    // Scramble correctly
    const scrambled = [...pool].sort(() => Math.random() - 0.5);
    setScrambledPool(scrambled);
  }, [question]);

  // Handle letter choice
  const handleLetterTap = (poolIndex: number, char: string) => {
    if (isAnswered) return;
    if (userLetters.length >= targetWord.length) return;

    gameAudio.playClick();
    
    // Mark character as used in pool
    setScrambledPool(prev => prev.map((item, idx) => idx === poolIndex ? { ...item, used: true } : item));
    setUserLetters(prev => [...prev, char]);
  };

  // Undo last action or clear all
  const handleClear = () => {
    if (isAnswered) return;
    gameAudio.playClick();
    
    // Reset used flags
    setScrambledPool(prev => prev.map(item => ({ ...item, used: false })));
    setUserLetters([]);
  };

  // Check the answer
  const handleSubmit = () => {
    if (isAnswered) return;
    
    const spelled = userLetters.join('').toLowerCase().trim();
    const isCorrect = spelled === targetWord;
    
    if (isCorrect) {
      gameAudio.playCorrect();
    } else {
      gameAudio.playIncorrect();
    }
    onAnswer(isCorrect);
  };

  // If already answered through submission or parent state
  useEffect(() => {
    if (isAnswered && userLetters.length < targetWord.length) {
      // Just populate correctly
      setUserLetters(targetWord.split(''));
    }
  }, [isAnswered]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
          <Sparkles className="w-3.5 h-3.5" />
          Rèn luyện: Trò Chơi Nhìn Hình Đoán Chữ
        </span>
        <h3 className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Đọc gợi ý của thầy bằng cả Tiếng Anh và Tiếng Việt, rồi xếp khối chữ đúng nhé!
        </h3>
      </div>

      {/* Clue/Description Box */}
      <div className="bg-slate-50 dark:bg-slate-950/35 p-5 px-6 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-xl mx-auto shadow-inner">
        <p className="text-base font-bold leading-relaxed text-center mb-2">
          " {question.content} "
        </p>

        {question.clue && (
          <div className="mt-4 flex flex-col items-center">
            {!showClue ? (
              <button
                type="button"
                onClick={() => {
                  setShowClue(true);
                  gameAudio.playClick();
                }}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 bg-amber-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/40 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Dịch tóm tắt & Gợi ý nghĩa tiếng Việt
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs bg-amber-50/70 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30 px-4 py-2 rounded-xl text-center font-medium"
              >
                💡 {question.clue}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Secret word boxes slots */}
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {Array.from({ length: targetWord.length }).map((_, index) => {
          const letter = userLetters[index];
          const isMatchedCorrect = isAnswered && userLetters.join('').toLowerCase() === targetWord;
          const isMatchedWrong = isAnswered && !isMatchedCorrect;

          return (
            <motion.div
              key={index}
              animate={isMatchedWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              className={`w-10 h-11 md:w-11 md:h-12 rounded-xl border-3 flex items-center justify-center font-extrabold text-lg transition-all ${
                letter
                  ? isMatchedCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : isMatchedWrong
                    ? 'border-red-500 bg-red-100 text-red-650'
                    : 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-dashed border-slate-300 bg-white dark:bg-slate-800 text-transparent'
              }`}
            >
              {letter?.toUpperCase() || ''}
            </motion.div>
          );
        })}
      </div>

      {/* Keyboard Scrambled Letters Pool */}
      {!isAnswered && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2.5 justify-center max-w-sm mx-auto">
            {scrambledPool.map((item, idx) => (
              <motion.button
                key={idx}
                disabled={item.used || isAnswered}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterTap(idx, item.char)}
                className={`w-9 h-9 font-extrabold text-sm rounded-lg border flex items-center justify-center cursor-pointer transition shadow-xs ${
                  item.used
                    ? 'bg-slate-100 border-slate-200 text-slate-350 opacity-40 dark:bg-slate-800 dark:border-slate-700 pointer-events-none'
                    : 'bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-500 text-slate-900 shadow-amber-100/40 hover:from-amber-500 hover:to-yellow-600'
                }`}
              >
                {item.char.toUpperCase()}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleClear}
              disabled={userLetters.length === 0}
              className="text-xs font-bold text-slate-500 hover:text-red-500 disabled:text-slate-300 flex items-center gap-1 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <Eraser className="w-3.5 h-3.5" />
              Làm lại từ đầu
            </button>

            <button
              onClick={handleSubmit}
              disabled={userLetters.length < targetWord.length}
              className="text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-1.5 rounded-lg border-b-2 border-blue-800 shadow-sm flex items-center gap-1 cursor-pointer transition-all uppercase"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              Nộp Bài
            </button>
          </div>
        </div>
      )}

      {/* Correct answer display when answered */}
      {isAnswered && (
        <div className="text-center">
          <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">ĐÁP ÁN ĐÚNG CỦA THẦY:</span>
          <span className="text-xl font-black text-emerald-600 tracking-widest font-mono uppercase bg-emerald-50 border border-emerald-100 dark:border-emerald-900/30 px-4 py-1.5 rounded-xl inline-block">
            {targetWord}
          </span>
        </div>
      )}
    </div>
  );
}
