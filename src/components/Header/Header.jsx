import styles from './Header.module.css';

import { Link } from 'react-router-dom';

import { useAuthContext } from '../AuthContext/AuthContext.jsx';

function Header() {
    const authContext = useAuthContext();

    return (
        <header className={styles.header}>
            <Link to={"/"} className={styles.headerLink}>
                <img src="/chameca.png" alt="chameca" draggable="false" />
                <h1>Rascunho</h1>
            </Link>

            {
                (authContext.loggedUsername !== null) &&
                <div className={styles.userInfo}>
                    <p>{authContext.loggedUsername}</p>
                    <button
                        className={styles.logoutButton}
                        onClick={authContext.logout}
                    >
                        <img src="/src/imgs/exit.png" alt="" />
                    </button>
                </div>
            }
        </header>
    );
}

export default Header;