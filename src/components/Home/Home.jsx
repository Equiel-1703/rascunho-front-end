import styles from './Home.module.css';

import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <main className={styles.main}>
            <button
                className={styles.btn}
                onClick={() => navigate('/login')}
            >
                Log in
            </button>
        </main>
    )
}

export default Home;