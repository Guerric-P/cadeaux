import { Membre } from "../model/membre";
import { shuffleArray } from "../util/array";

export function calculerRepartitionEnfants(membres: Membre[]) {
    const adultes = membres.filter(x => !x.enfant);
    const enfants = membres.filter(x => x.enfant);
    [adultes, enfants].forEach(shuffleArray);

    return assignChildren(adultes, enfants, adultes.map(a => enfants.map(e => a.famille === e.famille)));
}

// Classe représentant un graphe pour le calcul du flux maximal
class Graph {
    size: number;
    capacity: number[][];
    adjacencyList: number[][];
    constructor(size: number) {
        this.size = size; // Nombre de noeuds
        this.capacity = Array.from({ length: size }, () => Array(size).fill(0)); // Matrice de capacité
        this.adjacencyList = Array.from({ length: size }, () => []); // Liste d'adjacence
    }

    // Ajouter une arête avec une capacité
    addEdge(from: number, to: number, cap: number) {
        this.capacity[from][to] = cap;
        this.adjacencyList[from].push(to);
        this.adjacencyList[to].push(from);
    }

    // Algorithme DFS pour trouver un chemin augmentant dans le graphe
    dfs(source: number, sink: any, parent: number[], visited: boolean[], giftsGiven: number[]) {
        // Si la source est le puits, nous avons trouvé un chemin
        if (source === sink) {
            return true;
        }

        visited[source] = true; // Marquer le nœud source comme visité

        // Explorer tous les voisins du nœud source
        const neighbors = [...this.adjacencyList[source]];

        // Trier les voisins pour favoriser ceux qui ont donné moins de cadeaux
        neighbors.sort((a, b) => {
            const giftsA = giftsGiven[a - 1] || 0; // Si a est un adulte, récupérer les cadeaux donnés
            const giftsB = giftsGiven[b - 1] || 0; // Même chose pour b
            return giftsA - giftsB; // Prioriser l'adulte ayant donné moins
        });

        // Explorer les voisins
        for (const neighbor of neighbors) {
            if (!visited[neighbor] && this.capacity[source][neighbor] > 0) {  // Il y a encore de la capacité
                parent[neighbor] = source; // Sauvegarder d'où nous venons
                if (this.dfs(neighbor, sink, parent, visited, giftsGiven)) {
                    // Mettre à jour le nombre de cadeaux donnés même si ce n'est pas un adulte (on n'en sait rien)
                    const adultIndex = neighbor - 1;  // L'adulte est identifié par son index
                    giftsGiven[adultIndex]++;  // Mettre à jour le nombre de cadeaux donnés par cet adulte
                    return true;
                }
            }
        }

        return false;
    }

    // Algorithme de flux maximal (Edmonds-Karp modifié avec DFS)
    edmondsKarp(source: number, sink: number, giftsGiven: number[]) {
        const parent = Array(this.size).fill(-1);
        let maxFlow = 0;

        // Tant qu'il existe un chemin augmentant
        while (true) {
            // Tableau pour marquer les nœuds visités
            const visited = Array(this.size).fill(false);

            // Si DFS trouve un chemin
            if (!this.dfs(source, sink, parent, visited, giftsGiven)) {
                break; // Aucun chemin augmentant trouvé
            }

            // Trouver la capacité du chemin trouvé
            let pathFlow = Infinity;
            let s = sink;
            while (s !== source) {
                let p = parent[s];
                pathFlow = Math.min(pathFlow, this.capacity[p][s]);
                s = p;
            }

            // Mettre à jour les capacités résiduelles
            let v = sink;
            while (v !== source) {
                let u = parent[v];
                this.capacity[u][v] -= pathFlow;
                this.capacity[v][u] += pathFlow;
                v = u;
            }

            maxFlow += pathFlow;
        }
        return maxFlow;
    }
}

function assignChildren(adults: Membre[], children: Membre[], familyRelations: boolean[][]) {
    const capaciteMinimale = Math.floor(children.length / adults.length) + (children.length % adults.length ? 1 : 0);

    // Trouver une solution avec la capacité minimale
    for (let i = capaciteMinimale; i <= children.length; i++) {
        const result = assignGifts(adults, children, familyRelations, i);
        if (result)
            return result;

    }

    return undefined;
}

// Fonction pour résoudre le problème d'affectation des cadeaux
function assignGifts(adults: Membre[], children: Membre[], familyRelations: boolean[][], capacity: number) {
    const numAdults = adults.length;
    const numChildren = children.length;
    const giftsGiven = Array(numAdults).fill(0);

    // Créer un graphe avec source (source = 0), adultes, enfants, et puits (sink = 1 + adultes + enfants)
    const graphSize = 2 + numAdults + numChildren;
    const graph = new Graph(graphSize);

    const source = 0;
    const sink = 1 + numAdults + numChildren;

    // Relier la source aux adultes (chaque adulte peut offrir un nombre spécifique de cadeaux)
    for (let i = 0; i < numAdults; i++) {
        graph.addEdge(source, 1 + i, capacity); // Un adulte peut offrir ce nombre de cadeaux
    }

    // Relier les enfants au puits (chaque enfant doit recevoir un cadeau)
    for (let i = 0; i < numChildren; i++) {
        graph.addEdge(1 + numAdults + i, sink, 1); // Un enfant doit recevoir exactement un cadeau
    }

    // Relier les adultes aux enfants, en excluant les relations familiales
    for (let i = 0; i < numAdults; i++) {
        for (let j = 0; j < numChildren; j++) {
            if (!familyRelations[i][j]) { // Si l'adulte i ne peut pas offrir à l'enfant j
                graph.addEdge(1 + i, 1 + numAdults + j, 1); // L'adulte i peut offrir un cadeau à l'enfant j
            }
        }
    }

    const initialCapacity = graph.capacity.map(x => [...x]);

    // Calculer le flux maximal
    const maxFlow = graph.edmondsKarp(source, sink, giftsGiven);

    // Vérifier si chaque enfant a bien reçu un cadeau
    if (maxFlow === numChildren) {

        const result: { donneur: Membre, receveur: Membre }[] = [];

        // Afficher l'affectation des cadeaux : quel adulte offre à quel enfant
        for (let i = 0; i < numAdults; i++) {
            for (let j = 0; j < numChildren; j++) {
                // Si l'adulte i a un flux non nul vers l'enfant j (c'est-à-dire, il lui a offert un cadeau)
                if (graph.capacity[1 + i][1 + numAdults + j] < initialCapacity[1 + i][1 + numAdults + j]) {
                    result.push({ donneur: adults[i], receveur: children[j] });
                }
            }
        }

        return result;
    } else {
        return undefined;
    }
}
