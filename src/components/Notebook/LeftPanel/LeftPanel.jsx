import styles from './LeftPanel.module.css';

import { useState, useEffect } from 'react';

import BackendApi from '../../../services/BackendApi.js';
import { useAuthContext } from '../../AuthContext/AuthContext.jsx';
import { useNotebookContext } from '../NotebookContext.jsx';

import Nota from './Nota/Nota.jsx';
import CriarNota from './CriarNota/CriarNota.jsx';

function LeftPanel() {
    const [selectedTab, setSelectedTab] = useState('notas');
    const [notes, setNotes] = useState(null);

    const authContext = useAuthContext();
    const userId = authContext.loggedUserId;

    const notebookContext = useNotebookContext();

    const loadNotes = async () => {
        try {
            const loadedNotes = await BackendApi.getAllAnnotationsForUser(userId);
            setNotes(loadedNotes);
        } catch (error) {
            console.error("[LeftPanel] An error occurred while loading notes: ", error);
        }
    }

    const clickNote = (noteId) => {
        notebookContext.setActiveNoteId(noteId);
    }

    // This will be called only once, when the component is mounted
    // or when the userId changes (i.e., when a different user logs in)
    useEffect(() => {
        loadNotes();
    }, [userId]);

    return (
        <>
            <ul className={styles.tabs}>
                <li
                    className={styles.tab + (selectedTab === 'notas' ? ` ${styles.activeTab}` : ` ${styles.inactiveTab}`)}
                    onClick={() => setSelectedTab('notas')}
                >
                    Notas
                </li>
                <li
                    className={styles.tab + (selectedTab === 'tags' ? ` ${styles.activeTab}` : ` ${styles.inactiveTab}`)}
                    onClick={() => setSelectedTab('tags')}
                >
                    Tags
                </li>
            </ul>
            <div className={styles.tabContent}>
                {
                    selectedTab === 'notas' && (
                        <>
                            {
                                notes && notes.map((note) => (
                                    <Nota
                                        key={note.id}
                                        noteId={note.id}
                                        title={note.title}
                                        colorIndex={note.colorIndex}
                                        onClickCallback={clickNote}
                                    />
                                ))
                            }
                            <CriarNota callback={loadNotes} />
                        </>
                    )
                }
                {
                    selectedTab === 'tags' && (
                        <p>Tags</p>
                    )
                }
            </div>
        </>
    );
}

export default LeftPanel;