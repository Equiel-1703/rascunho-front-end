import styles from './Home.module.css';

import { useNavigate } from "react-router-dom";

import { useAuthContext } from '../AuthContext/AuthContext.jsx';
import Loading from '../Loading/Loading.jsx';
import Notebook from '../Notebook/Notebook.jsx';

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

    if (authContext.unexpectedError) {
        return (
            <main className={styles.main}>
                <div className={styles.unexpectedError}>
                    <p>{"Um erro inesperado aconteceu =("}</p>
                    <p>Por favor, tente mais tarde!</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            {
                (authContext.loggedUsername !== null) ? (
                    <Notebook />
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