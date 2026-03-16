import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DepartmentStats, MetricMode } from '../types';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  stats: DepartmentStats[];
  metric: MetricMode;
}

export default function RankingChart({ stats, metric }: Props) {
  const data = useMemo(() => {
    const sorted = [...stats]
      .sort((a, b) =>
        metric === 'nombre' ? b.nombre - a.nombre : b.tauxPourMille - a.tauxPourMille,
      )
      .slice(0, 10);
    return sorted.map((s) => ({
      name: `${s.codeDepartement} - ${s.nom}`,
      value: metric === 'nombre' ? s.nombre : s.tauxPourMille,
    }));
  }, [stats, metric]);

  const formatter = metric === 'nombre' ? formatNumber : formatRate;

  return (
    <div className="p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-700">Top 10 departements</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatter(v)} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
          <Tooltip
            formatter={(value) => [formatter(Number(value)), metric === 'nombre' ? 'Nombre' : 'Taux /1000']}
          />
          <Bar dataKey="value" fill="#475569" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
