import styles from './Login.module.css';

import { ValidationErrors, BadCredentialsError } from '../../services/BackendApi';
import { useState } from 'react';
import { useAuthContext } from '../AuthContext/AuthContext';

function Login() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errors, setErrors] = useState({});

    const authContext = useAuthContext();

    const submitLogin = async (event) => {
        event.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await authContext.login(loginUsername, loginPassword);

            // Just to debug
            alert('Login successful! You can now access protected resources.');
        } catch (error) {
            if (error instanceof ValidationErrors) {
                setErrors(error.validationErrors);
            }
            else if (error instanceof BadCredentialsError) {
                setErrors({ password: error.message }); // This will show error near password field
            }
            else {
                alert('An unexpected error occurred. Please try again later.\nError details: ' + error.message);
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
                        onChange={(e) => setLoginUsername(e.target.value)}
                        value={loginUsername}
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
                        onChange={(e) => setLoginPassword(e.target.value)}
                        value={loginPassword}
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