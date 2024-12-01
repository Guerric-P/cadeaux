import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';

export default (props: { html: React.RefObject<HTMLDivElement>, copied: boolean, onClick: () => void }) => {

    const { t } = useTranslation();

    async function copy() {
        navigator.clipboard.writeText(props.html.current.innerText);
        props.onClick();
    }

    return <button
        className={`${props.copied ? 'bg-grey-500' : 'bg-indigo-500'} text-white px-4 py-2 rounded inline-flex gap-x-1.5`}
        onClick={copy}
        disabled={props.copied}
    >
        <ContentCopyIcon />
        {t(props.copied ? 'clipboard.copied' : 'clipboard.copy')}
    </button>
}