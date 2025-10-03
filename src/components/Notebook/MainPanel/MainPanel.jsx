import styles from './MainPanel.module.css';

import { useNotebookContext } from '../NotebookContext';

function MainPanel() {
    const notebookContext = useNotebookContext();
    const activeNoteId = notebookContext.activeNoteId;

    return (
        <p>{`Active note id: ${activeNoteId}`}</p>
    );
}

export default MainPanel;