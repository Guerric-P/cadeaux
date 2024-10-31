import { useState } from 'react';
import './App.css';
import React from 'react';
import { Membre } from './model/membre';
import { GraphNode } from './model/graph-node';
import { shuffleArray } from './util/array';

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
  const [erreur, setErreur] = useState(false);

  function compute() {
    const graphNodes: GraphNode[] = membres.map(m => ({ membre: m, linked: [] }));
    graphNodes.forEach(n => n.linked = graphNodes.filter(x => x.membre !== n.membre && x.membre.famille !== n.membre.famille));
    const [initialNode] = graphNodes;

    const path = traverseGraph([initialNode], graphNodes.length);

    if (path.length === graphNodes.length) {
      const solution = path.map((x, i, { [i - 1]: last }) => last && { donneur: last.membre, receveur: x.membre }).filter(x => x);
      setResultat(solution);
      setErreur(false);
    } else {
      setResultat([]);
      setErreur(true);
    }
  }

  function traverseGraph(path: GraphNode[], finalLength: number): GraphNode[] {
    if (path.length === finalLength)
      return path;
    const { [path.length - 1]: lastNode } = path;
    const filteredLinked = lastNode.linked.filter(x => !path.includes(x));
    if (filteredLinked.length === 1) {
      const result = traverseGraph([...path, filteredLinked[0]], finalLength);
      if (result.length === finalLength)
        return result;
    }
    else {
      const indexes = Object.keys(filteredLinked);
      shuffleArray(indexes);
      for (const i of indexes) {
        const result = traverseGraph([...path, filteredLinked[i]], finalLength);
        if (result.length === finalLength)
          return result;
      }
    }

    return path.filter(x => x !== lastNode);
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
    </table> : <></>,
    erreur ? <div>Aucune répartition n'existe pour les contraintes données.</div> : <></>
  ]
}

export default Cadeaux;
