import type { FilterState, MetricMode } from '../types';

interface Props {
  indicators: string[];
  years: number[];
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
}

export default function Controls({ indicators, years, filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b border-slate-200 md:gap-3 md:p-4">
      <label className="flex w-full items-center gap-2 text-sm font-medium text-slate-700 sm:w-auto">
        Indicateur
        <select
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-slate-500 focus:outline-none sm:flex-none"
          value={filters.indicateur}
          onChange={(e) => onChange({ indicateur: e.target.value })}
        >
          {indicators.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </label>

      <label className="flex w-full items-center gap-2 text-sm font-medium text-slate-700 sm:w-auto">
        Annee
        <select
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-slate-500 focus:outline-none sm:flex-none"
          value={filters.annee}
          onChange={(e) => onChange({ annee: Number(e.target.value) })}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-1 rounded-md border border-slate-300 bg-white p-0.5 shadow-sm">
        {(['nombre', 'taux'] as MetricMode[]).map((mode) => (
          <button
            key={mode}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              filters.metric === mode
                ? 'bg-slate-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => onChange({ metric: mode })}
          >
            {mode === 'nombre' ? 'Nombre' : 'Taux /1000'}
          </button>
        ))}
      </div>
    </div>
  );
}
