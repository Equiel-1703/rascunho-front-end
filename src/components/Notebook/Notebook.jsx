import styles from './Notebook.module.css';

import LeftPanel from './LeftPanel/LeftPanel.jsx';
import MainPanel from './MainPanel/MainPanel.jsx';

function Notebook() {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftPanel}>
                <LeftPanel />
            </div>
            <div className={styles.mainPanel}>
                
            </div>
        </div>
    );
}

export default Notebook;