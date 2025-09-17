import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.header}>
            <img src="/chameca.png" alt="chameca" draggable="false" />
            <h1>Rascunho</h1>
        </header>
    );
}

export default Header;