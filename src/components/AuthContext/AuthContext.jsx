import { createContext, useContext, useState, useEffect } from 'react';

import BackendApi, { BadCredentialsError } from '../../services/BackendApi';

const _AuthContext = createContext(null);

function useAuthContext() {
    return useContext(_AuthContext);
}

function AuthContext({ children }) {
    const [loggedUsername, setLoggedUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    // This function will run only once, when the component is mounted
    // Its purpose is to check if the user is logged in or not
    //
    // If it is -> set username
    //
    // If its not -> maybe the authToken is expired, try to refresh authToken using
    // refreshCookie
    //
    // Did refresh works?
    // Yes -> set username
    // No -> redirect to login page (the token is expired or doesn't exists)
    useEffect(() => {
        BackendApi.setDebugMode(true);

        const handleAuth = async () => {
            BackendApi.setDebugMode(true);

            // We start by checking if the user is logged in
            const checkLoginResult = await BackendApi.isUserLoggedIn();

            // If the user is logged in, set the username
            if (checkLoginResult.loggedIn) {
                setLoggedUsername(checkLoginResult.username);
            } else {
                try {
                    // If the user is not logged in, we will try to refresh the auth token
                    await BackendApi.refreshAuthToken();

                    // If the token is refreshed successfully, the user should be logged in now
                    const checkLoginResultAfterRefresh = await BackendApi.isUserLoggedIn();

                    // If this fails, something very weird happened
                    // May God have mercy on us all
                    if (checkLoginResultAfterRefresh.loggedIn) {
                        setLoggedUsername(checkLoginResultAfterRefresh.username);
                    } else {
                        setLoggedUsername(null); // This is a placeholder, later we will redirect to the login page
                    }
                } catch (error) {
                    if (error instanceof BadCredentialsError) {
                        // The refresh token is invalid or expired, the user should log in again
                        setLoggedUsername(null); // This is a placeholder, later we will redirect to the login page
                    } else {
                        setLoggedUsername(null);
                        alert('An unexpected error occurred. Please try again later.\nError details: ' + error.message);
                    }
                }
            }

            setLoading(false);
        };
        handleAuth();
    }, []);

    const login = async (p_username, p_password) => {
        await BackendApi.attemptLogin(p_username, p_password);

        // If successfull update the logged username
        setLoggedUsername(p_username);
    };

    const logout = async () => {
        await BackendApi.logout();

        // Clear logged username if logout is successful
        setLoggedUsername(null);
    }

    const value = {
        loggedUsername,
        setLoggedUsername,
        loading,
        setLoading,
        login,
        logout
    };

    return (
        <_AuthContext.Provider value={value}>
            {children}
        </_AuthContext.Provider>
    );
}

export default AuthContext;
export { useAuthContext };