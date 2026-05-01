// src/components/ui/Select.tsx
import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  /** 選択中の値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** 選択肢リスト */
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * デザインシステムに統合されたカスタムドロップダウン。
 * ネイティブ select の代替として展開パネルをフルスタイリング可能にする。
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? '';

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape キーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* トリガーボタン */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'w-full flex items-center justify-between gap-2',
          'px-3 py-2 text-sm text-slate-950 bg-white',
          'border border-slate-200 rounded-xl',
          'transition-all duration-150',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light',
          isOpen ? 'border-primary ring-2 ring-primary-light' : 'hover:border-slate-300 hover:bg-slate-50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <span className={selectedOption ? 'text-slate-950' : 'text-slate-300'}>
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ドロップダウンパネル */}
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className={[
            'absolute z-50 mt-1.5 w-full',
            'bg-white border border-slate-200 rounded-xl shadow-lg',
            'py-1.5 overflow-y-auto max-h-60',
            'animate-in fade-in-0 slide-in-from-top-1 duration-150',
          ].join(' ')}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !option.disabled && handleSelect(option.value)}
                className={[
                  'flex items-center justify-between gap-2',
                  'px-3 py-2 text-sm cursor-pointer select-none',
                  'transition-colors duration-100',
                  isSelected
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-slate-700 hover:bg-slate-50',
                  option.disabled ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={13} className="text-primary shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
