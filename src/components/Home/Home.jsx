import styles from './Home.module.css';

import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import BackendApi, { BadCredentialsError } from "../../services/BackendApi.js";

import Loading from '../Loading/Loading.jsx';

function Home() {
    const navigate = useNavigate();

    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            BackendApi.setDebugMode(true);

            // We start by checking if the user is logged in
            const checkLoginResult = await BackendApi.isUserLoggedIn();

            // If the user is logged in, set the username
            if (checkLoginResult.loggedIn) {
                setUsername(checkLoginResult.username);
            } else {
                try {
                    // If the user is not logged in, we will try to refresh the auth token
                    await BackendApi.refreshAuthToken();

                    // If the token is refreshed successfully, the user should be logged in now
                    const checkLoginResultAfterRefresh = await BackendApi.isUserLoggedIn();

                    // If this fails, something very weird happened
                    // May God have mercy on us all
                    if (checkLoginResultAfterRefresh.loggedIn) {
                        setUsername(checkLoginResultAfterRefresh.username);
                    } else {
                        setUsername(null); // This is a placeholder, later we will redirect to the login page
                    }
                } catch (error) {
                    if (error instanceof BadCredentialsError) {
                        // The refresh token is invalid or expired, the user should log in again
                        setUsername(null); // This is a placeholder, later we will redirect to the login page
                    } else {
                        setUsername(null);
                        alert('An unexpected error occurred. Please try again later.\nError details: ' + error.message);
                    }
                }
            }

            setLoading(false);
        };
        handleAuth();
    }, []);


    if (loading) {
        return (
            <main className={styles.main}>
                <Loading size='10rem' borderWidth="0.8rem" />
            </main>
        );
    }

    return (
        <main className={styles.main}>
            {
                username ? (
                    <>
                        <p>Welcome back, {username}!</p>
                        <button
                            className={styles.btn}
                            onClick={
                                async () => {
                                    await BackendApi.logout();
                                    setUsername(null);
                                }
                            }
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