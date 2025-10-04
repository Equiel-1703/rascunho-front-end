import styles from './SaveButton.module.css';

import { useState } from 'react';

function SaveButton({ saveFunction, enabled }) {
    const [isSaving, setIsSaving] = useState(false);
    const [disapear, setDisapear] = useState(false);

    const hide = () => {
        setDisapear(true);

        setTimeout(() => {
            setDisapear(false);
        }, 500);
    };

    return (
        <button
            className={
                `${styles.saveButton} `
                + (isSaving ? styles.saving : '')
                + (disapear ? ` ${styles.disappear}` : '')
                + (enabled === false ? ` ${styles.disabled}` : '')
            }
            onClick={async () => {
                setIsSaving(true);

                setTimeout(() => {
                    setIsSaving(false);
                    hide();
                }, 1000);

                await saveFunction();
            }}
        >
            <img src="/disquete.png" alt="salvar" />
        </button>
    );
}

export default SaveButton;