import styles from './Tag.module.css';

import { useState, useEffect, useRef } from 'react';

function InlineEdit({ value, onChangeCallback, className }) {
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
            style={{ backgroundColor: 'transparent' }}
        />
    ) : (
        <span
            onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
            onDoubleClick={handleDoubleClick}
            className={className}
            style={{ backgroundColor: 'transparent' }}
        >
            {text}
        </span>
    );
}

function Tag({ tagId, name, onClickCallback, onDeleteCallback, renameCallback }) {
    const bgColor = 'rgb(227, 64, 156)'; // Fixed color for tags
    return (
        <div
            className={styles.tag}
            onClick={() => onClickCallback({ tagId, name, bgColor })}
            style={{ backgroundColor: bgColor }}
        >
            <InlineEdit
                value={name}
                onChangeCallback={(text) => renameCallback(tagId, name, text)}
                className={styles.tagName}
            />

            <button
                className={styles.deleteButton}
                style={{ backgroundColor: 'transparent' }}

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