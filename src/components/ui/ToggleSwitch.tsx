import { twMerge } from 'tailwind-merge';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleSwitchProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  small?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ options, value, onChange, className = '', small }) => {
  const activeIndex = options.findIndex(opt => opt.value === value);
  const widthPercentage = 100 / options.length;

  return (
    <div className={twMerge('relative flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full select-none', className)}>
      {/* Sliding Background */}
      <div 
        className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ 
          width: `calc(${widthPercentage}% - 4px)`,
          left: `calc(${activeIndex * widthPercentage}% + ${activeIndex === 0 ? '4px' : '2px'})` 
        }}
      />
      
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            className={`relative z-10 flex-1 text-center ${small ? 'py-1' : 'py-2'} text-[10px] font-bold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              isActive ? 'text-primary dark:text-primary-light' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
