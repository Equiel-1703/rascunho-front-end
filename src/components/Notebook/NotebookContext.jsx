import { createContext, useContext, useState } from "react";

const _NotebookContext = createContext(null);

function useNotebookContext() {
    return useContext(_NotebookContext);
}

function NotebookContext({ children }) {
    const [activeNoteId, setActiveNoteId] = useState(null);

    const ctxValue = {
        activeNoteId,
        setActiveNoteId,
    };

    return (
        <_NotebookContext.Provider value={ctxValue}>
            {children}
        </_NotebookContext.Provider>
    );
}

export default NotebookContext;
export { useNotebookContext };