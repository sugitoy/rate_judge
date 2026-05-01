import React, { useState, useEffect } from 'react';
import type { Criteria } from '../../../types';
import { trimZero, isValidUnit, calculateAutoCorrect } from '../../../utils/scoreFormatter';
import { MESSAGES } from '../../../constants/messages';
import { TIERS, getTierById } from '../../../constants/tiers';

interface ScoreCellProps {
  criterion: Criteria;
  value?: number;
  inputUnit: number;
  mode: 'percentage' | 'points' | 'tier';
  selectedTier?: string;
  rank?: number;
  showRank?: boolean;
  onChange: (val: number) => void;
  onTierChange?: (tier: string | undefined) => void;
}

export const ScoreCell: React.FC<ScoreCellProps> = ({
  criterion,
  value,
  inputUnit,
  mode,
  selectedTier,
  rank,
  showRank,
  onChange,
  onTierChange
}) => {
  const [absStr, setAbsStr] = useState(value !== undefined ? value.toString() : '');
  const [pctStr, setPctStr] = useState(value !== undefined && criterion.maxScore > 0 ? ((value / criterion.maxScore) * 100).toString() : '');

  useEffect(() => {
    if (value === undefined) {
      setAbsStr('');
      setPctStr('');
      return;
    }
    const currentAbs = parseFloat(absStr);
    if (isNaN(currentAbs) || Math.abs(currentAbs - value) > 0.0000000001) {
      setAbsStr(value.toString());
      if (criterion.maxScore > 0) {
        setPctStr((Number(value) / criterion.maxScore * 100).toString());
      }
    }
  }, [value, criterion.maxScore]);

  const handleAbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = trimZero(e.target.value.replace(/[^0-9.-]/g, ''));
    setAbsStr(newVal);

    const num = parseFloat(newVal);
    if (!isNaN(num)) {
      if (criterion.maxScore > 0) {
        setPctStr((num / criterion.maxScore * 100).toString());
      }
      onChange(num);
    } else {
      onChange(0);
    }
  };

  const handlePctChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = trimZero(e.target.value.replace(/[^0-9.-]/g, ''));
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
      setPctStr((abs / criterion.maxScore * 100).toString());
    }
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tierId = e.target.value;
    if (!tierId) {
      onTierChange?.(undefined);
      return;
    }

    const tier = getTierById(tierId);
    if (tier) {
      onTierChange?.(tierId);
      const calcAbs = calculateAutoCorrect(tier.percentage, criterion.maxScore, inputUnit);
      setAbsStr(calcAbs.toString());
      setPctStr(tier.percentage.toString());
      onChange(calcAbs);
    }
  };

  const isInvalidUnit = !isValidUnit(absStr, inputUnit);

  // Tier不一致チェック
  const tierDef = selectedTier ? getTierById(selectedTier) : null;
  const isTierMismatch = tierDef && value !== undefined && Math.abs(value - calculateAutoCorrect(tierDef.percentage, criterion.maxScore, inputUnit)) > 0.0001;

  const hasError = isInvalidUnit || (mode === 'tier' && isTierMismatch);

  return (
    <div className="flex flex-col gap-1 w-full justify-center items-center h-full group/cell relative transition-colors">
      {mode === 'percentage' && (
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              className={`form-input py-0.5 px-2 text-right text-sm w-20 tabular-nums focus:ring-primary/20 block transition-all ${isInvalidUnit
                  ? 'border-danger text-danger bg-danger-bg focus:border-danger focus:ring-danger/20'
                  : 'border-slate-200 focus:border-primary'
                }`}
              value={pctStr}
              onChange={handlePctChange}
              onBlur={handlePctBlur}
              onFocus={(e) => e.target.select()}
              placeholder="%"
            />
          </div>
          <div className="flex flex-col items-start -space-y-0.5 min-w-[32px]">
            <span className="text-slate-400 text-[10px] font-bold select-none">%</span>
            {showRank && rank && rank > 0 && (
              <span className={`text-[9px] font-bold tabular-nums ${rank <= 3 ? 'text-primary' : 'text-slate-300'}`}>
                ({rank}{MESSAGES.ANALYSIS_RANK_SUFFIX})
              </span>
            )}
          </div>
        </div>
      )}

      {mode === 'points' && (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              inputMode="decimal"
              className={`form-input py-0.5 px-2 text-right text-sm w-20 font-bold tabular-nums transition-all focus:ring-primary/20 ${isInvalidUnit
                  ? 'border-danger text-danger bg-danger-bg focus:border-danger focus:ring-danger/20'
                  : 'border-slate-200 text-primary focus:border-primary'
                }`}
              value={absStr}
              onChange={handleAbsChange}
              onFocus={(e) => e.target.select()}
              placeholder="pt"
            />
            <div className="flex flex-col items-start -space-y-0.5 min-w-[32px]">
              <span className="text-slate-400 text-[10px] font-bold select-none uppercase tracking-tighter">pt</span>
              {showRank && rank && rank > 0 && (
                <span className={`text-[9px] font-bold tabular-nums ${rank <= 3 ? 'text-primary' : 'text-slate-300'}`}>
                  ({rank}{MESSAGES.ANALYSIS_RANK_SUFFIX})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'tier' && (
        <div className="flex flex-col items-center gap-0.5 w-full">
          <div className="flex items-center gap-1.5 w-full justify-center">
            <div className="relative w-20">
              <select
                className={`form-input py-0.5 px-2 text-center text-sm w-full font-bold appearance-none cursor-pointer transition-all ${hasError
                    ? 'border-danger ring-1 ring-danger/20'
                    : 'border-slate-200 focus:border-primary focus:ring-primary/20'
                  } ${tierDef ? tierDef.bgClass + ' ' + tierDef.textClass : 'text-slate-400'}`}
                value={selectedTier || ''}
                onChange={handleTierChange}
              >
                <option value="">-</option>
                {TIERS.map(t => (
                  <option key={t.id} value={t.id} className="text-slate-900 bg-white">{t.label}</option>
                ))}
              </select>
            </div>
            {showRank && rank && rank > 0 && (
              <div className="flex flex-col items-start -space-y-0.5 min-w-[32px]">
                <span className={`text-[9px] font-bold tabular-nums ${rank <= 3 ? 'text-primary' : 'text-slate-300'}`}>
                  ({rank}{MESSAGES.ANALYSIS_RANK_SUFFIX})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* エラーメッセージの表示 (共通) */}
      {isInvalidUnit && (
        <span className="text-[9px] text-danger font-bold uppercase tracking-tight animate-in fade-in slide-in-from-top-1 duration-150">
          {MESSAGES.SCORING_ERR_UNIT}
        </span>
      )}
      {mode === 'tier' && isTierMismatch && (
        <span className="text-[9px] text-danger font-bold uppercase tracking-tight animate-in fade-in slide-in-from-top-1 duration-150">
          {MESSAGES.SCORING_ERR_TIER_MISMATCH}
        </span>
      )}
    </div>
  );
};
