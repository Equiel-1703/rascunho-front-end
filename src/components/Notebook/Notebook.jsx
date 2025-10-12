import styles from './Notebook.module.css';

import NotebookContext from './NotebookContext.jsx';

import LeftPanel from './LeftPanel/LeftPanel.jsx';
import MainPanel from './MainPanel/MainPanel.jsx';
import ActionsPanel from './ActionsPanel/ActionsPanel.jsx';

function Notebook() {
    return (
        <div className={styles.mainContainer}>
            <NotebookContext>
                <LeftPanel />
                <MainPanel />
                <ActionsPanel />
            </NotebookContext>
        </div>
    );
}

export default Notebook;