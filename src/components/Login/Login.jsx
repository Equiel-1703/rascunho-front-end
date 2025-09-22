import styles from './Login.module.css';

import BackendApi, { ValidationErrors, BadCredentialsError } from '../../services/BackendApi';
import { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const submitLogin = async (event) => {
        event.preventDefault();
        setErrors({}); // Clear previous errors

        BackendApi.setDebugMode(true);

        try {
            const authToken = await BackendApi.attemptLogin(username, password);

            localStorage.setItem('authToken', authToken);
        } catch (error) {
            if (error instanceof ValidationErrors) {
                console.warn('[Login component] Validation errors:', error.validationErrors);
                setErrors(error.validationErrors);
            }
            else if (error instanceof BadCredentialsError) {
                console.warn('[Login component] Bad credentials:', error.message);
                setErrors({ password: error.message }); // Show error near password field
            }
            else {
                console.error('[Login component] Error:', error.message);
            }
        }
    }

    return (
        <main>
            <form>
                <div className={styles.loginInput}>
                    <label htmlFor='username'>
                        Username:
                    </label>
                    <input
                        type='text'
                        name='username'
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    {errors.username && (
                        <div className={styles.error}>
                            {errors.username}
                        </div>
                    )}
                </div>

                <div className={styles.loginInput}>
                    <label htmlFor='password'>
                        Password:
                    </label>
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {errors.password && (
                        <div className={styles.error}>
                            {errors.password}
                        </div>
                    )}
                </div>

                <button
                    type='submit'
                    onClick={submitLogin}
                    className={styles.btn}
                >
                    Log in
                </button>
            </form>
        </main>
    );
}

export default Login;