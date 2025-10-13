import styles from './ManageTags.module.css';

import { useState } from 'react';

function renderTagList(tags, onTagClick, conditionToShow = null) {
    if (tags.length === 0) {
        return <p className={styles.noTags}>Nenhuma tag aqui</p>;
    }

    return tags.map((tag) => {
        if (conditionToShow && !conditionToShow(tag)) {
            return null;
        }

        return (
            <div
                key={tag.id}
                className={styles.tag}
                onClick={
                    (e) => {
                        e.stopPropagation();
                        onTagClick(tag);
                    }
                }
            >
                {tag.name}
            </div>
        );
    });
}

function ManageTags({ isOpen, onClose, currentTags, allTags, onSave }) {
    if (!isOpen) {
        return null;
    }

    const [tagsToAdd, setTagsToAdd] = useState([]);
    const [tagsToRemove, setTagsToRemove] = useState([]);

    const isTagAlreadyPresent = (tag) => {
        return currentTags.some((t) => t.id === tag.id);
    };

    const [availableTags, setAvailableTags] = useState(allTags.filter((tag) => !isTagAlreadyPresent(tag)));
    const [presentTags, setPresentTags] = useState(currentTags);


    const clickAvailableTag = (tag) => {
        // Remove from available tags
        setAvailableTags(availableTags.filter((t) => t.id !== tag.id));

        // Add to present tags
        setPresentTags([...presentTags, tag]);

        // Mark for addition in save, if the tag is not present in the note initially
        if (!isTagAlreadyPresent(tag)) {
            setTagsToAdd([...tagsToAdd, tag.id]);
        }

        // If it was marked for removal, unmark it
        if (tagsToRemove.includes(tag.id)) {
            setTagsToRemove(tagsToRemove.filter((id) => id !== tag.id));
        }
    }

    const clickPresentTag = (tag) => {
        // Remove from present tags
        setPresentTags(presentTags.filter((t) => t.id !== tag.id));

        // Add to available tags
        setAvailableTags([...availableTags, tag]);

        // Mark for removal in save, if the tag is present in the note initially
        if (isTagAlreadyPresent(tag)) {
            setTagsToRemove([...tagsToRemove, tag.id]);
        }

        // If it was marked for addition, unmark it
        if (tagsToAdd.includes(tag.id)) {
            setTagsToAdd(tagsToAdd.filter((id) => id !== tag.id));
        }
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={
                (e) => {
                    e.stopPropagation();
                    onClose();
                }
            }
        >
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Gerenciar Tags</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        X
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div>
                        <p>Tags Disponíveis</p>
                        <div className={styles.tagsContainer}>
                            {
                                renderTagList(
                                    availableTags,
                                    clickAvailableTag
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <p>Tags da Nota</p>
                        <div className={styles.tagsContainer}>
                            {
                                renderTagList(
                                    presentTags,
                                    clickPresentTag
                                )
                            }
                        </div>
                    </div>
                </div>

                <button
                    className={styles.saveButton}
                    onClick={
                        (e) => {
                            e.stopPropagation();
                            onSave({ tagsToAdd, tagsToRemove });
                            onClose();
                        }
                    }
                >
                    ok
                </button>
            </div>
        </div>
    );
}

export default ManageTags;