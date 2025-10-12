import styles from './CriarTag.module.css';

import { useState } from 'react';

import BackendApi from '../../../../services/BackendApi';

function CriarTag({ userId, callback }) {
    const [loading, setLoading] = useState(false);
    
    const criarTagClick = async () => {
        const defaultTagName = "Nova Tag";

        try {
            setLoading(true);

            // Create tag with default name
            await BackendApi.createTag(userId, defaultTagName);
            await callback();

            setLoading(false);
        } catch (error) {
            console.error("[CriarTag] An error occurred while creating a new tag: ", error);
        }
    };

    return (
        <button
            className={styles.newTagButton + (loading ? ` ${styles.newTagLoading}` : '')}
            title="Criar tag"
            aria-label="Criar tag"
            onClick={criarTagClick}
        >
            <img src="/nova_tag.png" alt="nova_tag" />
        </button>
    );
}

export default CriarTag;