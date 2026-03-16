import { useMemo } from 'react';
import type { DelinquanceRecord } from '../types';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  records: DelinquanceRecord[];
  codeDepartement: string;
  nomDepartement: string;
  annee: number;
  onClose: () => void;
}

export default function DepartmentDetail({ records, codeDepartement, nomDepartement, annee, onClose }: Props) {
  const rows = useMemo(() => {
    return records
      .filter((r) => r.codeDepartement === codeDepartement && r.annee === annee)
      .sort((a, b) => b.nombre - a.nombre);
  }, [records, codeDepartement, annee]);

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {nomDepartement} ({codeDepartement}) - {annee}
        </h3>
        <button
          onClick={onClose}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          Fermer
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-1.5 text-left font-medium text-slate-500">Indicateur</th>
              <th className="py-1.5 text-right font-medium text-slate-500">Nombre</th>
              <th className="py-1.5 text-right font-medium text-slate-500">Taux /1000</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.indicateur} className="border-b border-slate-100">
                <td className="py-1.5 text-slate-700">{r.indicateur}</td>
                <td className="py-1.5 text-right tabular-nums text-slate-800">
                  {formatNumber(r.nombre)}
                </td>
                <td className="py-1.5 text-right tabular-nums text-slate-800">
                  {formatRate(r.tauxPourMille)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
