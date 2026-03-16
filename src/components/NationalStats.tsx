import type { DepartmentStats } from '../types';
import type { DelinquanceRecord } from '../types';
import { useMemo } from 'react';
import { formatNumber, formatRate, formatPercent } from '../utils/format';

interface Props {
  stats: DepartmentStats[];
  records: DelinquanceRecord[];
  indicateur: string;
  annee: number;
}

export default function NationalStats({ stats, records, indicateur, annee }: Props) {
  const { total, rate, yoy } = useMemo(() => {
    const totalNombre = stats.reduce((sum, s) => sum + s.nombre, 0);
    const totalPop = stats.reduce((sum, s) => sum + s.inseePop, 0);
    const avgRate = totalPop > 0 ? (totalNombre / totalPop) * 1000 : 0;

    const prevYear = annee - 1;
    const prevRecords = records.filter(
      (r) => r.indicateur === indicateur && r.annee === prevYear,
    );
    const prevTotal = prevRecords.reduce((sum, r) => sum + r.nombre, 0);
    const yoyChange = prevTotal > 0 ? ((totalNombre - prevTotal) / prevTotal) * 100 : 0;

    return { total: totalNombre, rate: avgRate, yoy: yoyChange };
  }, [stats, records, indicateur, annee]);

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      <div className="rounded-lg bg-slate-50 p-3 text-center">
        <div className="text-xs font-medium text-slate-500 uppercase">Total national</div>
        <div className="mt-1 text-lg font-bold text-slate-800">{formatNumber(total)}</div>
      </div>
      <div className="rounded-lg bg-slate-50 p-3 text-center">
        <div className="text-xs font-medium text-slate-500 uppercase">Taux moyen</div>
        <div className="mt-1 text-lg font-bold text-slate-800">{formatRate(rate)} /1000</div>
      </div>
      <div className="rounded-lg bg-slate-50 p-3 text-center">
        <div className="text-xs font-medium text-slate-500 uppercase">Evolution N-1</div>
        <div
          className={`mt-1 text-lg font-bold ${yoy > 0 ? 'text-red-600' : yoy < 0 ? 'text-green-600' : 'text-slate-800'}`}
        >
          {formatPercent(yoy)}
        </div>
      </div>
    </div>
  );
}
