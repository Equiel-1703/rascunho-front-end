import styles from './LeftPanel.module.css';

import { useState } from 'react';

import Nota from './Nota/Nota.jsx';
import CriarNota from './CriarNota/CriarNota.jsx';

function LeftPanel() {
    const [selectedTab, setSelectedTab] = useState('notas');

    return (
        <>
            <ul className={styles.tabs}>
                <li
                    className={styles.tab + (selectedTab === 'notas' ? ` ${styles.activeTab}` : ` ${styles.inactiveTab}`)}
                    onClick={() => setSelectedTab('notas')}
                >
                    Notas
                </li>
                <li
                    className={styles.tab + (selectedTab === 'tags' ? ` ${styles.activeTab}` : ` ${styles.inactiveTab}`)}
                    onClick={() => setSelectedTab('tags')}
                >
                    Tags
                </li>
            </ul>
            <div className={styles.tabContent}>
                {
                    selectedTab === 'notas' && (
                        <>
                            <Nota title={"um titulo enorme para testar o text-wrap"} />
                            <CriarNota />
                        </>
                    )
                }
                {
                    selectedTab === 'tags' && (
                        <p>Tags</p>
                    )
                }
            </div>
        </>
    );
}

export default LeftPanel;