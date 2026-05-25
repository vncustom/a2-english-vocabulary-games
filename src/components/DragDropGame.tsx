import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';

interface DragDropGameProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
}

export default function DragDropGame({ question, onAnswer, isAnswered }: DragDropGameProps) {
  // Simple implementation of a "drag and drop" style game
  // We'll show a sentence with a blank, and draggable words (or clickable words)
  const options = question.options || [];
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    if (!isAnswered) {
      setSelectedWord(null);
    }
  }, [isAnswered, question]);

  const handleWordSelect = (word: string) => {
    if (isAnswered) return;
    setSelectedWord(word);
    const isCorrect = word === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionStyle = (word: string) => {
    if (!isAnswered) {
      if (selectedWord === word) return 'bg-blue-600 text-white shadow-md scale-105';
      return 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md';
    }

    if (word === question.correctAnswer) {
      return 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105 z-10';
    }

    if (selectedWord === word && word !== question.correctAnswer) {
      return 'bg-red-500 text-white border-red-600 shadow-md opacity-70';
    }

    return 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-50';
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
        {question.clue || "Chọn từ đúng để điền vào chỗ trống"}
      </h3>
      
      <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-200 dark:border-slate-700 text-center text-lg font-medium text-slate-700 dark:text-slate-200">
        {question.content.split('___').map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && (
              <span className={`inline-block min-w-[120px] mx-2 px-4 py-1.5 rounded-lg border-b-4 border-2 transition-all ${
                selectedWord 
                  ? (selectedWord === question.correctAnswer && isAnswered)
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                    : isAnswered 
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 dark:border-slate-600 border-dashed bg-slate-100 dark:bg-slate-700'
              }`}>
                {selectedWord || '...'}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full sm:w-4/5 mx-auto">
        {options.map((option, idx) => (
          <motion.button
            key={idx}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
            onClick={() => handleWordSelect(option)}
            disabled={isAnswered}
            className={`px-6 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer ${getOptionStyle(option)}`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
