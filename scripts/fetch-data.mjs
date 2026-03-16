import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'data');

const CSV_URL =
  'https://static.data.gouv.fr/resources/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/20260129-160318/donnee-dep-data.gouv-2025-geographie2025-produit-le2026-01-22.csv';
const GEOJSON_URL =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson';

function parseFrenchDecimal(str) {
  if (!str || str.trim() === '') return 0;
  return parseFloat(str.replace(',', '.'));
}

function stripBOM(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

async function fetchCSV() {
  console.log('Downloading CSV...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`CSV download failed: ${res.status}`);
  const raw = stripBOM(await res.text());

  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  const header = lines[0].split(';').map((h) => h.trim().replace(/"/g, ''));
  console.log(`CSV headers: ${header.join(', ')}`);
  console.log(`${lines.length - 1} data rows`);

  const colIdx = {
    codeDep: header.indexOf('Code_departement') !== -1 ? header.indexOf('Code_departement') : header.indexOf('Code.departement'),
    codeReg: header.indexOf('Code_region') !== -1 ? header.indexOf('Code_region') : header.indexOf('Code.region'),
    annee: header.indexOf('annee'),
    indicateur: header.indexOf('indicateur'),
    unite: header.indexOf('unite_de_compte') !== -1 ? header.indexOf('unite_de_compte') : header.indexOf('unite.de.compte'),
    nombre: header.indexOf('nombre'),
    taux: header.indexOf('taux_pour_mille') !== -1 ? header.indexOf('taux_pour_mille') : header.indexOf('taux.pour.mille'),
    pop: header.indexOf('insee_pop') !== -1 ? header.indexOf('insee_pop') : header.indexOf('insee.pop'),
  };

  // Fallback: try finding columns by partial match
  for (const [key, idx] of Object.entries(colIdx)) {
    if (idx === -1) {
      const found = header.findIndex((h) => h.toLowerCase().includes(key.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()));
      if (found !== -1) colIdx[key] = found;
    }
  }

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';').map((c) => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < header.length) continue;

    const codeDep = cols[colIdx.codeDep] || '';
    // Skip regional/national aggregates
    if (!codeDep || codeDep.length > 3) continue;

    records.push({
      codeDepartement: codeDep,
      codeRegion: cols[colIdx.codeReg] || '',
      annee: parseInt(cols[colIdx.annee], 10),
      indicateur: cols[colIdx.indicateur] || '',
      uniteDeCompte: cols[colIdx.unite] || '',
      nombre: Math.round(parseFrenchDecimal(cols[colIdx.nombre])),
      tauxPourMille: parseFrenchDecimal(cols[colIdx.taux]),
      inseePop: Math.round(parseFrenchDecimal(cols[colIdx.pop])),
    });
  }

  console.log(`Parsed ${records.length} department-level records`);
  const indicators = new Set(records.map((r) => r.indicateur));
  console.log(`Indicators (${indicators.size}): ${[...indicators].join(', ')}`);
  const years = new Set(records.map((r) => r.annee));
  console.log(`Years: ${[...years].sort().join(', ')}`);

  return records;
}

async function fetchGeoJSON() {
  console.log('Downloading GeoJSON...');
  const res = await fetch(GEOJSON_URL);
  if (!res.ok) throw new Error(`GeoJSON download failed: ${res.status}`);
  return res.json();
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const [records, geojson] = await Promise.all([fetchCSV(), fetchGeoJSON()]);

  const wrapped = {
    meta: { generatedAt: new Date().toISOString() },
    records,
  };
  const jsonPath = join(OUT_DIR, 'delinquance.json');
  writeFileSync(jsonPath, JSON.stringify(wrapped));
  console.log(`Wrote ${jsonPath} (${(JSON.stringify(wrapped).length / 1024 / 1024).toFixed(1)} MB)`);

  const geoPath = join(OUT_DIR, 'departements.geojson');
  writeFileSync(geoPath, JSON.stringify(geojson));
  console.log(`Wrote ${geoPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
