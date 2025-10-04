import styles from './MainPanel.module.css';

import { useEffect, useState } from 'react';

import BackendApi from '../../../services/BackendApi';
import { useNotebookContext } from '../NotebookContext';

function MainPanel() {
    const notebookContext = useNotebookContext();
    const activeNoteId = notebookContext.activeNoteId;

    // Load note data when activeNoteId changes and once the component is mounted
    useEffect(() => {
        const loadNoteData = async () => {
            if (activeNoteId) {
                const annotationData = await BackendApi.getAnnotationData(activeNoteId, false);

                notebookContext.setCurrentNoteTitle(annotationData.title);
                notebookContext.setCurrentNoteText(annotationData.text);

                // When loading the note, the last saved states will be the same as the current ones
                notebookContext.setLastSavedNoteTitle(annotationData.title);
                notebookContext.setLastSavedNoteText(annotationData.text);
            }
        }

        loadNoteData();
    }, [activeNoteId]);

    if (activeNoteId === null) {
        return (
            <p className={`${styles.note} ${styles.noNoteSelected}`}>
                Nenhuma nota selecionada
            </p>
        );
    }

    return (
        <>
            <input
                type='text'
                className={`${styles.note} ${styles.noteTitle}`}
                value={notebookContext.currentNoteTitle}
                onChange={(e) => notebookContext.setCurrentNoteTitle(e.target.value)}
            >
            </input>

            <textarea
                className={`${styles.note} ${styles.noteTextArea}`}
                value={(notebookContext.currentNoteText === null) ? '' : notebookContext.currentNoteText}
                onChange={(e) => notebookContext.setCurrentNoteText(e.target.value)}
            >
            </textarea>

            <div className={styles.spacer}></div>
        </>
    );
}

export default MainPanel;