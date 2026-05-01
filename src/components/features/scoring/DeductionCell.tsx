// src/components/features/scoring/DeductionCell.tsx
import React, { useState, useEffect } from 'react';
import { trimZero } from '../../../utils/scoreFormatter';

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
 * - 0.1 単位での入力を許容
 */
export const DeductionCell: React.FC<DeductionCellProps> = ({ value, showMinus = false, variant = 'compact', onChange }) => {
  const [inputStr, setInputStr] = useState(value !== undefined && value > 0 ? value.toString() : '');

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

  if (variant === 'detailed') {
    return (
      <div className="flex items-center gap-2 w-full max-w-[200px]">
        {showMinus && (
          <span className="text-danger font-bold text-sm select-none tabular-nums">−</span>
        )}
        <input
          type="text"
          inputMode="decimal"
          className="form-input py-1.5 px-3 text-right text-sm flex-1 font-bold tabular-nums border-danger/30 text-danger bg-danger-bg/5 focus:border-danger focus:ring-danger/20 transition-all"
          value={inputStr}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          placeholder="0"
        />
        <span className="text-danger/50 text-xs font-bold w-4 select-none">pt</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 justify-center">
      {showMinus && (
        <span className="text-danger font-bold text-sm select-none tabular-nums">−</span>
      )}
      <input
        type="text"
        inputMode="decimal"
        className="form-input py-0.5 px-1 text-right text-sm w-12 font-bold tabular-nums border-danger/30 text-danger focus:border-danger focus:ring-danger/20"
        value={inputStr}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        placeholder="0"
      />
      <span className="text-[10px] text-danger/50 font-bold uppercase tracking-tighter select-none">pt</span>
    </div>
  );
};
