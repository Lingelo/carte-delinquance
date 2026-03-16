export interface DelinquanceRecord {
  codeDepartement: string;
  codeRegion: string;
  annee: number;
  indicateur: string;
  uniteDeCompte: string;
  nombre: number;
  tauxPourMille: number;
  inseePop: number;
}

export interface DepartementFeature {
  type: 'Feature';
  properties: {
    code: string;
    nom: string;
  };
  geometry: GeoJSON.Geometry;
}

export interface DepartementGeoJSON {
  type: 'FeatureCollection';
  features: DepartementFeature[];
}

export type MetricMode = 'nombre' | 'taux';

export interface FilterState {
  indicateur: string;
  annee: number;
  metric: MetricMode;
}

export interface DepartmentStats {
  codeDepartement: string;
  nom: string;
  nombre: number;
  tauxPourMille: number;
  inseePop: number;
}
