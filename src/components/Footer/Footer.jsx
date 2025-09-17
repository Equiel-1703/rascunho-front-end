import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <p>© 2025 Rascunho</p>
            <p>Feito por <a href="https://github.com/Equiel-1703" target="_blank" rel="noopener noreferrer">Henrique G. Rodrigues (Equiel-1703)</a></p>
        </footer>
    );
}

export default Footer;