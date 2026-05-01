export interface TierDefinition {
  id: string;
  label: string;
  percentage: number;
  color: string; // CSS color or hex
  bgClass?: string; // Tailwind class if applicable
  textClass?: string;
}

export const TIERS: TierDefinition[] = [
  { id: 'S+', label: 'S+', percentage: 95, color: 'var(--tier-s-plus)', bgClass: 'bg-tier-s-plus/15', textClass: 'text-tier-s-plus' },
  { id: 'S', label: 'S', percentage: 90, color: 'var(--tier-s)', bgClass: 'bg-tier-s/15', textClass: 'text-tier-s' },
  { id: 'A+', label: 'A+', percentage: 85, color: 'var(--tier-a-plus)', bgClass: 'bg-tier-a-plus/15', textClass: 'text-tier-a-plus' },
  { id: 'A', label: 'A', percentage: 80, color: 'var(--tier-a)', bgClass: 'bg-tier-a/15', textClass: 'text-tier-a' },
  { id: 'B', label: 'B', percentage: 75, color: 'var(--tier-b)', bgClass: 'bg-tier-b/15', textClass: 'text-tier-b' },
  { id: 'C', label: 'C', percentage: 70, color: 'var(--tier-c)', bgClass: 'bg-tier-c/15', textClass: 'text-tier-c' },
  { id: 'D', label: 'D', percentage: 65, color: 'var(--tier-d)', bgClass: 'bg-tier-d/15', textClass: 'text-tier-d' },
  { id: 'E', label: 'E', percentage: 60, color: 'var(--tier-e)', bgClass: 'bg-tier-e/15', textClass: 'text-tier-e' },
  { id: 'F', label: 'F', percentage: 55, color: 'var(--tier-f)', bgClass: 'bg-tier-f/15', textClass: 'text-tier-f' },
  { id: 'G', label: 'G', percentage: 50, color: 'var(--tier-g)', bgClass: 'bg-tier-g/15', textClass: 'text-tier-g' },
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
