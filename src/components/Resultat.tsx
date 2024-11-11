import React from 'react';
import { Membre } from '../model/membre';

export const Resultat = (props: { titre: string, resultat: { donneur: Membre, receveur: Membre }[], erreur: boolean }) =>
    props.resultat && <table style={{ width: '100%' }}>
        <caption>{props.titre}</caption>
        {
            props.resultat.length ?
                [
                    <thead>
                        <tr>
                            <th scope="col">Donneur</th>
                            <th scope="col">Receveur</th>
                        </tr>
                    </thead>,
                    props.resultat.map((r, i) => (
                        <tr key={i}>
                            <td>{r.donneur.nom}</td>
                            <td>{r.receveur.nom}</td>
                        </tr>
                    ))
                ] : <div>Aucune répartition n'existe pour les contraintes données.</div>
        }

    </table>
