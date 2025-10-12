import styles from './LeftPanel.module.css';

import { useState, useEffect } from 'react';

import BackendApi from '../../../services/BackendApi.js';
import { useAuthContext } from '../../AuthContext/AuthContext.jsx';
import { useNotebookContext } from '../NotebookContext.jsx';

import Nota from './Nota/Nota.jsx';
import Tag from './Tag/Tag.jsx';
import CriarNota from './CriarNota/CriarNota.jsx';
import CriarTag from './CriarTag/CriarTag.jsx';

function LeftPanel() {
    const authContext = useAuthContext();
    const userId = authContext.loggedUserId;

    const notebookContext = useNotebookContext();
    const saveTrigger = notebookContext.saveTrigger;


    const [selectedTab, setSelectedTab] = useState('notas');
    const [notes, setNotes] = useState(null);
    const [tags, loadTags] = [notebookContext.userTags, () => { notebookContext.loadUserTags() }];

    // This will load all notes for the current user
    const loadNotes = async () => {
        try {
            const loadedNotes = await BackendApi.getAllAnnotationsForUser(userId);
            setNotes(loadedNotes);
        } catch (error) {
            console.error("[LeftPanel] An error occurred while loading notes: ", error);
        }
    }

    // This will be called when a note is clicked
    const clickNote = (noteId) => {
        notebookContext.setActiveNoteId(noteId);
    }

    const deleteNote = async (noteId) => {
        try {
            await BackendApi.deleteAnnotation(noteId);

            // After deleting, reload notes on the left panel and set active note to null
            notebookContext.setActiveNoteId(null);
            loadNotes();
        } catch (error) {
            console.error("[LeftPanel] An error occurred while deleting note: ", error);
        }
    }

    const clickTag = (tagId) => {
        console.log("Tag clicked: ", tagId);
    }

    const deleteTag = async (tagId) => {
        try {
            await BackendApi.deleteTag(tagId);

            // After deleting, reload tags on the left panel
            loadTags();
        } catch (error) {
            console.error("[LeftPanel] An error occurred while deleting tag: ", error);
        }
    }


    // When a user logs in or out, or when a save is triggered, reload notes and tags
    useEffect(() => {
        loadNotes();
        loadTags();
    }, [userId, saveTrigger]);

    return (
        <div className={styles.leftPanel}>
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
                                        onDeleteCallback={deleteNote}
                                    />
                                ))
                            }
                            <CriarNota callback={loadNotes} />
                        </>
                    )
                }
                {
                    selectedTab === 'tags' && (
                        <>
                            {
                                tags && tags.map((tag) => (
                                    <Tag
                                        key={tag.id}
                                        tagId={tag.id}
                                        name={tag.name}
                                        onClickCallback={clickTag}
                                        onDeleteCallback={deleteTag}
                                    />
                                ))
                            }
                            <CriarTag userId={userId} callback={loadTags} />
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default LeftPanel;