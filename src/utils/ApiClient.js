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
 * This class provides methods to interact with the backend API.
 * It includes functionality for user authentication and error handling.
 */
class ApiClient {
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
     * @throws {ValidationErrors} If there are validation errors from the server.
     * @throws {BadCredentialsError} If the username or password is incorrect.
     * @throws {Error} If the login fails for other reasons.
     */
    async attemptLogin(username, password) {
        const jsonBody = JSON.stringify({ username, password });

        if (this.#debug) {
            console.log('Request URL:', `${this.#baseUrl}/auth/login`);
            console.log('Request Body:', jsonBody);
        }

        const response = await fetch(`${this.#baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        if (response.ok) {
            alert('Login successful!');
            return;
        }
        // A bad request indicates validation errors
        else if (response.status === StatusCodes.BAD_REQUEST) {
            if (this.#debug) {
                console.warn('[ApiClient] Validation errors occurred during login');
            }
            const bodyJson = await response.json();
            throw new ValidationErrors('Validation errors occurred', bodyJson);
        }
        // An unauthorized status indicates incorrect credentials
        else if (response.status === StatusCodes.UNAUTHORIZED) {
            if (this.#debug) {
                console.warn('[ApiClient] Bad credentials were provided');
            }
            throw new BadCredentialsError('Incorrect username or password');
        }
        // Other errors
        else {
            throw new Error(`Login failed with status: ${response.status}`);
        }
    }
}

export { ValidationErrors, BadCredentialsError };
export default new ApiClient;
