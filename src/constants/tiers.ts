export interface TierDefinition {
  id: string;
  label: string;
  percentage: number;
  color: string; // CSS color or hex
  bgClass?: string; // Tailwind class if applicable
  textClass?: string;
}

export const TIERS: TierDefinition[] = [
  { id: 'S+', label: 'S+', percentage: 95, color: '#A855F7', bgClass: 'bg-[#A855F7]/20', textClass: 'text-[#A855F7]' }, // Purple 500
  { id: 'S', label: 'S', percentage: 90, color: '#EF4444', bgClass: 'bg-[#EF4444]/20', textClass: 'text-[#EF4444]' }, // Red 500
  { id: 'A+', label: 'A+', percentage: 85, color: '#F97316', bgClass: 'bg-[#F97316]/20', textClass: 'text-[#F97316]' }, // Orange 500
  { id: 'A', label: 'A', percentage: 80, color: '#F59E0B', bgClass: 'bg-[#F59E0B]/20', textClass: 'text-[#F59E0B]' }, // Amber 500
  { id: 'B', label: 'B', percentage: 75, color: '#FBBF24', bgClass: 'bg-[#FBBF24]/20', textClass: 'text-[#FBBF24]' }, // Yellow 400
  { id: 'C', label: 'C', percentage: 70, color: '#84CC16', bgClass: 'bg-[#84CC16]/20', textClass: 'text-[#84CC16]' }, // Lime 500
  { id: 'D', label: 'D', percentage: 65, color: '#10B981', bgClass: 'bg-[#10B981]/20', textClass: 'text-[#10B981]' }, // Green 500
  { id: 'E', label: 'E', percentage: 60, color: '#06B6D4', bgClass: 'bg-[#06B6D4]/20', textClass: 'text-[#06B6D4]' }, // Cyan 500
  { id: 'F', label: 'F', percentage: 55, color: '#3B82F6', bgClass: 'bg-[#3B82F6]/20', textClass: 'text-[#3B82F6]' }, // Blue 500
  { id: 'G', label: 'G', percentage: 50, color: '#64748B', bgClass: 'bg-[#64748B]/20', textClass: 'text-[#64748B]' }, // Slate 500
];

export const getTierById = (id: string) => TIERS.find(t => t.id === id);

/**
 * 与えられた割合（%）に最も近い Tier を返す
 */
export const getClosestTier = (percentage: number): TierDefinition => {
  return TIERS.reduce((prev, curr) => {
    return (Math.abs(curr.percentage - percentage) < Math.abs(prev.percentage - percentage) ? curr : prev);
  });
};
