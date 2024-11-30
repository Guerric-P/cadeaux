import React from 'react';
import { Membre } from '../model/membre';

export const Resultat = (props: { titre: string, resultat: { donneur: Membre, receveur: Membre }[] }) =>
    props.resultat && <div className="min-w-full">
        <div className="text-lg font-bold py-2">{props.titre}</div>
        {
            props.resultat.length ?
                props.resultat.map((r, i) => (
                    <div key={i}>
                        <span className="text-left sm:px-4 sm:py-2 p-1">{r.donneur.nom}</span>
                        donne un cadeau 🎁 à
                        <span className="text-left sm:px-4 sm:py-2 p-1">{r.receveur.nom}</span>
                    </div>
                ))
                : <div>Aucune répartition n'existe pour les contraintes données.</div>
        }

    </div>
