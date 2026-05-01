export interface TierDefinition {
  id: string;
  label: string;
  percentage: number;
  color: string; // CSS color or hex
  bgClass?: string; // Tailwind class if applicable
  textClass?: string;
}

export const TIERS: TierDefinition[] = [
  { id: 'S+', label: 'S+', percentage: 95, color: '#E5E4E2', bgClass: 'bg-[#E5E4E2]/20', textClass: 'text-[#8E8E8E]' }, // Platinum
  { id: 'S', label: 'S', percentage: 90, color: '#FFD1DC', bgClass: 'bg-[#FFD1DC]/30', textClass: 'text-[#D48192]' }, // Light Pink
  { id: 'A+', label: 'A+', percentage: 85, color: '#FFB6C1', bgClass: 'bg-[#FFB6C1]/30', textClass: 'text-[#C7707D]' }, // Pink
  { id: 'A', label: 'A', percentage: 80, color: '#FFB6C1', bgClass: 'bg-[#FFB6C1]/20', textClass: 'text-[#C7707D]' }, // Pink (lighter)
  { id: 'B', label: 'B', percentage: 75, color: '#FF6B6B', bgClass: 'bg-[#FF6B6B]/20', textClass: 'text-[#E63946]' }, // Red
  { id: 'C', label: 'C', percentage: 70, color: '#FF922B', bgClass: 'bg-[#FF922B]/20', textClass: 'text-[#D9480F]' }, // Orange
  { id: 'D', label: 'D', percentage: 65, color: '#FCC419', bgClass: 'bg-[#FCC419]/20', textClass: 'text-[#947600]' }, // Yellow
  { id: 'E', label: 'E', percentage: 60, color: '#94D82D', bgClass: 'bg-[#94D82D]/20', textClass: 'text-[#5C940D]' }, // Yellow Green
  { id: 'F', label: 'F', percentage: 55, color: '#339AF0', bgClass: 'bg-[#339AF0]/20', textClass: 'text-[#1971C2]' }, // Light Blue
  { id: 'G', label: 'G', percentage: 50, color: '#ADB5BD', bgClass: 'bg-[#ADB5BD]/20', textClass: 'text-[#495057]' }, // Grey
];

export const getTierById = (id: string) => TIERS.find(t => t.id === id);
