import styles from './CriarNota.module.css';

function CriarNota() {
    return (
        <button
            className={styles.canetaButton}
            title="Criar nota"
        >
            <img src="/caneta-bic.png" alt="caneta" />
        </button>
    );
}

export default CriarNota;