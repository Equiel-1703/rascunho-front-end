import styles from './TagsMiniPanel.module.css';

import { useState } from 'react';

import { useNotebookContext } from '../../NotebookContext';
import ManageTags from './ManageTags/ManageTags.jsx';

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

function saveNewTags({ tagsToAdd, tagsToRemove }) {
    // Placeholder function to save new tags
    // Implement the logic to update tags in the backend or context
    console.log('Tags to add:', tagsToAdd);
    console.log('Tags to remove:', tagsToRemove);
}

function TagsMiniPanel() {
    const notebookContext = useNotebookContext();
    const allTags = notebookContext.userTags;
    const currentTags = notebookContext.activeNoteTags;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
    const openManageTags = () => setIsManageTagsOpen(true);
    const closeManageTags = () => setIsManageTagsOpen(false);

    let menuContent;

    if (!isMenuOpen) {
        menuContent = <p className={styles.tagsMiniPanelTitle}>Tags</p>;
    }
    else {
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
        <div className={styles.tagsMiniPanelWrapper}>
            <div
                className={
                    styles.tagsMiniPanel
                    + (isMenuOpen ? ` ${styles.tagsMenuOpen}` : '')
                }
                onClick={toggleMenu}
            >
                <ManageTags
                    isOpen={isManageTagsOpen}
                    onClose={closeManageTags}
                    currentTags={currentTags}
                    allTags={allTags}
                    onSave={saveNewTags}
                />
                {menuContent}
                {isMenuOpen && <ManageTagButton action={openManageTags} />}
            </div>
        </div>
    );
}

export default TagsMiniPanel;