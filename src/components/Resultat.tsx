import React from 'react';
import { Membre } from '../model/membre';
import { useTranslation } from 'react-i18next';

export default (props: { titre: string, resultat: { donneur: Membre, receveur: Membre }[] }) => {
    const { t } = useTranslation();

    return props.resultat && <div className="w-fit text-left">
        <div className="text-lg font-bold py-2">{props.titre}</div>
        {
            props.resultat.length
                ? props.resultat.map((r, i) =>
                    <div key={i}>
                        <span className="font-bold">{r.donneur.nom}</span>
                        &nbsp;{t('distribution.giftSentence')}&nbsp;
                        <span className="font-bold">{r.receveur.nom}</span>
                    </div>
                )
                : <div>{t('distribution.noDistributionExists')}</div>
        }
    </div>
}

