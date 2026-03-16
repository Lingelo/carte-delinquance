import { useState, useCallback, useMemo } from 'react';
import type { FilterState } from './types';
import { useData, useFilteredStats, useTrendData } from './hooks/useData';
import Controls from './components/Controls';
import MapView from './components/MapView';
import Legend from './components/Legend';
import NationalStats from './components/NationalStats';
import RankingChart from './components/RankingChart';
import TrendChart from './components/TrendChart';
import DepartmentDetail from './components/DepartmentDetail';

export default function App() {
  const { records, geojson, loading, error, indicators, years } = useData();

  const [filters, setFilters] = useState<FilterState>({
    indicateur: '',
    annee: 2023,
    metric: 'taux',
  });
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const activeFilters = useMemo<FilterState>(
    () => ({
      ...filters,
      indicateur: filters.indicateur || indicators[0] || '',
      annee: filters.annee || years[years.length - 1] || 2023,
    }),
    [filters, indicators, years],
  );

  const stats = useFilteredStats(records, geojson, activeFilters);
  const nationalTrend = useTrendData(records, activeFilters.indicateur);
  const deptTrend = useTrendData(records, activeFilters.indicateur, selectedDept ?? undefined);

  const selectedNom = useMemo(() => {
    if (!selectedDept || !geojson) return '';
    const f = geojson.features.find((feat) => feat.properties.code === selectedDept);
    return f?.properties.nom ?? selectedDept;
  }, [selectedDept, geojson]);

  const handleFilterChange = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSelectDept = useCallback((code: string | null) => {
    setSelectedDept(code);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-slate-500">Chargement des donnees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-slate-200 bg-slate-800 px-6 py-3">
        <h1 className="text-lg font-bold text-white">Carte de la Delinquance en France</h1>
      </header>

      <Controls
        indicators={indicators}
        years={years}
        filters={activeFilters}
        onChange={handleFilterChange}
      />

      <div className="flex min-h-0 flex-1">
        {/* Left: Map 60% */}
        <div className="relative w-3/5 border-r border-slate-200">
          {geojson && (
            <MapView
              geojson={geojson}
              stats={stats}
              metric={activeFilters.metric}
              selectedDept={selectedDept}
              onSelect={handleSelectDept}
            />
          )}
          <Legend stats={stats} metric={activeFilters.metric} />
        </div>

        {/* Right: Dashboard 40% */}
        <div className="w-2/5 overflow-y-auto bg-white">
          <NationalStats
            stats={stats}
            records={records}
            indicateur={activeFilters.indicateur}
            annee={activeFilters.annee}
          />

          <div className="border-t border-slate-200">
            <TrendChart
              data={nationalTrend}
              metric={activeFilters.metric}
              title="Evolution nationale"
            />
          </div>

          <div className="border-t border-slate-200">
            <RankingChart stats={stats} metric={activeFilters.metric} />
          </div>

          {selectedDept && (
            <>
              <div className="border-t border-slate-200">
                <TrendChart
                  data={deptTrend}
                  metric={activeFilters.metric}
                  title={`Evolution - ${selectedNom}`}
                />
              </div>
              <div className="border-t border-slate-200">
                <DepartmentDetail
                  records={records}
                  codeDepartement={selectedDept}
                  nomDepartement={selectedNom}
                  annee={activeFilters.annee}
                  onClose={() => setSelectedDept(null)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
