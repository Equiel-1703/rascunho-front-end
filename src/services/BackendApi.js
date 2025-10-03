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
     * Retrieves the authentication token from local storage. This method is meant to be used internally, and only
     * when the user is known to be logged in. That's why it throws an error if the token is not found.
     * 
     * @returns {string} The authentication token.
     * @throws {Error} If the token is not found in local storage.
     */
    #getAuthToken() {
        const token = localStorage.getItem(this.#authTokenKey);

        if (!token || token === 'undefined' || token === undefined) {
            throw new Error('[BackendApi] Auth token not found in local storage. User might not be logged in.');
        }

        return token;
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
        }

        const response = await fetch(`${this.#baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Cookies will received
            body: jsonBody
        });

        if (response.ok) {
            const bodyJson = await response.json();
            const token = bodyJson.token;

            // Store the authentication token in local storage
            localStorage.setItem(this.#authTokenKey, token);

            if (this.#debug) {
                console.log('[BackendApi] Login successful!');
            }

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
     *                            - userId: the ID of the logged-in user (null if not logged in)
     */
    async isUserLoggedIn() {
        const token = localStorage.getItem(this.#authTokenKey);

        // The return object starts with default empty values
        let returnObject = {
            loggedIn: false,
            username: null,
            userId: null
        };

        if (!token || token === 'undefined' || token === undefined) {
            // If the token is not present or is undefined, the user is not logged in
            if (this.#debug) {
                console.log('[BackendApi] Token not found or undefined in local storage');
            }

            return returnObject;
        }

        if (this.#debug) {
            console.log(`[BackendApi] Validating auth token in backend: ${this.#baseUrl}/auth/me`);
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

            returnObject.loggedIn = true;
            returnObject.username = bodyJson.username;
            returnObject.userId = bodyJson.userId;

            return returnObject;
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Auth token is invalid or expired. Removing from local storage.');
            }

            localStorage.removeItem('authToken');

            return returnObject;
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
            console.log(`[BackendApi] Attempting to refresh auth token using refresh cookie: ${this.#baseUrl}/auth/refresh`);
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
            }

            return;
        } else if (response.status === StatusCodes.UNAUTHORIZED) {
            if (this.#debug) {
                console.warn('[BackendApi] Refresh cookie is invalid or expired');
            }

            // If the refresh cookie is invalid or expired, it makes sense to also remove the auth token
            // (if it exists) and throw an error
            localStorage.removeItem(this.#authTokenKey);

            throw new BadCredentialsError('Refresh cookie is invalid or expired');
        } else {
            throw new Error(`Auth token refresh failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }

    }

    /**
     * Logs out the user by removing the authentication token from local storage and invalidating the refresh token cookie.
     * 
     * @returns {Promise<void>} A promise that resolves if the logout is successful.
     * @throws {Error} If the logout request fails for any reason.
     */
    async logout() {
        localStorage.removeItem(this.#authTokenKey);

        if (this.#debug) {
            console.log(`[BackendApi] Logging out user: ${this.#baseUrl}/auth/logout`);
        }

        const response = await fetch(`${this.#baseUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            body: null
        });

        if (response.ok) {
            if (this.#debug) {
                console.log('[BackendApi] User logged out successfully');
            }

            return;
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Logout request failed');
            }

            throw new Error(`Logout failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }

    }

    /**
     * Creates a new annotation for the specified user with the given color index and title.
     * 
     * @param {number} userId 
     * @param {number} colorIndex 
     * @param {string} title 
     * @returns {Promise<number>} The ID of the created annotation
     * @throws {Error} If the create annotation request fails for any reason
     */
    async createAnnotation(userId, colorIndex, title) {
        const token = this.#getAuthToken();

        const requestBody = JSON.stringify({ userId, colorIndex, title });

        if (this.#debug) {
            console.log('[BackendApi] Creating new annotation.');
        }

        const response = await fetch(`${this.#baseUrl}/annotations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: requestBody
        });

        if (response.ok) {
            if (this.#debug) {
                console.log('[BackendApi] Annotation created successfully');
            }

            const annotationResponse = await response.json();

            return annotationResponse.id;
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Create annotation request failed');
            }

            throw new Error(`Create annotation failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Retrieves all annotations for the specified user.
     * 
     * @param {number} userId 
     * @returns {Promise<Array>} An array of annotations. Each annotation is an object with properties: id, colorIndex, title
     * @throws {Error} If the fetch annotations request fails for any reason
     */
    async getAllAnnotationsForUser(userId) {
        const token = this.#getAuthToken();

        if (this.#debug) {
            console.log('[BackendApi] Fetching all annotations for user.');
        }

        const response = await fetch(`${this.#baseUrl}/annotations?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: null
        });

        if (response.ok) {
            if (this.#debug) {
                console.log('[BackendApi] Annotations fetched successfully');
            }

            const annotations = await response.json();

            return annotations.annotations;
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Fetch annotations request failed');
            }

            throw new Error(`Fetch annotations failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Retrieves the data for a specific annotation by its ID.
     *
     * @param {number} annotationId - The ID of the annotation to retrieve.
     * @param {boolean} includeTags - Whether to include annotation tags in the response. Default is false.
     * @returns {Promise<Object>} A promise that resolves to the annotation data object. 
     * This object contains:
     *     - id: The ID of the annotation.
     *     - title: The title of the annotation.
     *     - text: The text content of the annotation.
     *     - colorIndex: The color index of the annotation.
     *     - tags: An array of tags associated with the annotation (if includeTags is true). If
     *       includeTags is false, this property will be an empty array.
     * @throws {Error} If the fetch annotation data request fails for any reason.
     */
    async getAnnotationData(annotationId, includeTags = false) {
        const token = this.#getAuthToken();

        if (this.#debug) {
            console.log('[BackendApi] Fetching data for annotation id:', annotationId);
        }

        const response = await fetch(`${this.#baseUrl}/annotations/${annotationId}?tags=${includeTags}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: null
        });

        if (response.ok) {
            if (this.#debug) {
                console.log('[BackendApi] Annotation data fetched successfully');
            }

            const annotationData = await response.json();

            return annotationData;
        } else {
            if (this.#debug) {
                console.warn('[BackendApi] Fetch annotation data request failed');
            }

            throw new Error(`Fetch annotation data failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }
}

export { ValidationErrors, BadCredentialsError };
export default new BackendApi;
