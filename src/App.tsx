import { useState } from 'react';
import './App.css';
import React from 'react';
import { Membre } from './model/membre';

function Cadeaux() {
  const [membres, setMembres] = useState<Membre[]>([
    {
      nom: 'Guerric',
      famille: 'Prunet',
    },
    {
      nom: 'Hélène',
      famille: 'Prunet',
    },
    {
      nom: 'Gémo',
      famille: 'Gémo',
    },
    {
      nom: 'Padre',
      famille: 'Padre',
    },
    {
      nom: 'Madre',
      famille: 'Madre',
    },
    {
      nom: 'Sébastien',
      famille: 'Garcia',
    },
    {
      nom: 'Nis',
      famille: 'Garcia',
    },
  ]);
  const [resultat, setResultat] = useState<{ donneur: Membre, receveur: Membre }[]>([]);

  function compute() {
    const donneursTries = Object.values(Object.groupBy(membres, m => m.famille)).sort((a, b) => b.length - a.length).flat();
    const receveurs = [...membres];

    const resultat = donneursTries.map(m => {
      const receveursEligibles = receveurs.filter(x => x !== m);
      const receveurEluIndex = Math.floor(Math.random() * receveursEligibles.length);
      const [receveur] = receveurs.splice(receveurEluIndex, 1);
      return { donneur: m, receveur };
    });

    setResultat(resultat);
  }

  return [
    <table key={0}>
      <caption>Cadeaux</caption>
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Famille</th>
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
                setMembres([...membres, { nom: '', famille: '' }])
              }
            >
              Ajouter un membre
            </button>
          </th>
          <button onClick={compute}>Bouléguer</button>
        </tr>
      </tfoot>
    </table>,
    resultat.length ? <table style={{ width: '100%' }}>
      <caption>Résultat</caption>

      <thead>
        <tr>
          <th scope="col">Donneur</th>
          <th scope="col">Receveur</th>
        </tr>
      </thead>

      {
        resultat.map((r, i) => (
          <tr key={i}>
            <td>{r.donneur.nom}</td>
            <td>{r.receveur.nom}</td>
          </tr>
        ))
      }
    </table> : <></>
  ]


}

export default Cadeaux;
