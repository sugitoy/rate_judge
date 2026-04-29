import { twMerge } from 'tailwind-merge';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleSwitchProps {
  options: [ToggleOption, ToggleOption];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  small?: boolean; // 追加
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ options, value, onChange, className = '', small }) => {
  const isRight = value === options[1].value;

  return (
    <div className={twMerge('relative flex bg-slate-100 p-1 rounded-xl w-full select-none', className)}>
      {/* Sliding Background */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-200 ease-out ${
          isRight ? 'left-[calc(50%+2px)]' : 'left-1'
        }`}
      />
      
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            className={`relative z-10 flex-1 text-center ${small ? 'py-1' : 'py-2'} text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
};
