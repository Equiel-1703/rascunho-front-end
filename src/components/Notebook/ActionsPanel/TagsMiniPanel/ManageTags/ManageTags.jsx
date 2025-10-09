import styles from './ManageTags.module.css';

import { useState } from 'react';

function renderTagList(tags, onTagClick, conditionFn = null) {
    if (tags.length === 0) {
        return <p>-</p>;
    }

    return tags.map((tag) => {
        if (conditionFn && !conditionFn(tag)) {
            return null;
        }

        return (
            <div
                key={tag.id}
                className={styles.tag}
                onTagClick={
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

    const [tagsToAdd, setTagsToAdd] = useState([1, 2, 3]);
    const [tagsToRemove, setTagsToRemove] = useState([4, 5, 6]);

    const isTagInCurrentTags = (tag) => {
        return currentTags.some((t) => t.id === tag.id);
    };

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
                                    allTags,
                                    (tag) => {
                                        console.log(`I was clicked! Id: ${tag.id}, Name: ${tag.name}`);
                                    },
                                    (tag) => !isTagInCurrentTags(tag)
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <p>Tags da Nota</p>
                        <div className={styles.tagsContainer}>
                            {
                                renderTagList(
                                    currentTags,
                                    (tag) => {
                                        console.log(`I was clicked! Id: ${tag.id}, Name: ${tag.name}`);
                                    }
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