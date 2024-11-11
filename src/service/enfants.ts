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

    // Algorithme BFS pour trouver un chemin augmentant dans le graphe
    bfs(source: string | number, sink: any, parent: any[]) {
        const visited = Array(this.size).fill(false);
        const queue = [source];
        visited[source] = true;

        while (queue.length > 0) {
            const node = queue.shift();

            for (const neighbor of this.adjacencyList[node]) {
                if (!visited[neighbor] && this.capacity[node][neighbor] > 0) {
                    queue.push(neighbor);
                    visited[neighbor] = true;
                    parent[neighbor] = node;

                    if (neighbor === sink) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Algorithme de flux maximal (Edmonds-Karp)
    edmondsKarp(source: number, sink: number) {
        const parent = Array(this.size).fill(-1);
        let maxFlow = 0;

        // Tant qu'il existe un chemin augmentant
        while (this.bfs(source, sink, parent)) {
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
    const capaciteMinimale = Math.floor(children.length / adults.length) + 1;

    // Trouver une solution avec la capacité minimale
    for (let i = capaciteMinimale; i <= children.length; i++) {
        const result = assignGifts(adults, children, familyRelations, i);
        if (result) {
            return result;
        }
    }

    return undefined;
}

// Fonction pour résoudre le problème d'affectation des cadeaux
function assignGifts(adults: Membre[], children: Membre[], familyRelations: boolean[][], capacity: number) {
    const numAdults = adults.length;
    const numChildren = children.length;

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
    const maxFlow = graph.edmondsKarp(source, sink);

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
