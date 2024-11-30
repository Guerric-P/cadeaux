import React from 'react';
import { Membre } from '../model/membre';

export const Resultat = (props: { titre: string, resultat: { donneur: Membre, receveur: Membre }[] }) =>
    props.resultat && <div className="w-fit m-auto text-left">
        <div className="text-lg font-bold py-2">{props.titre}</div>
        {
            props.resultat.length ?
                props.resultat.map((r, i) => (
                    <div key={i}>
                        <span className="font-bold">{r.donneur.nom}</span>
                        &nbsp;donne un cadeau 🎁 à&nbsp;
                        <span className="font-bold">{r.receveur.nom}</span>
                    </div>
                ))
                : <div>Aucune répartition n'existe pour les contraintes données.</div>
        }

    </div>
