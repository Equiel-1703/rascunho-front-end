import styles from './MainPanel.module.css';

import SmartTextArea from '../../SmartTextArea/SmartTextArea.jsx';
import { useNotebookContext } from '../NotebookContext.jsx';

function MainPanel() {
    const notebookContext = useNotebookContext();
    const activeNoteId = notebookContext.activeNoteId;

    let contentToShow = null;

    if (activeNoteId === null) {
        contentToShow = (
            <>
                <p className={`${styles.note} ${styles.noNoteSelected}`}>
                    Nenhuma nota selecionada
                </p>
            </>
        );
    } else {
        contentToShow = (
            <>
                <SmartTextArea
                    className={`${styles.note} ${styles.noteTitle}`}
                    text={notebookContext.currentNoteTitle}
                    maxLength={50}
                    initialRows={1}
                    maxRows={2}
                    onChange={(e) => notebookContext.setCurrentNoteTitle(e.target.value)}
                />

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

    return (
        <div className={styles.mainPanel}>
            {contentToShow}
        </div>
    );
}

export default MainPanel;