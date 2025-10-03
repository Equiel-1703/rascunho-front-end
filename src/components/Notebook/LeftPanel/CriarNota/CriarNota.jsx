import styles from './CriarNota.module.css';

import { useState } from 'react';

import BackendApi from '../../../../services/BackendApi';

import { useAuthContext } from '../../../AuthContext/AuthContext';
import { getRandomColorIndex } from '../Nota/Nota';

function CriarNota({ callback }) {
    const authContext = useAuthContext();
    const userId = authContext.loggedUserId;
    
    const [loading, setLoading] = useState(false);

    const criarNotaClick = async () => {
        // Sorteia uma cor para a nova nota
        const colorIndex = getRandomColorIndex();

        try {
            setLoading(true);

            // Cria nota com título padrão "Nova anotação"
            await BackendApi.createAnnotation(userId, colorIndex, "Nova anotação");
            await callback();
            
            setLoading(false);
        } catch (error) {
            console.error("An error occurred while creating a new note: ", error);
        }
    };

    return (
        <button
            className={styles.canetaButton + (loading ? ` ${styles.canetaLoading}` : '')}
            title="Criar nota"
            onClick={criarNotaClick}
        >
            <img src="/caneta-bic.png" alt="caneta" />
        </button>
    );
}

export default CriarNota;