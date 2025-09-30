import styles from './Header.module.css';

import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../AuthContext/AuthContext.jsx';

function Header() {
    const authContext = useAuthContext();
    const navigate = useNavigate();

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
                        onClick={
                            async () => {
                                await authContext.logout();

                                // Redirect to home page after logout
                                navigate('/');
                            }
                        }
                    >
                        <img src="/src/imgs/exit.png" alt="" />
                    </button>
                </div>
            }
        </header>
    );
}

export default Header;