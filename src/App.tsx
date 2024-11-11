import { useState } from 'react';
import './App.css';
import React from 'react';
import { Membre } from './model/membre';
import { calculerRepartitionEnfants } from './service/enfants';
import { Resultat } from './components/Resultat';
import { calculerRepartitionAdultes } from './service/adultes';

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
  const [repartitionAdultes, setRepartitionAdultes] = useState<{ donneur: Membre, receveur: Membre }[]>([]);
  const [repartitionEnfants, setRepartitionEnfants] = useState<{ donneur: Membre, receveur: Membre }[]>([]);
  const [erreurAdultes, setErreurAdultes] = useState(false);
  const [erreurEnfants, setErreurEnfants] = useState(false);

  function calculer() {
    const solutionAdultes = calculerRepartitionAdultes(membres);
    afficherSolution(solutionAdultes, setRepartitionAdultes, setErreurAdultes);

    const solutionEnfants = calculerRepartitionEnfants(membres);
    afficherSolution(solutionEnfants, setRepartitionEnfants, setErreurEnfants);
  }

  function afficherSolution(
    solution: { donneur: Membre; receveur: Membre; }[],
    stateSetter: (value: React.SetStateAction<{ donneur: Membre; receveur: Membre; }[]>) => void,
    errorSetter: (value: React.SetStateAction<boolean>) => void) {
    if (solution) {
      stateSetter(solution);
      errorSetter(false);
    } else {
      stateSetter([]);
      errorSetter(true);
    }
  }

  return [
    <table key={0}>
      <caption>Cadeaux</caption>
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Famille</th>
          <th scope="col">Enfant</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {membres.map((m, i) => (
          <tr key={i}>
            <td>
              <input
                value={m.nom}
                onChange={(event) => {
                  const newMembres = [...membres];
                  newMembres[i].nom = event.target.value;
                  setMembres(newMembres);
                }}
              />
            </td>
            <td>
              <input
                value={m.famille}
                onChange={(event) => {
                  const newMembres = [...membres];
                  newMembres[i].famille = event.target.value;
                  setMembres(newMembres);
                }}
              />
            </td>
            <td>
              <input type='checkbox'
                checked={m.enfant}
                onChange={(event) => {
                  const newMembres = [...membres];
                  newMembres[i].enfant = event.target.checked;
                  setMembres(newMembres);
                }}
              />
            </td>
            <td>
              <button onClick={() => {
                setMembres(membres.filter((_, idx) => idx !== i))
              }}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colSpan={2}>
            <button
              onClick={() =>
                setMembres([...membres, { nom: '', famille: '', enfant: false }])
              }
            >
              Ajouter un membre
            </button>
          </th>
          <button onClick={calculer}>Bouléguer</button>
        </tr>
      </tfoot>
    </table>,
    repartitionAdultes.length ? <Resultat titre="Répartition adultes" resultat={repartitionAdultes} erreur={erreurAdultes} /> : <></>,
    repartitionEnfants.length ? <Resultat titre="Répartition enfants" resultat={repartitionEnfants} erreur={erreurEnfants} /> : <></>,
  ]
}

export default Cadeaux;
