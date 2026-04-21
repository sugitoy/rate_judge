// src/components/features/scoring/ScoreCell.tsx
import React, { useState, useEffect } from 'react';
import type { Criteria } from '../../../types';
import { trimZero, isValidUnit, calculateAutoCorrect } from '../../../utils/scoreFormatter';
import { MESSAGES } from '../../../constants/messages';

interface ScoreCellProps {
  criterion: Criteria;
  value?: number;
  inputUnit: number;
  mode: 'percentage' | 'points';
  onChange: (val: number) => void;
}

export const ScoreCell: React.FC<ScoreCellProps> = ({ criterion, value, inputUnit, mode, onChange }) => {
  const [absStr, setAbsStr] = useState(value !== undefined ? value.toString() : '');
  const [pctStr, setPctStr] = useState(value !== undefined && criterion.maxScore > 0 ? ((value / criterion.maxScore) * 100).toString() : '');

  useEffect(() => {
    if (value === undefined) {
      setAbsStr('');
      setPctStr('');
      return;
    }
    const currentAbs = parseFloat(absStr);
    if (isNaN(currentAbs) || Math.abs(currentAbs - value) > 0.001) {
      setAbsStr(value.toString());
      if (criterion.maxScore > 0) {
        setPctStr(Number(((value / criterion.maxScore) * 100).toFixed(2)).toString());
      }
    }
  }, [value, criterion.maxScore]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = trimZero(e.target.value.replace(/[^0-9.-]/g, ''));
    setAbsStr(newVal);

    const num = parseFloat(newVal);
    if (!isNaN(num)) {
      if (criterion.maxScore > 0) {
        setPctStr(Number(((num / criterion.maxScore) * 100).toFixed(2)).toString());
      }
      onChange(num);
    } else {
      onChange(0);
    }
  };

  const handlePctChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = trimZero(e.target.value.replace(/[^0-9.-]/g, ''));

    // 100%上限
    const tempNum = parseFloat(newVal);
    if (!isNaN(tempNum) && tempNum > 100) {
      newVal = '100';
    }

    setPctStr(newVal);
    const num = parseFloat(newVal);
    if (!isNaN(num)) {
      const calcAbs = calculateAutoCorrect(num, criterion.maxScore, inputUnit);
      setAbsStr(calcAbs.toString());
      onChange(calcAbs);
    } else {
      onChange(0);
    }
  };

  const handlePctBlur = () => {
    const num = parseFloat(pctStr);
    if (!isNaN(num) && criterion.maxScore > 0) {
      const abs = calculateAutoCorrect(num, criterion.maxScore, inputUnit);
      setPctStr(Number(((abs / criterion.maxScore) * 100).toFixed(2)).toString());
    }
  };

  const isInvalid = !isValidUnit(absStr, inputUnit);

  return (
    <div className="flex flex-col gap-1 w-full justify-center items-center h-full group/cell relative">
      {mode === 'percentage' && (
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              className="form-input py-1 px-2 text-right text-sm w-20 tabular-nums border-slate-200 focus:border-primary focus:ring-primary/20 block"
              value={pctStr}
              onChange={handlePctChange}
              onBlur={handlePctBlur}
              placeholder="%"
            />
          </div>
          <span className="text-slate-400 text-[10px] font-bold w-4 select-none">%</span>
        </div>
      )}

      {mode === 'points' && (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              inputMode="decimal"
              className={`form-input py-1 px-2 text-right text-sm w-20 font-bold border-slate-200 tabular-nums transition-all focus:ring-primary/20 ${
                isInvalid 
                  ? 'border-danger text-danger bg-danger-bg focus:border-danger focus:ring-danger/20' 
                  : 'text-primary focus:border-primary'
              }`}
              value={absStr}
              onChange={handleAbsChange}
              placeholder="pt"
            />
            <span className="text-slate-400 text-[10px] font-bold w-4 select-none uppercase tracking-tighter">pt</span>
          </div>
          {isInvalid && (
            <span className="text-[9px] text-danger font-bold uppercase tracking-tight animate-in fade-in slide-in-from-top-1 duration-150">
              {MESSAGES.SCORING_ERR_UNIT}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
