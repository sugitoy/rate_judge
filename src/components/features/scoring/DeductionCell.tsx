// src/components/features/scoring/DeductionCell.tsx
import React, { useState, useEffect } from 'react';
import { trimZero, isValidUnit } from '../../../utils/scoreFormatter';
import { useUIStore } from '../../../store/useUIStore';
import { MESSAGES } from '../../../constants/messages';

interface DeductionCellProps {
  /** 減点の現在値（絶対値）。未入力の場合は undefined */
  value?: number;
  /** 入力枠の左外側に「−」を表示するか。詳細モーダルではtrue、テーブルではfalse */
  showMinus?: boolean;
  /** 表示バリアント。'detailed' は詳細モーダル用 */
  variant?: 'compact' | 'detailed';
  onChange: (val: number) => void;
}

/**
 * 減点入力セル
 * - 絶対値（正の数）で入力する
 * - pt モード固定（%変換なし）
 * - 常に 0.1 単位での入力を許容する
 */
export const DeductionCell: React.FC<DeductionCellProps> = ({ value, showMinus = false, variant = 'compact', onChange }) => {
  const { setIsEditing } = useUIStore();
  const [inputStr, setInputStr] = useState(value !== undefined && value > 0 ? value.toString() : '');

  const DEDUCTION_UNIT = 0.1;

  useEffect(() => {
    if (value === undefined || value === 0) {
      setInputStr('');
      return;
    }
    const current = parseFloat(inputStr);
    if (isNaN(current) || Math.abs(current - value) > 0.0000000001) {
      setInputStr(value.toString());
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = trimZero(e.target.value.replace(/[^0-9.]/g, ''));
    setInputStr(newVal);

    const num = parseFloat(newVal);
    if (!isNaN(num) && num >= 0) {
      onChange(num);
    } else {
      onChange(0);
    }
  };

  const isInvalidUnit = !isValidUnit(inputStr, DEDUCTION_UNIT);

  if (variant === 'detailed') {
    return (
      <div className="flex flex-col gap-1 w-full max-w-[200px]">
        <div className="flex items-center gap-2 w-full">
          {showMinus && (
            <span className="text-danger font-bold text-sm select-none tabular-nums">−</span>
          )}
          <input
            type="text"
            inputMode="decimal"
            className={`form-input py-1.5 px-3 text-right text-sm flex-1 font-bold tabular-nums transition-all ${isInvalidUnit
                ? 'border-danger text-danger bg-danger-bg focus:ring-danger/20'
                : 'border-danger/30 text-danger bg-danger-bg/5 focus:border-danger focus:ring-danger/20'
              }`}
            value={inputStr}
            onChange={handleChange}
            onFocus={(e) => {
              e.target.select();
              setIsEditing(true);
            }}
            onBlur={() => setIsEditing(false)}
            placeholder="0"
          />
          <span className="text-danger/50 text-xs font-bold w-4 select-none">pt</span>
        </div>
        {isInvalidUnit && (
          <span className="text-[10px] text-danger font-bold uppercase tracking-tight">
            {MESSAGES.SCORING_ERR_UNIT}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-0.5 h-full w-full">
      <div className="flex items-center gap-1 justify-center">
        {showMinus && (
          <span className="text-danger font-bold text-sm select-none tabular-nums">−</span>
        )}
        <input
          type="text"
          inputMode="decimal"
          className={`form-input py-0.5 px-1 text-right text-sm w-12 font-bold tabular-nums transition-all ${isInvalidUnit
              ? 'border-danger text-danger bg-danger-bg focus:ring-danger/20'
              : 'border-danger/30 text-danger focus:border-danger focus:ring-danger/20'
            }`}
          value={inputStr}
          onChange={handleChange}
          onFocus={(e) => {
            e.target.select();
            setIsEditing(true);
          }}
          onBlur={() => setIsEditing(false)}
          placeholder="0"
        />
        <span className="text-[10px] text-danger/50 font-bold uppercase tracking-tighter select-none">pt</span>
      </div>
      {isInvalidUnit && (
        <span className="text-[9px] text-danger font-bold uppercase tracking-tight leading-none">
          {MESSAGES.SCORING_ERR_UNIT}
        </span>
      )}
    </div>
  );
};
