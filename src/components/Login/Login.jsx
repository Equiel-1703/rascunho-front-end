import styles from './Login.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ValidationErrors, BadCredentialsError } from '../../services/BackendApi';
import { useAuthContext } from '../AuthContext/AuthContext';

function Login() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const authContext = useAuthContext();

    const submitLogin = async (event) => {
        event.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await authContext.login(loginUsername, loginPassword);

            // Redirect to home page after successful login
            navigate('/');
        } catch (error) {
            if (error instanceof ValidationErrors) {
                setErrors(error.validationErrors);
            }
            else if (error instanceof BadCredentialsError) {
                setErrors({ password: error.message }); // This will show error near password field
            }
            else {
                alert('Ops! Um erro inesperado aconteceu :(\nPor favor, tente novamente mais tarde.\n\nErro: ' + error.message);
            }
        }
    }

    return (
        <main className={styles.main}>
            <form>
                <div className={styles.loginInput}>
                    <label htmlFor='username_input'>
                        Username:
                    </label>
                    <input
                        type='text'
                        name='username'
                        id='username_input'
                        autoComplete='on'
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
                    <label htmlFor='password_input'>
                        Senha:
                    </label>
                    <input
                        type='password'
                        name='password'
                        id='password_input'
                        autoComplete='on'
                        placeholder='Senha'
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

                <button
                    type='button'
                    onClick={() => navigate('/register')}
                    className={styles.btn}
                >
                    Não tem uma conta? Faça já!
                </button>
            </form>
        </main>
    );
}

export default Login;