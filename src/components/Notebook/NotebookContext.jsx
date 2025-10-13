import { createContext, useContext, useState, useEffect } from "react";

import { useAuthContext } from "../AuthContext/AuthContext";
import BackendApi from "../../services/BackendApi";

const _NotebookContext = createContext(null);

function useNotebookContext() {
    return useContext(_NotebookContext);
}

function NotebookContext({ children }) {
    const authContext = useAuthContext();
    const userId = authContext.loggedUserId;

    const [activeNoteId, setActiveNoteId] = useState(null);

    const [activeNoteTags, setActiveNoteTags] = useState([]);
    const loadActiveNoteTags = async () => {
        if (activeNoteId) {
            const annotationData = await BackendApi.getAnnotationData(activeNoteId, true);
            setActiveNoteTags(annotationData.tags);
        }
    };
    const [userTags, setUserTags] = useState([]);
    const loadUserTags = async () => {
        if (userId) {
            const tags = await BackendApi.getAllTagsForUser(userId);
            setUserTags(tags);
        }
    };

    const [currentNoteTitle, setCurrentNoteTitle] = useState('');
    const [lastSavedNoteTitle, setLastSavedNoteTitle] = useState('');
    const [currentNoteText, setCurrentNoteText] = useState('');
    const [lastSavedNoteText, setLastSavedNoteText] = useState('');

    const [canSaveNote, setCanSaveNote] = useState(false);

    // Used to trigger save when needed
    const [saveTrigger, setSaveTrigger] = useState(false);
    const triggerSaveFunction = () => setSaveTrigger(!saveTrigger);

    // ------------- Setting up effects -------------
    /**
     * Every time the current note title or text changes, check if it is different from the last saved state
     * to enable/disable the save button
     */
    useEffect(() => {
        const titleChanged = (currentNoteTitle !== lastSavedNoteTitle);
        const textChanged = (currentNoteText !== lastSavedNoteText);

        setCanSaveNote(titleChanged || textChanged);
    }, [currentNoteTitle, lastSavedNoteTitle, currentNoteText, lastSavedNoteText]);

    /**
     * Every time the active note changes, load its data (title, text, tags)
     */
    useEffect(() => {
        const loadNoteData = async () => {
            if (activeNoteId) {
                const annotationData = await BackendApi.getAnnotationData(activeNoteId, true);

                setCurrentNoteTitle(annotationData.title);
                setCurrentNoteText(annotationData.text);

                // When loading the note, the last saved states will be the same as the current ones
                setLastSavedNoteTitle(annotationData.title);
                setLastSavedNoteText(annotationData.text);

                // Load tags for this note
                setActiveNoteTags(annotationData.tags);
            }
        };

        loadNoteData();
    }, [activeNoteId]);

    const ctxValue = {
        activeNoteId,
        setActiveNoteId,

        activeNoteTags,
        setActiveNoteTags,
        loadActiveNoteTags,
        userTags,
        loadUserTags,

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