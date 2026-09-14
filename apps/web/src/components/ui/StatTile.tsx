import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export function StatTile({
  label,
  value,
  hint,
  icon = 'chart',
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: IconName;
}) {
  return (
    <div className="stat-tile">
      <div className="stat-top">
        <span>{label}</span>
        <Icon name={icon} size={18} />
      </div>
      <div className="stat-value">{value}</div>
      {hint && <p>{hint}</p>}
    </div>
  );
}
