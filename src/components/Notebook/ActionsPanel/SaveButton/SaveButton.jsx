import styles from './SaveButton.module.css';

import { useState } from 'react';

function SaveButton({ saveFunction, enabled }) {
    const [isSaving, setIsSaving] = useState(false);

    return (
        <button
            className={
                `${styles.saveButton} `
                + (isSaving ? styles.saving : '')
                + (enabled === false ? ` ${styles.disabled}` : '')
            }
            onClick={async () => {
                setIsSaving(true);

                setTimeout(() => {
                    setIsSaving(false);
                }, 1000);

                await saveFunction();
            }}
            aria-label='Salvar nota'
            title='Salvar nota'
        >
            <img src="/disquete.png" alt="salvar" />
        </button>
    );
}

export default SaveButton;