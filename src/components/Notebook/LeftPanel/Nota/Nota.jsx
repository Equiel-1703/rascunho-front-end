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


function Nota({ title }) {
    const randomIndex = Math.floor(Math.random() * notesColors.length);

    return (
        <div
            className={styles.note}
            style={
                {
                    backgroundColor: notesColors[randomIndex]
                }
            }
        >
            <p>{title}</p>
        </div>
    );
}

export default Nota;