import styles from './Nota.module.css';

const notesColors = [
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
    return Math.floor(Math.random() * notesColors.length);
}

function Nota({ noteId, title, colorIndex, onClickCallback, onDeleteCallback }) {
    return (
        <div
            className={styles.note}
            style={{ backgroundColor: notesColors[colorIndex] }}
            onClick={() => onClickCallback(noteId)}
        >
            <p>{title}</p>
            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick of the parent div
                    onDeleteCallback(noteId);
                }}
                aria-label="Deletar nota"
                title="Deletar nota"
            >
                X
            </button>
        </div>
    );
}

export default Nota;
export { getRandomColorIndex };