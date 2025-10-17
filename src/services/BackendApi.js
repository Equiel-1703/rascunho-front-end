import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
    // This will get the backend base URL from environment variable VITE_API_URL
    // In local development, it should be set in the .env.local file
    // For production, it should be set in the hosting environment
    #baseUrl = import.meta.env.VITE_API_URL;

    #debug = false;
    #authTokenKey = 'authToken';

    #axiosApi = null;

    constructor() {
        const refreshEndpoint = '/auth/refresh';

        // Initializing axios
        this.#axiosApi = axios.create({
            baseURL: this.#baseUrl,
            withCredentials: true // Allow cookies to be sent in requests
        });

        this.#axiosApi.interceptors.request.use(
            async (config) => {
                // Ignoring refresh endpoint
                if (config.url.endsWith(refreshEndpoint)) {
                    return config;
                }

                const token = localStorage.getItem(this.#authTokenKey);

                if (token) {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // in seconds

                    // If the token is expired or will expire in the next minute, refresh it
                    if (decodedToken.exp < currentTime + 60) {
                        if (this.#debug) {
                            console.log('[BackendApi] Auth token is expired or about to expire. Refreshing...');
                        }

                        try {
                            const refreshResponse = await this.#axiosApi.post(refreshEndpoint);
                            const newToken = refreshResponse.data.token;

                            // Save the new refreshed token in local storage
                            localStorage.setItem(this.#authTokenKey, newToken);

                            if (this.#debug) {
                                console.log('[BackendApi] Auth token refreshed successfully');
                            }

                            config.headers['Authorization'] = `Bearer ${newToken}`;
                        } catch (error) {
                            if (this.#debug) {
                                console.warn('[BackendApi] Failed to refresh auth token:', error);
                            }

                            // If the token refresh fails, log out the user
                            await this.logout();

                            return Promise.reject(error);
                        }
                    } else {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );


    }

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
        if (this.#debug) {
            console.log('[BackendApi] Attempting to login user.');
        }

        try {
            const response = await this.#axiosApi.post('/auth/login', { username, password });
            const token = response.data.token;

            // Store the authentication token in local storage
            localStorage.setItem(this.#authTokenKey, token);

            if (this.#debug) {
                console.log('[BackendApi] Login successful!');
            }

            return;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                // A bad request indicates validation errors
                if (status === StatusCodes.BAD_REQUEST) {
                    if (this.#debug) {
                        console.warn('[BackendApi] Validation errors occurred during login');
                    }

                    throw new ValidationErrors('Validation errors occurred', error.response.data);
                }

                // An unauthorized status indicates incorrect credentials
                else if (status === StatusCodes.UNAUTHORIZED) {
                    if (this.#debug) {
                        console.warn('[BackendApi] Bad credentials were provided');
                    }

                    throw new BadCredentialsError('Incorrect username or password');
                }

                // Other errors
                else {
                    throw new Error(`Login failed with status: ${error.response.status} (${getReasonPhrase(error.response.status)})`);
                }
            } else {
                // Network or other errors
                throw new Error(`Login failed: ${error.message}`);
            }
        }
    }

    /**
     * Attempts to register a new user with the provided username, password, and confirmPassword.
     *
     * If the registration is successful, the function resolves without returning any value.
     * 
     * In case of validation errors, a ValidationErrors exception is thrown containing the validation errors from the server.
     * For other errors, a generic Error is thrown with the status code.
     * @param {string} username - The desired username for the new user.
     * @param {string} password - The desired password for the new user.
     * @param {string} confirmPassword - The confirmation of the desired password.
     * @returns {Promise<void>} A promise that resolves if the registration is successful.
     * @throws {ValidationErrors} If there are validation errors from the server or if passwords do not match.
     * @throws {Error} If the registration fails for other reasons.
     */
    async registerUser(username, password, confirmPassword) {
        if (this.#debug) {
            console.log('[BackendApi] Attempting to register user.');
        }

        try {
            if (password !== confirmPassword) {
                throw new ValidationErrors('Validation errors occurred', [
                    { field: 'confirmPassword', message: 'As senhas não coincidem' }
                ]);
            }

            await this.#axiosApi.post('/users', { username, password });

            if (this.#debug) {
                console.log('[BackendApi] User registered successfully!');
            }

            return;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                // A bad request indicates validation errors
                if (status === StatusCodes.BAD_REQUEST) {
                    if (this.#debug) {
                        console.warn('[BackendApi] Validation errors occurred during registration');
                    }

                    throw new ValidationErrors('Validation errors occurred', error.response.data);
                }

                // Other errors
                else {
                    throw new Error(`Registration failed with status: ${error.response.status} (${getReasonPhrase(error.response.status)})`);
                }
            } else {
                // Network or other errors
                throw new Error(`Registration failed: ${error.message}`);
            }
        }
    }

    /**
     * Retrieves the username and userId from the stored JWT token in local storage.
     * 
     * @returns {Object} An object containing:
     *                   - username: the username extracted from the token
     *                   - userId: the userId extracted from the token
     * If the token is not present or invalid, both properties will be null.
     * 
     * @throws {Error} If the token is malformed or cannot be decoded.
     */
    getUserInfoFromToken() {
        const token = localStorage.getItem(this.#authTokenKey);
        let returnObject = {
            username: null,
            userId: null
        };

        if (!token || token === 'undefined' || token === undefined) {
            // If the token is not present or is undefined, return null values
            if (this.#debug) {
                console.log('[BackendApi] Token not found or undefined in local storage');
            }

            return returnObject;
        }

        try {
            const decodedToken = jwtDecode(token);

            returnObject.username = decodedToken.sub;
            returnObject.userId = decodedToken.userId;

            return returnObject;
        } catch (error) {
            throw new Error('Failed to decode token: ' + error.message);
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
     * @throws {Error} If the token validation request fails for any unknown reason.
     */
    async isUserLoggedIn() {
        // The return object starts with default empty values
        let returnObject = {
            loggedIn: false,
            username: null,
            userId: null
        };

        const token = localStorage.getItem(this.#authTokenKey);

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

        try {
            const response = await this.#axiosApi.post('/auth/me');

            returnObject.loggedIn = true;
            returnObject.username = response.data.username;
            returnObject.userId = response.data.userId;

            if (this.#debug) {
                console.log('[BackendApi] Auth token is valid. User is logged in.');
            }

            return returnObject;
        } catch (error) {
            if (error.response) {
                if (this.#debug) {
                    console.warn('[BackendApi] Auth token is invalid or expired. Removing from local storage.');
                }

                localStorage.removeItem('authToken');

                return returnObject;
            } else {
                // Network or other errors
                throw new Error(`Token validation failed: ${error.message}`);
            }
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

        try {
            await this.#axiosApi.post('/auth/logout');

            if (this.#debug) {
                console.log('[BackendApi] User logged out successfully');
            }

            return;
        } catch (error) {
            if (error.response) {
                if (this.#debug) {
                    console.warn('[BackendApi] Logout request failed');
                }

                throw new Error(`Logout failed with status: ${error.response.status} (${getReasonPhrase(error.response.status)})`);
            } else {
                // Network or other errors
                throw new Error(`Logout failed: ${error.message}`);
            }
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
        if (this.#debug) {
            console.log('[BackendApi] Creating new annotation.');
        }

        try {
            const response = await this.#axiosApi.post('/annotations', { userId, colorIndex, title });

            if (this.#debug) {
                console.log('[BackendApi] Annotation created successfully');
            }

            return response.data.id;
        } catch (error) {
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
        if (this.#debug) {
            console.log('[BackendApi] Fetching all annotations for user.');
        }

        try {
            const response = await this.#axiosApi.get(`/annotations?userId=${userId}`);

            if (this.#debug) {
                console.log('[BackendApi] Annotations fetched successfully');
            }

            return response.data.annotations;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Fetch annotations request failed');
            }

            throw new Error(`Fetch annotations failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Retrieves all annotations for the specified user that are tagged with the specified tag.
     * 
     * OBS: This method can filter by multiple tags ids in the backend, but the front-end currently
     * only uses it to filter by a single tag id.
     * 
     * In the future, we can extend the front-end to allow filtering by multiple tags at once.
     * 
     * @param {number} userId - The ID of the user whose annotations are to be fetched
     * @param {number} tagId - The ID of the tag to filter annotations by
     * @returns {Promise<Array>} An array of annotations. Each annotation is an object with properties: id, colorIndex, title
     * @throws {Error} If the fetch annotations request fails for any reason
     */
    async getAllAnnotationsForUserFilteredByTag(userId, tagId) {
        if (this.#debug) {
            console.log('[BackendApi] Fetching all annotations for user filtered by tag.');
        }

        try {
            const response = await this.#axiosApi.get(`/annotations?userId=${userId}&withTags=${tagId}`);

            if (this.#debug) {
                console.log('[BackendApi] Annotations fetched successfully');
            }

            return response.data.annotations;
        } catch (error) {
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
        if (this.#debug) {
            console.log('[BackendApi] Fetching data for annotation id:', annotationId);
        }

        try {
            const response = await this.#axiosApi.get(`/annotations/${annotationId}?tags=${includeTags}`);

            if (this.#debug) {
                console.log('[BackendApi] Annotation data fetched successfully');
            }

            return response.data;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Fetch annotation data request failed');
            }

            throw new Error(`Fetch annotation data failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Updates the annotation with the specified ID, setting its title, text, and color index.
     * 
     * @param {number} annotationId - The ID of the annotation to update
     * @param {string} title - The new title for the annotation
     * @param {string} text - The new text content for the annotation
     * @param {number} colorIndex - The new color index for the annotation
     * @param {Array<number>} addTagId - An array of tag IDs to add to the annotation
     * @param {Array<number>} removeTagId - An array of tag IDs to remove from the annotation
     * @returns {Promise<void>} A promise that resolves if the update is successful
     * @throws {Error} If the update annotation request fails for any reason
     */
    async updateAnnotation(annotationId, title, text, colorIndex = null, addTagId = [], removeTagId = []) {
        const saveObject = {
            title,
            text,
            ...(colorIndex !== null && { colorIndex }),
            ...(addTagId.length > 0 && { addTagId }),
            ...(removeTagId.length > 0 && { removeTagId })
        };

        if (this.#debug) {
            console.log('[BackendApi] Updating annotation with id: ', annotationId);
            console.log('[BackendApi] Update data: ', saveObject);
        }

        try {
            await this.#axiosApi.post(`/annotations/${annotationId}`, saveObject);

            if (this.#debug) {
                console.log('[BackendApi] Annotation updated successfully');
            }

            return;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Update annotation request failed');
            }

            throw new Error(`Update annotation failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Deletes the annotation with the specified ID.
     * 
     * @param {number} annotationId - The ID of the annotation to delete
     * @returns {Promise<void>} A promise that resolves if the deletion is successful
     * @throws {Error} If the delete annotation request fails for any reason
     */
    async deleteAnnotation(annotationId) {
        if (this.#debug) {
            console.log('[BackendApi] Deleting annotation with id: ', annotationId);
        }

        try {
            await this.#axiosApi.delete(`/annotations/${annotationId}`);

            if (this.#debug) {
                console.log('[BackendApi] Annotation deleted successfully');
            }

            return;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Delete annotation request failed');
            }

            throw new Error(`Delete annotation failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Retrieves all tags for the specified user.
     * 
     * @param {number} userId - The ID of the user whose tags are to be fetched
     * @returns {Promise<Array>} An array of tags. Each tag is an object with properties: id, name
     * @throws {Error} If the fetch tags request fails for any reason
     */
    async getAllTagsForUser(userId) {
        if (this.#debug) {
            console.log('[BackendApi] Fetching all tags for user.');
        }

        try {
            const response = await this.#axiosApi.get(`/tags?userId=${userId}`);

            if (this.#debug) {
                console.log('[BackendApi] Tags fetched successfully');
            }

            return response.data.tags;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Fetch tags request failed');
            }

            throw new Error(`Fetch tags failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Creates a new tag with the specified name for the given user.
     * 
     * @param {number} userId - The ID of the user for whom the tag is to be created
     * @param {string} name - The name of the new tag
     * @returns {Promise<number>} The ID of the created tag
     * @throws {Error} If the create tag request fails for any reason
     */
    async createTag(userId, name) {
        if (this.#debug) {
            console.log('[BackendApi] Creating tag.');
        }

        try {
            const response = await this.#axiosApi.post('/tags', { userId, name });

            if (this.#debug) {
                console.log('[BackendApi] Tag created successfully');
            }

            return response.data.id;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Create tag request failed');
            }

            throw new Error(`Create tag failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Updates the tag with the specified ID, setting its name.
     * 
     * @param {number} tagId - The ID of the tag to update
     * @param {string} name - The new name for the tag
     * @param {number} userId - The ID of the user who owns the tag
     * @returns {Promise<void>} A promise that resolves if the update is successful
     * @throws {Error} If the update tag request fails for any reason
     */
    async updateTag(tagId, userId, name) {
        if (this.#debug) {
            console.log('[BackendApi] Updating tag with id: ', tagId);
            console.log('[BackendApi] New name: ', name);
        }

        try {
            await this.#axiosApi.post(`/tags/${tagId}`, { name, userId });

            if (this.#debug) {
                console.log('[BackendApi] Tag updated successfully');
            }

            return;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Update tag request failed');
            }

            throw new Error(`Update tag failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }

    /**
     * Deletes the tag with the specified ID.
     * 
     * @param {number} tagId - The ID of the tag to delete
     * @returns {Promise<void>} A promise that resolves if the deletion is successful
     * @throws {Error} If the delete tag request fails for any reason
     */
    async deleteTag(tagId) {
        if (this.#debug) {
            console.log('[BackendApi] Deleting tag with id: ', tagId);
        }

        try {
            await this.#axiosApi.delete(`/tags/${tagId}`);

            if (this.#debug) {
                console.log('[BackendApi] Tag deleted successfully');
            }

            return;
        } catch (error) {
            if (this.#debug) {
                console.warn('[BackendApi] Delete tag request failed');
            }

            throw new Error(`Delete tag failed with status: ${response.status} (${getReasonPhrase(response.status)})`);
        }
    }
}

export { ValidationErrors, BadCredentialsError };
export default new BackendApi;
