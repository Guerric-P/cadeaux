import { GraphNode } from "../model/graph-node";
import { Membre } from "../model/membre";
import { shuffleArray } from "../util/array";

export function calculerRepartitionAdultes(membres: Membre[]) {

    const adultes = membres.filter(x => !x.enfant)
    const grouped = Object.groupBy(adultes, m => m.famille);

    if (Object.values(grouped).some(x => x.length > adultes.length / 2))
        return;

    const graphNodes: GraphNode[] = membres.filter(x => !x.enfant).map(m => ({ membre: m, relations: [] }));
    graphNodes.forEach(n => n.relations = graphNodes.filter(x => x.membre !== n.membre && x.membre.famille !== n.membre.famille));
    const [initialNode] = graphNodes;

    const path = findHamiltonianCycle([initialNode], graphNodes.length);

    if (path.length !== 0) {
        return path.map((x, i, { [i - 1]: last }) => last && { donneur: last.membre, receveur: x.membre }).filter(x => x);
    }
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