import { useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import type { DepartementGeoJSON, DepartmentStats, MetricMode, DepartementFeature } from '../types';
import { quantileThresholds, getColor } from '../utils/colors';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  geojson: DepartementGeoJSON;
  stats: DepartmentStats[];
  metric: MetricMode;
  selectedDept: string | null;
  onSelect: (code: string | null) => void;
}

export default function MapView({ geojson, stats, metric, selectedDept, onSelect }: Props) {
  const statsMap = useMemo(() => {
    const m = new Map<string, DepartmentStats>();
    for (const s of stats) m.set(s.codeDepartement, s);
    return m;
  }, [stats]);

  const values = useMemo(
    () => stats.map((s) => (metric === 'nombre' ? s.nombre : s.tauxPourMille)),
    [stats, metric],
  );
  const thresholds = useMemo(() => quantileThresholds(values), [values]);

  const style = useCallback(
    (feature: DepartementFeature | undefined) => {
      if (!feature) return {};
      const code = feature.properties.code;
      const s = statsMap.get(code);
      const val = s ? (metric === 'nombre' ? s.nombre : s.tauxPourMille) : 0;
      const isSelected = code === selectedDept;
      return {
        fillColor: s ? getColor(val, thresholds) : '#e2e8f0',
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#1e293b' : '#94a3b8',
        fillOpacity: 0.75,
      };
    },
    [statsMap, metric, thresholds, selectedDept],
  );

  const onEachFeature = useCallback(
    (feature: DepartementFeature, layer: Layer) => {
      const code = feature.properties.code;
      const nom = feature.properties.nom;
      const s = statsMap.get(code);

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle({ weight: 3, color: '#1e293b' });
          target.bringToFront();
          const tooltip = s
            ? `<strong>${nom} (${code})</strong><br/>Nombre: ${formatNumber(s.nombre)}<br/>Taux: ${formatRate(s.tauxPourMille)} /1000`
            : `<strong>${nom} (${code})</strong><br/>Pas de donnees`;
          target.bindTooltip(tooltip).openTooltip();
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          if (code !== selectedDept) {
            target.setStyle({ weight: 1, color: '#94a3b8' });
          }
          target.closeTooltip();
        },
        click: () => {
          onSelect(code === selectedDept ? null : code);
        },
      });
    },
    [statsMap, selectedDept, onSelect],
  );

  const key = `${metric}-${thresholds.join(',')}-${selectedDept}`;

  return (
    <MapContainer center={[46.5, 2.5]} zoom={6} className="h-full w-full" scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        key={key}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={geojson as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={style as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature={onEachFeature as any}
      />
    </MapContainer>
  );
}
