import { StatusCodes } from "http-status-codes";

class ValidationErrors extends Error {
    constructor(message, errors = []) {
        super(message);

        this.name = 'ValidationErrors';
        this.validationErrors = errors;
    }
}

class BadCredentialsError extends Error {
    constructor(message) {
        super(message);

        this.name = 'BadCredentialsError';
    }
}

/**
 * This class provides methods to interact with the backend.
 * It includes functionality for user authentication and error handling.
 */
class BackendApi {
    #baseUrl = 'http://localhost:8080/api';
    #debug = false;

    /**
     * Enables or disables debug mode.
     * 
     * @param {boolean} enabled - If true, enables debug mode; otherwise, disables it.
     */
    setDebugMode(enabled) {
        this.#debug = enabled;
    }

    /**
     * Attempts to log in a user with the provided username and password.
     * 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<string>} A promise that resolves to the authentication token if login is successful.
     * @throws {ValidationErrors} If there are validation errors from the server.
     * @throws {BadCredentialsError} If the username or password is incorrect.
     * @throws {Error} If the login fails for other reasons.
     */
    async attemptLogin(username, password) {
        const jsonBody = JSON.stringify({ username, password });

        if (this.#debug) {
            console.log('[BackendApi] Request URL:', `${this.#baseUrl}/auth/login`);
            console.log('[BackendApi] Request Body:', jsonBody);
        }

        const response = await fetch(`${this.#baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        if (response.ok) {
            if (this.#debug) {
                console.log('[BackendApi] Login successful!');
            }

            const bodyJson = await response.json();
            return bodyJson.token; // Return the authentication token
        }
        // A bad request indicates validation errors
        else if (response.status === StatusCodes.BAD_REQUEST) {
            if (this.#debug) {
                console.warn('[BackendApi] Validation errors occurred during login');
            }

            const bodyJson = await response.json();
            throw new ValidationErrors('Validation errors occurred', bodyJson);
        }
        // An unauthorized status indicates incorrect credentials
        else if (response.status === StatusCodes.UNAUTHORIZED) {
            if (this.#debug) {
                console.warn('[BackendApi] Bad credentials were provided');
            }

            throw new BadCredentialsError('Incorrect username or password');
        }
        // Other errors
        else {
            throw new Error(`Login failed with status: ${response.status}`);
        }
    }

    /**
     * Checks if the user is currently logged in by verifying the presence of an authentication token in local storage
     * and sending a POST request to the server to validate the token.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object containing:
     *                            - isLoggedIn: boolean indicating if the user is logged in
     *                            - username: the username of the logged-in user (null if not logged in)
     */
    async isUserLoggedIn() {
        const token = localStorage.getItem('authToken');
        
        let isLoggedIn = false;
        let username = null;

        // If the auth token is not present, the user is certainly not logged in
        if (!token) {
            return { isLoggedIn, username };
        }

        if (this.#debug) {
            console.log('[BackendApi] Request URL:', `${this.#baseUrl}/auth/me`);
            console.log('[BackendApi] Validating auth token:', token);
        }

        const response = await fetch(`${this.#baseUrl}/auth/me`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: null
        });

        if (response.ok) {
            const bodyJson = await response.json();

            isLoggedIn = true;
            username = bodyJson.username;

            return { isLoggedIn, username };
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Auth token is invalid or expired');
            }

            // If the token is invalid or expired, remove it from local storage
            // and return false
            localStorage.removeItem('authToken');

            return { isLoggedIn, username };
        }

    }
}

export { ValidationErrors, BadCredentialsError };
export default new BackendApi;
