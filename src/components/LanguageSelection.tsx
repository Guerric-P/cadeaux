import React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
    const { i18n } = useTranslation();
    return <select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
        <option value="fr">FR</option>
        <option value="en">EN</option>
    </select>;
}