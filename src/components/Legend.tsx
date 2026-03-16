import { useMemo } from 'react';
import { quantileThresholds, SCALE } from '../utils/colors';
import type { DepartmentStats, MetricMode } from '../types';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  stats: DepartmentStats[];
  metric: MetricMode;
}

export default function Legend({ stats, metric }: Props) {
  const values = useMemo(
    () => stats.map((s) => (metric === 'nombre' ? s.nombre : s.tauxPourMille)),
    [stats, metric],
  );
  const thresholds = useMemo(() => quantileThresholds(values), [values]);
  const formatter = metric === 'nombre' ? formatNumber : formatRate;

  if (thresholds.length === 0) return null;

  const labels: string[] = [];
  labels.push(`< ${formatter(thresholds[0])}`);
  for (let i = 0; i < thresholds.length - 1; i++) {
    labels.push(`${formatter(thresholds[i])} - ${formatter(thresholds[i + 1])}`);
  }
  labels.push(`> ${formatter(thresholds[thresholds.length - 1])}`);

  return (
    <div className="absolute bottom-6 left-4 z-[1000] rounded-lg bg-white/90 p-3 shadow-md backdrop-blur-sm">
      <div className="mb-1.5 text-xs font-semibold text-slate-700">
        {metric === 'nombre' ? 'Nombre' : 'Taux pour 1000 hab.'}
      </div>
      <div className="space-y-1">
        {SCALE.map((color, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-slate-600">{labels[i] ?? ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
