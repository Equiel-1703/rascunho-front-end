import { StatusCodes, getReasonPhrase } from 'http-status-codes';

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
    #baseUrl = 'https://localhost:8443/api';
    #debug = false;

    #authTokenKey = 'authToken';

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
     * If the login is successful, the authentication token is stored in local storage.
     * 
     * In case of validation errors, a ValidationErrors exception is thrown containing the validation errors from the server.
     * If the credentials are incorrect, a BadCredentialsError exception is thrown.
     * For other errors, a generic Error is thrown with the status code.
     * 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<void>} A promise that resolves if the login is successful.
     * @throws {ValidationErrors} If there are validation errors from the server.
     * @throws {BadCredentialsError} If the username or password is incorrect.
     * @throws {Error} If the login fails for other reasons.
     */
    async attemptLogin(username, password) {
        const jsonBody = JSON.stringify({ username, password });

        if (this.#debug) {
            console.log('[BackendApi] Attempting to login user.');
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
            const bodyJson = await response.json();

            console.log('[BackendApi] Full server response body:', bodyJson);

            const token = bodyJson.token;

            // Store the authentication token in local storage
            localStorage.setItem(this.#authTokenKey, token);

            if (this.#debug) {
                console.log('[BackendApi] Login successful!');
                console.log('[BackendApi] Received auth token:', token);
            }

            // Reading token back from local storage to confirm it was stored correctly
            const storedToken = localStorage.getItem(this.#authTokenKey);
            console.log('[BackendApi] Token read from local storage after login:', storedToken);

            return;
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
            throw new Error(`Login failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Checks if the user is currently logged in by verifying the presence of an authentication token in local storage.
     * If present, it validates the token by sending a POST request to the server to validate it.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object containing:
     *                            - loggedIn: boolean indicating if the user is logged in
     *                            - username: the username of the logged-in user (null if not logged in)
     */
    async isUserLoggedIn() {
        const token = localStorage.getItem(this.#authTokenKey);
        console.log('[BackendApi] Token read from local storage in isUserLoggedIn():', token);

        let loggedIn = false;
        let username = null;

        if (!token || token === 'undefined' || token === undefined) {
            // If the token is not present or is undefined, the user is not logged in
            if (this.#debug) {
                console.log('[BackendApi] Token not found or undefined in local storage');
            }

            return { loggedIn, username };
        }

        if (this.#debug) {
            console.log('[BackendApi] Validating auth token:', token);
            console.log('[BackendApi] Request URL:', `${this.#baseUrl}/auth/me`);
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

            loggedIn = true;
            username = bodyJson.username;

            return { loggedIn, username };
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Auth token is invalid or expired');
            }

            // If the token is invalid or expired, remove it from local storage
            // and return false
            localStorage.removeItem('authToken');

            return { loggedIn, username };
        }
    }

    /**
     * Attempts to refresh the authentication token using the refresh http-only cookie.
     * 
     * @returns {Promise<void>} A promise that resolves if the token is refreshed successfully.
     * @throws {BadCredentialsError} If the refresh token cookie is invalid or expired.
     * @throws {Error} If the token refresh fails for other reasons.
     */
    async refreshAuthToken() {
        if (this.#debug) {
            console.log('[BackendApi] Attempting to refresh auth token using refresh cookie');
            console.log('[BackendApi] Request URL:', `${this.#baseUrl}/auth/refresh`);
        }

        const response = await fetch(`${this.#baseUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            body: null
        });

        if (response.ok) {
            const bodyJson = await response.json();
            const newToken = bodyJson.token;

            // Store the new token in local storage
            localStorage.setItem(this.#authTokenKey, newToken);

            if (this.#debug) {
                console.log('[BackendApi] Token refreshed successfully!');
                console.log('[BackendApi] New auth token:', newToken);
            }

            return;
        } else if (response.status === StatusCodes.UNAUTHORIZED) {
            if (this.#debug) {
                console.warn('[BackendApi] Refresh token is invalid or expired');
            }

            // If the refresh token is invalid or expired, remove the auth token from local storage
            // (if it exists) and throw an error
            localStorage.removeItem(this.#authTokenKey);

            throw new BadCredentialsError('Refresh token is invalid or expired');
        } else {
            throw new Error(`Token refresh failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }

    }

    async logout() {
        localStorage.removeItem(this.#authTokenKey);
    }
}

export { ValidationErrors, BadCredentialsError };
export default new BackendApi;
