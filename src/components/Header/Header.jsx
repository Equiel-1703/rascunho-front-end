import styles from './Header.module.css';

import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className={styles.header}>
            <Link to={"/"} className={styles.headerLink}>
                <img src="/chameca.png" alt="chameca" draggable="false" />
                <h1>Rascunho</h1>
            </Link>
        </header>
    );
}

export default Header;