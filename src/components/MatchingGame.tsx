import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RefreshCw, Star, Sparkles, HelpCircle } from 'lucide-react';
import { Question } from '../types';
import gameAudio from '../utils/audio';

interface MatchingGameProps {
  question: Question;
  onCorrect: () => void;
  onIncorrect: () => void;
  isAnswered: boolean;
}

interface PairItem {
  id: string;
  text: string;
  type: 'left' | 'right';
}

export default function MatchingGame({ q, onCorrect, onIncorrect, isAnswered } : { q: Question, onCorrect: () => void, onIncorrect: () => void, isAnswered: boolean }) {
  // Extract pairs
  const pairs = q.matchedPairs || [
    { left: 'mother', right: 'mẹ' },
    { left: 'father', right: 'bố' },
    { left: 'brother', right: 'anh/em trai' },
    { left: 'sister', right: 'chị/em gái' }
  ];

  const [leftItems, setLeftItems] = useState<PairItem[]>([]);
  const [rightItems, setRightItems] = useState<PairItem[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const [matchedLefts, setMatchedLefts] = useState<string[]>([]);
  const [matchedRights, setMatchedRights] = useState<string[]>([]);

  const [shakeIds, setShakeIds] = useState<string[]>([]);

  // Shuffle upon mounting or question change
  useEffect(() => {
    const lefts = pairs.map((p, idx) => ({ id: `L_${idx}`, text: p.left, type: 'left' as const }));
    const rights = pairs.map((p, idx) => ({ id: `R_${idx}`, text: p.right, type: 'right' as const }));

    setLeftItems([...lefts].sort(() => Math.random() - 0.5));
    setRightItems([...rights].sort(() => Math.random() - 0.5));

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedLefts([]);
    setMatchedRights([]);
    setShakeIds([]);
  }, [q]);

  const handleSelectItem = (item: PairItem) => {
    if (isAnswered) return;
    gameAudio.playClick();

    if (item.type === 'left') {
      if (matchedLefts.includes(item.text)) return;
      setSelectedLeft(item.text === selectedLeft ? null : item.text);
    } else {
      if (matchedRights.includes(item.text)) return;
      setSelectedRight(item.text === selectedRight ? null : item.text);
    }
  };

  // Perform match detection of the selected pair
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Find matching index in original pairs
      const correctPair = pairs.find(p => p.left === selectedLeft && p.right === selectedRight);

      if (correctPair) {
        // Success
        setMatchedLefts(prev => [...prev, selectedLeft]);
        setMatchedRights(prev => [...prev, selectedRight]);
        gameAudio.playCorrect();

        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all are matched
        const allMatched = matchedLefts.length + 1 === pairs.length;
        if (allMatched) {
          onCorrect();
        }
      } else {
        // Mismatch - shake active items
        const leftItem = leftItems.find(i => i.text === selectedLeft);
        const rightItem = rightItems.find(i => i.text === selectedRight);
        const newShake: string[] = [];
        if (leftItem) newShake.push(leftItem.id);
        if (rightItem) newShake.push(rightItem.id);

        setShakeIds(newShake);
        gameAudio.playIncorrect();
        onIncorrect();

        // Clear selection and shake after short duration
        setTimeout(() => {
          setShakeIds([]);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          Rèn luyện: Trò Chơi Nối Từ Đồng Nghĩa
        </span>
        <h3 className="mt-2 text-base font-bold text-slate-800 dark:text-slate-100 px-4">
          👉 Ghép cặp các từ Tiếng Anh (bên trái) với nghĩa Tiếng Việt tương ứng (bên phải):
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto px-2">
        {/* Left Column (English words) */}
        <div className="space-y-3 flex flex-col justify-center">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ENGLISH 🇬🇧</div>
          {leftItems.map((item) => {
            const isSelected = selectedLeft === item.text;
            const isMatched = matchedLefts.includes(item.text);
            const isShaking = shakeIds.includes(item.id);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={isMatched || isAnswered}
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                className={`py-3.5 px-4 font-bold text-sm tracking-wide rounded-xl border-2 transition-all cursor-pointer select-none ring-offset-2 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm opacity-60'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 ring-1.5 ring-blue-500'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (Vietnamese dictionary terms) */}
        <div className="space-y-3 flex flex-col justify-center">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">VIETNAMESE 🇻🇳</div>
          {rightItems.map((item) => {
            const isSelected = selectedRight === item.text;
            const isMatched = matchedRights.includes(item.text);
            const isShaking = shakeIds.includes(item.id);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={isMatched || isAnswered}
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                className={`py-3.5 px-4 font-semibold text-sm rounded-xl border-2 transition-all cursor-pointer select-none ring-offset-2 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm opacity-60'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 ring-1.5 ring-blue-500'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {matchedLefts.length > 0 && matchedLefts.length < pairs.length && (
        <div className="text-center text-xs text-slate-500 font-medium">
          🌟 Đã ghép đúng: {matchedLefts.length} / {pairs.length} cặp từ
        </div>
      )}
    </div>
  );
}
