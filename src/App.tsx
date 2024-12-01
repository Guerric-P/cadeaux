import { useState } from 'react';
import './App.css';
import React from 'react';
import { Membre } from './model/membre';
import { calculerRepartitionEnfants } from './service/enfants';
import Resultat from './components/Resultat';
import LanguageSelection from './components/LanguageSelection';
import { calculerRepartitionAdultes } from './service/adultes';
import DeleteIcon from '@mui/icons-material/Delete';
import CasinoIcon from '@mui/icons-material/Casino';
import AddIcon from '@mui/icons-material/Add';
import { confetti } from '@tsparticles/confetti';
import { useTranslation } from 'react-i18next';

function Cadeaux() {
  const [membres, setMembres] = useState<Membre[]>([
    {
      nom: 'Guerric',
      famille: 'Prunet',
      enfant: false,
    },
    {
      nom: 'Hélène',
      famille: 'Prunet',
      enfant: false,
    },
    {
      nom: 'Gémo',
      famille: 'Gémo',
      enfant: false,
    },
    {
      nom: 'Padre',
      famille: 'Padre',
      enfant: false,
    },
    {
      nom: 'Madre',
      famille: 'Madre',
      enfant: false,
    },
    {
      nom: 'Sébastien',
      famille: 'Garcia',
      enfant: false,
    },
    {
      nom: 'Nis',
      famille: 'Garcia',
      enfant: false,
    },
    {
      nom: 'Louise',
      famille: 'Prunet',
      enfant: true,
    },
    {
      nom: 'Nino',
      famille: 'Garcia',
      enfant: true,
    },
    {
      nom: 'Alba',
      famille: 'Garcia',
      enfant: true,
    },
  ]);

  const [repartitionAdultes, setRepartitionAdultes] = useState<{ donneur: Membre, receveur: Membre }[]>();
  const [repartitionEnfants, setRepartitionEnfants] = useState<{ donneur: Membre, receveur: Membre }[]>();

  const { t } = useTranslation();

  function calculer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    confetti({
      position: {
        x: event.clientX / window.innerWidth * 100,
        y: event.clientY / window.innerHeight * 100,
      },
      scalar: 2,
      shapes: ["emoji"],
      shapeOptions: {
        emoji: {
          value: '🎁',
        },
      },
    });

    const solutionAdultes = calculerRepartitionAdultes(membres);
    setRepartitionAdultes(solutionAdultes || []);

    const solutionEnfants = calculerRepartitionEnfants(membres);
    setRepartitionEnfants(solutionEnfants || []);
  }

  return <>
    <LanguageSelection />
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <caption className="text-lg font-bold py-2">{t('title')}</caption>
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">{t('headers.firstName')}</th>
            <th className="px-4 py-2 text-left">{t('headers.lastName')}</th>
            <th className="px-4 py-2 text-left">{t('headers.child')}</th>
            <th className="px-4 py-2 text-left">{t('headers.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {membres.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="sm:px-4 sm:py-2 p-1">
                <input
                  className="border rounded p-1 w-full sm:p-2 sm:w-auto"
                  value={m.nom}
                  onChange={(event) => {
                    const newMembres = [...membres];
                    newMembres[i].nom = event.target.value;
                    setMembres(newMembres);
                  }}
                />
              </td>
              <td className="sm:px-4 sm:py-2 p-1">
                <input
                  className="border rounded p-1 w-full sm:p-2 sm:w-auto"
                  value={m.famille}
                  onChange={(event) => {
                    const newMembres = [...membres];
                    newMembres[i].famille = event.target.value;
                    setMembres(newMembres);
                  }}
                />
              </td>
              <td className="sm:px-4 sm:py-2 p-1">
                <input
                  type="checkbox"
                  checked={m.enfant}
                  onChange={(event) => {
                    const newMembres = [...membres];
                    newMembres[i].enfant = event.target.checked;
                    setMembres(newMembres);
                  }}
                />
              </td>
              <td className="sm:px-4 sm:py-2 p-1">
                <button
                  className="text-white px-3 py-1 rounded bg-slate-800 dark:bg-transparent"
                  onClick={() => {
                    setMembres(membres.filter((_, idx) => idx !== i));
                  }}
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="px-4 py-2" colSpan={4}>
              <div className="flex justify-evenly">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded inline-flex gap-x-1.5"
                  onClick={() =>
                    setMembres([...membres, { nom: '', famille: '', enfant: false }])
                  }
                > <AddIcon />
                  {t('buttons.add')}
                </button>
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded inline-flex gap-x-1.5"
                  onClick={calculer}
                >
                  <CasinoIcon />
                  {t('buttons.randomize')}
                </button>
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div className="w-fit m-auto text-left">
      <Resultat titre={t('distribution.adultsTitle')} resultat={repartitionAdultes} />
      <Resultat titre={t('distribution.childrenTitle')} resultat={repartitionEnfants} />
    </div>
  </>;
}

export default Cadeaux;
