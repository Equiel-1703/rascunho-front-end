import styles from './Tag.module.css';

import { useState, useEffect, useRef } from 'react';

const tagsColors = [
    '#9B177E',
    '#FFEAD8',
    '#EA2264',
    '#640D5F',
    '#8FA31E',
    '#EF7722',
    '#FF0066',
    '#40E0D0',
    '#F6DC43'
];

function getRandomColorIndex() {
    return Math.floor(Math.random() * tagsColors.length);
}

function InlineEdit({ value, onChangeCallback, className, bgColor }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        onChangeCallback(text); // Send the updated text back to the parent
        setIsEditing(false); // Switch back to view mode
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onChangeCallback(text);
            setIsEditing(false);
        }
    };

    return isEditing ? (
        <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={className}
            style={{ backgroundColor: bgColor || 'transparent' }}
        />
    ) : (
        <span
            onDoubleClick={handleDoubleClick}
            className={className}
            style={{ backgroundColor: bgColor || 'transparent' }}
        >
            {text}
        </span>
    );
}

function Tag({ tagId, name, onClickCallback, onDeleteCallback }) {
    const bgColor = tagsColors[getRandomColorIndex()];
    return (
        <div
            className={styles.tag}
            onClick={() => onClickCallback(tagId)}
            style={{ backgroundColor: bgColor }}
        >
            <InlineEdit
                value={name}
                onChangeCallback={(newName) => {
                    // Handle name change if needed
                    console.log(`Tag ${tagId} renamed to: ${newName}`);
                }}
                className={styles.tagName}
                bgColor={bgColor}
            />

            <button
                className={styles.deleteButton}
                style={{ backgroundColor: bgColor }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick of the parent div
                    onDeleteCallback(tagId);
                }}
                aria-label="Deletar tag"
                title="Deletar tag"
            >
                X
            </button>
        </div>
    );
}

export default Tag;