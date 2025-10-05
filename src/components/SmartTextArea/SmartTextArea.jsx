import { useEffect, useState, useRef } from 'react';

function SmartTextArea(
    {
        initialText = '',
        placeholder = '',
        maxLength = 1000,
        initialRows = 3,
        maxRows = 10,
        onChange = null,
        className = '' 
    }
) {
    const textAreaRef = useRef(null);
    const [text, setText] = useState(initialText);
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Update window dimensions on resize to trigger re-calculation of textarea height
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // This runs every time the text changes to adjust the height of the textarea
    useEffect(() => {
        const textAreaElement = textAreaRef.current;

        if (textAreaElement) {
            const lineHeight = parseFloat(getComputedStyle(textAreaElement).lineHeight);
            const maxHeight = lineHeight * maxRows;

            // Reset height to auto to correctly calculate the scrollHeight
            textAreaElement.style.height = 'auto';
            const scrollHeight = textAreaElement.scrollHeight;

            if (scrollHeight > maxHeight) {
                // If the content exceeds max height, set to max height and enable scrolling
                textAreaElement.style.height = `${maxHeight}px`;
                textAreaElement.style.overflowY = 'scroll';
            } else {
                // Otherwise, adjust height to fit content and disable scrolling
                textAreaElement.style.height = `${scrollHeight}px`;
                textAreaElement.style.overflowY = 'hidden';
            }
        }
    }, [text, windowDimensions]);

    const onChangeCallback = (e) => {
        setText(e.target.value);
        if (onChange) {
            onChange(e);
        }
    }

    return (
        <textarea
            ref={textAreaRef}
            rows={initialRows}
            maxLength={maxLength}
            placeholder={placeholder}
            value={text}
            onChange={onChangeCallback}
            className={className}
        >
        </textarea>
    );
}

export default SmartTextArea;