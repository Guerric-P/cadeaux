import React from 'react';
import { Membre } from '../model/membre';

export const Resultat = (props: { titre: string, resultat: { donneur: Membre, receveur: Membre }[] }) =>
    props.resultat && <table className="min-w-full table-auto">
        <caption className="text-lg font-bold py-2">{props.titre}</caption>
        {
            props.resultat.length ?
                [
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left" scope="col">Donneur</th>
                            <th className="px-4 py-2 text-left" scope="col">Receveur</th>
                        </tr>
                    </thead>,
                    props.resultat.map((r, i) => (
                        <tr className="border-t" key={i}>
                            <td className="text-left sm:px-4 sm:py-2 p-1">{r.donneur.nom}</td>
                            <td className="text-left sm:px-4 sm:py-2 p-1">{r.receveur.nom}</td>
                        </tr>
                    ))
                ] : <div>Aucune répartition n'existe pour les contraintes données.</div>
        }

    </table>
