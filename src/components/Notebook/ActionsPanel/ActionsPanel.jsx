import styles from './ActionsPanel.module.css';

import { useNotebookContext } from '../NotebookContext';

import BackendApi from '../../../services/BackendApi';
import SaveButton from './SaveButton/SaveButton';

function ActionsPanel() {
    const notebookContext = useNotebookContext();

    const canSave = notebookContext.canSaveNote;
    const triggerSaveFunction = notebookContext.triggerSaveFunction;

    const saveButtonClick = async () => {
        if (canSave) {
            const noteId = notebookContext.activeNoteId;
            const newTitle = notebookContext.currentNoteTitle;
            const newText = notebookContext.currentNoteText;

            await BackendApi.updateAnnotation(noteId, newTitle, newText);

            // Update last saved states
            notebookContext.setLastSavedNoteTitle(newTitle);
            notebookContext.setLastSavedNoteText(newText);

            // Trigger save in other components if needed
            triggerSaveFunction();
        }
    }

    return (
        <>
            <SaveButton saveFunction={saveButtonClick} enabled={canSave} />
        </>
    );
}

export default ActionsPanel;