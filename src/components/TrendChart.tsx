import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { MetricMode } from '../types';
import { formatNumber, formatRate } from '../utils/format';

interface TrendPoint {
  annee: number;
  nombre: number;
  tauxPourMille: number;
}

interface Props {
  data: TrendPoint[];
  metric: MetricMode;
  title: string;
}

export default function TrendChart({ data, metric, title }: Props) {
  const dataKey = metric === 'nombre' ? 'nombre' : 'tauxPourMille';
  const formatter = metric === 'nombre' ? formatNumber : formatRate;

  if (data.length === 0) return null;

  return (
    <div className="p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatter(v)} />
          <Tooltip
            formatter={(value) => [formatter(Number(value)), metric === 'nombre' ? 'Nombre' : 'Taux /1000']}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#334155"
            strokeWidth={2}
            dot={{ r: 3, fill: '#334155' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
