// src/components/ui/ToggleSwitch.tsx
import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleSwitchProps {
  options: [ToggleOption, ToggleOption];
  value: string;
  onChange: (value: string) => void;
  className?: string; // Optional class for sizing or spacing
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ options, value, onChange, className = '' }) => {
  const isRight = value === options[1].value;

  return (
    <div className={`toggle-switch-wrapper ${className}`}>
      <div
        className={`toggle-switch-slider ${isRight ? 'right' : ''}`}
        style={{ background: 'var(--color-primary)' }}
      />
      {options.map((opt) => (
        <div
          key={opt.value}
          className="toggle-switch-option text-sm"
          style={{ color: value === opt.value ? '#fff' : '#6b7280' }}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
};
