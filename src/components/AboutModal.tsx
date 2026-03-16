import { timeAgo } from '../utils/format';

interface Props {
  onClose: () => void;
  lastUpdate?: string;
}

export default function AboutModal({ onClose, lastUpdate }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">A propos</h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            Cette carte presente les statistiques departementales de la delinquance
            enregistree par la police et la gendarmerie nationales. Elle permet de
            comparer les departements, de suivre l'evolution temporelle des
            differents indicateurs et d'analyser les taux pour mille habitants.
          </p>
          <p>
            <strong>Source :</strong> SSMSI (Service Statistique Ministeriel de la
            Securite Interieure) — Bases statistiques departementales de la
            delinquance enregistree par la police et la gendarmerie nationales ·{' '}
            <a
              href="https://www.data.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              data.gouv.fr
            </a>
          </p>
          <p>
            <strong>Licence :</strong> ODbL
          </p>
          {lastUpdate && (
            <p>
              <strong>Derniere mise a jour :</strong> {timeAgo(lastUpdate)}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
