import { useState, useEffect, useMemo } from 'react';
import type { DelinquanceRecord, DepartementGeoJSON, FilterState, DepartmentStats } from '../types';

const BASE = import.meta.env.BASE_URL;

export function useData() {
  const [records, setRecords] = useState<DelinquanceRecord[]>([]);
  const [geojson, setGeojson] = useState<DepartementGeoJSON | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${BASE}data/delinquance.json`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`${BASE}data/departements.geojson`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([data, geo]) => {
        // Support both wrapped { meta, records } and raw array formats
        if (Array.isArray(data)) {
          setRecords(data as DelinquanceRecord[]);
        } else {
          setRecords(data.records as DelinquanceRecord[]);
          if (data.meta?.generatedAt) setGeneratedAt(data.meta.generatedAt);
        }
        setGeojson(geo as DepartementGeoJSON);
        setLoading(false);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const indicators = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) set.add(r.indicateur);
    return [...set].sort();
  }, [records]);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const r of records) set.add(r.annee);
    return [...set].sort();
  }, [records]);

  return { records, geojson, loading, error, indicators, years, generatedAt };
}

export function useFilteredStats(
  records: DelinquanceRecord[],
  geojson: DepartementGeoJSON | null,
  filters: FilterState,
): DepartmentStats[] {
  return useMemo(() => {
    const filtered = records.filter(
      (r) => r.indicateur === filters.indicateur && r.annee === filters.annee,
    );
    const nameMap = new Map<string, string>();
    if (geojson) {
      for (const f of geojson.features) {
        nameMap.set(f.properties.code, f.properties.nom);
      }
    }
    return filtered.map((r) => ({
      codeDepartement: r.codeDepartement,
      nom: nameMap.get(r.codeDepartement) || r.codeDepartement,
      nombre: r.nombre,
      tauxPourMille: r.tauxPourMille,
      inseePop: r.inseePop,
    }));
  }, [records, geojson, filters.indicateur, filters.annee]);
}

export function useTrendData(
  records: DelinquanceRecord[],
  indicateur: string,
  codeDepartement?: string,
) {
  return useMemo(() => {
    const filtered = records.filter(
      (r) =>
        r.indicateur === indicateur &&
        (codeDepartement ? r.codeDepartement === codeDepartement : true),
    );
    const byYear = new Map<number, { nombre: number; taux: number; pop: number }>();
    for (const r of filtered) {
      const prev = byYear.get(r.annee) || { nombre: 0, taux: 0, pop: 0 };
      byYear.set(r.annee, {
        nombre: prev.nombre + r.nombre,
        taux: prev.taux + r.tauxPourMille * r.inseePop,
        pop: prev.pop + r.inseePop,
      });
    }
    return [...byYear.entries()]
      .sort(([a], [b]) => a - b)
      .map(([annee, { nombre, taux, pop }]) => ({
        annee,
        nombre,
        tauxPourMille: pop > 0 ? taux / pop : 0,
      }));
  }, [records, indicateur, codeDepartement]);
}
