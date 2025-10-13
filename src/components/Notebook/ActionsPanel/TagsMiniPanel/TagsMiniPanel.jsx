import styles from './TagsMiniPanel.module.css';

import { useState } from 'react';

import { useNotebookContext } from '../../NotebookContext';
import ManageTags from './ManageTags/ManageTags.jsx';
import BackendApi from '../../../../services/BackendApi';

function Tag({ tag }) {
    return (
        <div className={styles.tag}>
            {tag.name}
        </div>
    );
}

function ManageTagButton({ action }) {
    return (
        <button
            className={styles.addTagButton}
            title='Adicionar ou remover tags'
            aria-label='Adicionar ou remover tags'
            onClick={
                (e) => {
                    e.stopPropagation();
                    action();
                }
            }
        >
            Editar...
        </button>
    );
}

function TagsMiniPanel({ enabled }) {
    const notebookContext = useNotebookContext();
    const annotationId = notebookContext.activeNoteId;
    const allTags = notebookContext.userTags;
    const currentTags = notebookContext.activeNoteTags;
    const reloadTags = notebookContext.loadActiveNoteTags;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
    const openManageTags = () => setIsManageTagsOpen(true);
    const closeManageTags = () => setIsManageTagsOpen(false);

    const saveNewTags = async ({ tagsToAdd, tagsToRemove }) => {
        if (tagsToAdd.length === 0 && tagsToRemove.length === 0) {
            // Nothing to do
            console.log("[TagsMiniPanel] No tag changes to save.");
            return;
        }

        try {
            await BackendApi.updateAnnotation(annotationId, null, null, null, tagsToAdd, tagsToRemove);

            // After saving, reload the tags for the current note
            await reloadTags();

            console.log("[TagsMiniPanel] Tags updated successfully.");
        } catch (error) {
            console.error("[TagsMiniPanel] An error occurred while updating tags: ", error);
        }
    };

    let menuContent;

    if (!isMenuOpen) {
        // Show only the 'Tags' title when the menu is closed
        menuContent = (
            <p className={styles.tagsMiniPanelTitle}>Tags</p>
        );
    }
    else {
        // When the menu is open, show the list of tags or a message if there are none
        menuContent = (
            (currentTags.length === 0) ? (
                <p>Nenhuma tag para essa nota</p>
            ) : (
                currentTags.map(
                    (tag) => (
                        <Tag key={tag.id} tag={tag} />
                    )
                )
            )
        );
    }

    return (
        // We need a wrapper div to handle the open/close of the menu (absolute positioning)
        <div className={styles.tagsMiniPanelWrapper}>
            <div
                className={
                    styles.tagsMiniPanel
                    + (isMenuOpen ? ` ${styles.tagsMenuOpen}` : '')
                    + (enabled ? '' : ` ${styles.disabled}`)
                }
                onClick={toggleMenu}
            >
                {/* This is the add/remove tags overlay */}
                <ManageTags
                    isOpen={isManageTagsOpen}
                    onClose={closeManageTags}
                    currentTags={currentTags}
                    allTags={allTags}
                    onSave={saveNewTags}
                />
                {menuContent}
                {/* This is the button that triggers the add/remove tags overlay */}
                {isMenuOpen && <ManageTagButton action={openManageTags} />}
            </div>
        </div>
    );
}

export default TagsMiniPanel;