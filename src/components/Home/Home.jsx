import styles from './Home.module.css';

import { useNavigate } from "react-router-dom";

import { useAuthContext } from '../AuthContext/AuthContext.jsx';
import Loading from '../Loading/Loading.jsx';
import Notebook from '../Notebook/Notebook.jsx';

function Home() {
    const navigate = useNavigate();

    const authContext = useAuthContext();

    if (authContext.loading) {
        return (
            <main className={styles.main}>
                <Loading size='10rem' borderWidth="0.8rem" />
            </main>
        );
    }

    if (authContext.unexpectedError) {
        return (
            <main className={styles.main}>
                <div className={styles.unexpectedError}>
                    <p>{"Um erro inesperado aconteceu =("}</p>
                    <p>Por favor, tente mais tarde!</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            {
                (authContext.loggedUsername !== null) ? (
                    <Notebook />
                ) : (
                    <>
                        <section className={styles.hero}>
                            <img src="/ss_1.png" alt="Print 1" />
                            <div className={styles.heroText}>
                                <h2>Os seus pensamentos merecem mais que uma mensagem no WhatsApp!</h2>
                                <p>
                                    Escreva suas ideias, notas e rascunhos  — tudo em um único e simples lugar.
                                </p>
                                <button
                                    className={styles.homeButton}
                                    onClick={() => navigate('/register')}
                                >
                                    Comece a Escrever!
                                </button>
                            </div>
                        </section>

                        <section className={styles.why}>
                            <div>
                                <h2>Por que o Rascunho?</h2>
                                <p>
                                    A maioria das pessoas costuma usar o WhatsApp para escrever pequenos textos,
                                    como listas de compras, lembretes e rascunhos rápidos. No entanto, isso pode se
                                    perder no meio de outras mensagens, tornando difícil encontrar essas informações depois.
                                </p>
                                <p className={styles.lastLine}>
                                    O Rascunho oferece um espaço limpo, organizado e rápido para as suas ideias!
                                </p>
                            </div>
                            <img src="/wpp.png" alt="Screenshot do WhatsApp cheio de anotações - coisa do passado!" />
                        </section>

                        <section className={styles.how}>
                            <h2>Como funciona?</h2>
                            <div className={styles.steps}>
                                <div className={styles.step}>
                                    <h3>🗒️ Escreva</h3>
                                    <p>Crie uma nota com título e texto</p>
                                </div>
                                <div className={styles.step}>
                                    <h3>🏷️ Tag</h3>
                                    <p>Adicione suas próprias tags para organizar suas anotações.</p>
                                </div>
                                <div className={styles.step}>
                                    <h3>🔍 Busque</h3>
                                    <p>Encontre facilmente suas notas filtrando pelas tags que você criou. É só clicar nelas!</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.cta}>
                            <h2>Pronto para começar?</h2>
                            <p>
                                Sem e-mail, sem dados pessoais e sem blá-blá-blá. Crie um nome de usuário, uma senha e comece a escrever!
                            </p>
                            <button className={styles.homeButton} onClick={() => navigate('/register')}>
                                Crie sua conta
                            </button>
                        </section>
                    </>
                )
            }
        </main>
    );
}

export default Home;