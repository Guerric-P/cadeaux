import React, { forwardRef } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';

export default forwardRef(
    (
        props: { text: React.RefObject<HTMLDivElement>, copied: boolean, onClick: () => void, className: string },
        ref: React.ForwardedRef<HTMLButtonElement>
    ) => {

        const { t } = useTranslation();

        async function copy() {
            navigator.clipboard.writeText(props.text.current.innerText);
            props.onClick();
        }

        return <button
            className={`${props.copied ? 'bg-grey-500' : 'bg-indigo-500'} text-white px-4 py-2 rounded inline-flex gap-x-1.5 ${props.className}`}
            onClick={copy}
            disabled={props.copied}
            ref={ref}
        >
            <ContentCopyIcon />
            {t(props.copied ? 'clipboard.copied' : 'clipboard.copy')}
        </button>
    }
);