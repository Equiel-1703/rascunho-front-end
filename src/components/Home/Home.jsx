import styles from './Home.module.css';

import { useNavigate } from "react-router-dom";

import { useAuthContext } from '../AuthContext/AuthContext.jsx';
import Loading from '../Loading/Loading.jsx';

function Home() {
    const navigate = useNavigate();

    const authContext = useAuthContext();

    if (authContext.loading) {
        return (
            <main className={styles.main}>
                <Loading size='10rem' borderWidth="0.8rem" />
            </main>
        );
    }

    return (
        <main className={styles.main}>
            {
                (authContext.loggedUsername !== null) ? (
                    <>
                        <p>Welcome back, {authContext.loggedUsername}!</p>
                        <button
                            className={styles.btn}
                            onClick={async () => await authContext.logout()}
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <button
                        className={styles.btn}
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </button>
                )
            }
        </main>
    );
}

export default Home;