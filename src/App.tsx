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
  const [resultat, setResultat] = useState<{ donneur: Membre, receveur: Membre }[]>([]);
  const [erreur, setErreur] = useState(false);

  function compute() {
    const graphNodes: GraphNode[] = membres.filter(x => !x.enfant).map(m => ({ membre: m, relations: [] }));
    graphNodes.forEach(n => n.relations = graphNodes.filter(x => x.membre !== n.membre && x.membre.famille !== n.membre.famille));
    const [initialNode] = graphNodes;

    const path = findHamiltonianCycle([initialNode], graphNodes.length);

    if (path.length !== 0) {
      const solution = path.map((x, i, { [i - 1]: last }) => last && { donneur: last.membre, receveur: x.membre }).filter(x => x);
      setResultat(solution);
      setErreur(false);
    } else {
      setResultat([]);
      setErreur(true);
    }

    assignChildren(membres);
  }

  /**
   * Si possible, trouve un cycle hamiltonien dans le graphe, c'est à dire un cycle qui passe une seule fois par chacun des noeuds
   * Si pas possible, retourne un chemin vide (de taille 0)
   * 
   * @param path 
   * @param finalLength 
   * @returns 
   */
  function findHamiltonianCycle(path: GraphNode[], finalLength: number): GraphNode[] {
    const { [0]: firstNode, [path.length - 1]: lastNode } = path;

    if (path.length === finalLength) {
      // Soit on ferme le cycle si c'est possible, sinon backtrack
      return lastNode.relations.includes(firstNode) ? [...path, firstNode] : path.filter(x => x !== lastNode);
    }

    const nodesEligibles = lastNode.relations.filter(x => !path.includes(x));

    const indexes = Object.keys(nodesEligibles);

    // Randomisation pour que chaque tirage ait une chance d'être différent
    shuffleArray(indexes);

    for (const i of indexes) {
      const result = findHamiltonianCycle([...path, nodesEligibles[i]], finalLength);
      if (result.length === finalLength + 1)
        // Une solution existe sur le chemin courant, on la retourne
        return result;
    }

    // Aucune solution sur le chemin courant, on backtrack
    return path.filter(x => x !== lastNode);
  }

  function assignChildren(membres: Membre[]) {
    const adultes = membres.filter(x => !x.enfant).map(membre => ({ membre, peutOffrir: membres.filter(x => x.enfant && x.famille !== membre.famille) }));
    adultes.forEach(x => shuffleArray(x.peutOffrir));
    const enfants = membres.filter(x => x.enfant);
    [adultes, enfants].forEach(shuffleArray);
    const repartition: { donneur: Membre, receveur: Membre }[] = [];

    const solution = findChildrenRepartition(adultes, enfants, enfants.length, repartition);
    console.log(solution);
  }

  function findChildrenRepartition(adultes: { membre: Membre; peutOffrir: Membre[]; }[], enfants: Membre[], initialEnfantsLength: number, repartition: { donneur: Membre, receveur: Membre }[]) {

    if (enfants.length === 0) {
      return repartition;
    }

    const adultesEligibles = getAdultesEligibles(adultes, repartition);

    if (adultesEligibles.length) {
      for (const enfant of enfants) {
        for (const adulte of adultesEligibles) {
          if (adulte.peutOffrir.includes(enfant)) {
            repartition.push({ donneur: adulte.membre, receveur: enfant });
            const result = findChildrenRepartition(adultes, enfants.filter(x => x !== enfant), initialEnfantsLength, repartition);
            if (result.length === initialEnfantsLength) {
              return result;
            }
          }
        }
      }
    }

    const { [repartition.length - 1]: lastRepartition } = repartition;
    return repartition.filter(x => x !== lastRepartition);
  }

  function getAdultesEligibles(adultes: { membre: Membre; peutOffrir: Membre[]; }[], repartition: { donneur: Membre; receveur: Membre }[]) {
    if (repartition.length < adultes.length) {
      return adultes.filter(x => !repartition.some(y => y.donneur === x.membre));
    }
    const grouped = Map.groupBy(repartition, x => x.donneur);
    const byCount = Map.groupBy(grouped, ([_, assignation]) => assignation.length);

    const min = Math.min(...byCount.keys().toArray());

    const adultesAyantDonneMoins =
      byCount.entries()
        .filter(([count]) => count === min)
        .map(([_, [x]]) => x)
        .flatMap(([x]) => adultes.filter(y => y.membre === x))
        .toArray();

    return adultesAyantDonneMoins.length ? adultesAyantDonneMoins : adultes;
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
