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
    <div className="flex flex-col gap-1 w-full justify-center items-center h-full">
      {mode === 'percentage' && (
        <div className="flex items-center gap-1">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              className="form-input p-1 text-right text-sm w-16 tabular-nums"
              value={pctStr}
              onChange={handlePctChange}
              onBlur={handlePctBlur}
              placeholder="%"
            />
          </div>
          <span className="text-gray-400 text-xs w-3">%</span>
        </div>
      )}

      {mode === 'points' && (
        <div className="flex items-center gap-1">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              className={`form-input p-1 text-right text-sm w-16 font-bold text-blue-700 tabular-nums ${isInvalid ? 'border-red-500 bg-red-50' : ''}`}
              value={absStr}
              onChange={handleAbsChange}
              placeholder="pt"
            />
          </div>
          <span className="text-gray-400 text-xs w-3">pt</span>
        </div>
      )}
      {mode === 'points' && isInvalid && (
        <span className="text-[10px] text-red-500 absolute -bottom-4 whitespace-nowrap">{MESSAGES.SCORING_ERR_UNIT}</span>
      )}
    </div>
  );
};
