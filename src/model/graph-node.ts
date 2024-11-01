import { Membre } from "./membre";

export interface GraphNode {
    membre: Membre;
    relations: GraphNode[];
}