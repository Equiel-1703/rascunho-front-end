import styles from './Login.module.css';

import ApiClient, { ValidationErrors, BadCredentialsError } from '../../utils/ApiClient';
import { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = async (event) => {
        event.preventDefault();
        ApiClient.setDebugMode(true);

        try {
            await ApiClient.attemptLogin(username, password);
        } catch (error) {
            if (error instanceof ValidationErrors) {
                console.warn('[Login component] Validation errors:', error.errors);
            } else {
                console.error('[Login component] Login error:', error);
            }
        }
    }

    return (
        <main>
            <form>
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

                <button
                    type='submit'
                    onClick={submitLogin}
                >
                    Log in
                </button>
            </form>
        </main>
    );
}

export default Login;