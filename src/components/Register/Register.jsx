import styles from './Register.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackendApi, { ValidationErrors } from '../../services/BackendApi';

function Login() {
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await BackendApi.registerUser(registerUsername, registerPassword, confirmPassword);

            // Redirect to home page after successful login
            navigate('/');
        } catch (error) {
            if (error instanceof ValidationErrors) {
                setErrors(error.validationErrors);
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
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        value={registerUsername}
                    />
                    {errors.username && (
                        <div className={styles.error}>
                            {errors.username}
                        </div>
                    )}
                </div>

                <div className={styles.loginInput}>
                    <label htmlFor='password'>
                        Senha:
                    </label>
                    <input
                        type='password'
                        name='password'
                        placeholder='Senha'
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        value={registerPassword}
                    />
                    {errors.password && (
                        <div className={styles.error}>
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className={styles.loginInput}>
                    <label htmlFor='confirmPassword'>
                        Confirme a Senha:
                    </label>
                    <input
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirme a Senha'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    {errors.confirmPassword && (
                        <div className={styles.error}>
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>

                <button
                    type='submit'
                    onClick={submitLogin}
                    className={styles.btn}
                >
                    Crie sua Conta
                </button>

                <button
                    type='button'
                    onClick={() => navigate('/login')}
                    className={styles.btn}
                >
                    Já tem uma conta? Faça o Login
                </button>
            </form>
        </main>
    );
}

export default Login;