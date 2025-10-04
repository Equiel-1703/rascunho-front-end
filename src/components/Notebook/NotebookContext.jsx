import { createContext, useContext, useState, useEffect } from "react";

const _NotebookContext = createContext(null);

function useNotebookContext() {
    return useContext(_NotebookContext);
}

function NotebookContext({ children }) {
    const [activeNoteId, setActiveNoteId] = useState(null);

    const [currentNoteTitle, setCurrentNoteTitle] = useState('');
    const [lastSavedNoteTitle, setLastSavedNoteTitle] = useState('');
    const [currentNoteText, setCurrentNoteText] = useState('');
    const [lastSavedNoteText, setLastSavedNoteText] = useState('');

    const [canSaveNote, setCanSaveNote] = useState(false);
    
    // Used to trigger save when needed
    const [saveTrigger, setSaveTrigger] = useState(false);
    const triggerSaveFunction = () => {
        setSaveTrigger(!saveTrigger);
    }

    useEffect(() => {
        const titleChanged = (currentNoteTitle !== lastSavedNoteTitle);
        const textChanged = (currentNoteText !== lastSavedNoteText);

        setCanSaveNote(titleChanged || textChanged);
    }, [currentNoteTitle, lastSavedNoteTitle, currentNoteText, lastSavedNoteText]);

    const ctxValue = {
        activeNoteId,
        setActiveNoteId,

        canSaveNote,
        saveTrigger,
        triggerSaveFunction,

        currentNoteTitle,
        setCurrentNoteTitle,
        lastSavedNoteTitle,
        setLastSavedNoteTitle,
        
        currentNoteText,
        setCurrentNoteText,
        lastSavedNoteText,
        setLastSavedNoteText
    };

    return (
        <_NotebookContext.Provider value={ctxValue}>
            {children}
        </_NotebookContext.Provider>
    );
}

export default NotebookContext;
export { useNotebookContext };