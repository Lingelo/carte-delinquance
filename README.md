# Carte de la Delinquance

Dashboard interactif visualisant les statistiques de la delinquance enregistree par la police et la gendarmerie nationales en France, par departement.

## Fonctionnalites

- Carte choropleth par departement avec echelle quantile (vert-rouge)
- 15 indicateurs de delinquance (vols, violences, cambriolages, etc.)
- Donnees de 2016 a 2023
- Bascule nombre absolu / taux pour 1000 habitants
- Statistiques nationales avec evolution annuelle
- Classement top 10 departements (Recharts BarChart)
- Evolution temporelle nationale et par departement (Recharts LineChart)
- Detail par departement : tableau de tous les indicateurs

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Leaflet / react-leaflet
- Recharts

## Developpement

```bash
npm install
node scripts/fetch-data.mjs   # telecharge et prepare les donnees
npm run dev                    # http://localhost:5173/carte-delinquance/
npm run build                  # tsc -b && vite build
```

## Source des donnees

- [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/) - Statistiques departementales de la delinquance
- [france-geojson](https://github.com/gregoiredavid/france-geojson) - Contours des departements

## Deploiement

GitHub Pages via `.github/workflows/deploy.yml`. Mise a jour trimestrielle des donnees via `.github/workflows/update-data.yml`.
