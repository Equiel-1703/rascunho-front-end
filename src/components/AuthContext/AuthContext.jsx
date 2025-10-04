import { createContext, useContext, useState, useEffect } from 'react';

import BackendApi, { BadCredentialsError } from '../../services/BackendApi';

const _AuthContext = createContext(null);

function useAuthContext() {
    return useContext(_AuthContext);
}

function AuthContext({ children }) {
    const [loggedUsername, setLoggedUsername] = useState(null);
    const [loggedUserId, setLoggedUserId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [unexpectedError, setUnexpectedError] = useState(false);

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
            let checkLoginResult;

            try {
                // We start by checking if the user is logged in
                checkLoginResult = await BackendApi.isUserLoggedIn();
            } catch (error) {
                console.error("An unexpected error occurred while checking if the user is logged in: ", error);

                setUnexpectedError(true);
                setLoading(false);

                return;
            }

            // If the user is logged in, set the username and userId
            if (checkLoginResult.loggedIn) {
                setLoggedUsername(checkLoginResult.username);
                setLoggedUserId(checkLoginResult.userId);
            } else {
                // If the user is not logged in, we can redirect to login page

                // For now we just log a message to the console
                console.log("User is not logged in");
            }

            setLoading(false);
        };
        handleAuth();
    }, []);

    const login = async (p_username, p_password) => {
        await BackendApi.attemptLogin(p_username, p_password);

        const userInfoFromToken = BackendApi.getUserInfoFromToken();

        // If successfull update the logged username and userId using the authToken retrieved
        // from login
        setLoggedUsername(userInfoFromToken.username);
        setLoggedUserId(userInfoFromToken.userId);
    };

    const logout = async () => {
        await BackendApi.logout();

        // Clear logged username and userId if logout is successful
        setLoggedUsername(null);
        setLoggedUserId(null);
    }

    const value = {
        loggedUsername,
        setLoggedUsername,
        loggedUserId,
        setLoggedUserId,
        loading,
        setLoading,
        unexpectedError,
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