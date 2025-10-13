import styles from './Notebook.module.css';

import NotebookContext from './NotebookContext.jsx';

import LeftPanel from './LeftPanel/LeftPanel.jsx';
import MainPanel from './MainPanel/MainPanel.jsx';
import ActionsPanel from './ActionsPanel/ActionsPanel.jsx';
import { WindowSize } from '../WindowSize/WindowSize.jsx';

import { useState } from 'react';

function Notebook() {
    const { width, _ } = WindowSize();
    const isMobile = width <= 768; // Mobile breakpoint

    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const toggleLeftMenu = () => setLeftMenuOpen(!leftMenuOpen);

    return (
        <div className={styles.mainContainer}>
            <NotebookContext>
                {
                    isMobile ? (
                        <div className={styles.mobileWrapper}>
                            <div
                                className={
                                    leftMenuOpen ? styles.leftPanelMobileOpen : styles.leftPanelMobileClosed
                                }
                            >
                                <LeftPanel />
                            </div>
                            {
                                leftMenuOpen && (
                                    <div
                                        className={styles.overlay}
                                        onClick={toggleLeftMenu}
                                    >
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <LeftPanel />
                    )
                }
                <MainPanel />
                <ActionsPanel isMobile={isMobile} toggleLeftMenu={toggleLeftMenu} />
            </NotebookContext>
        </div>
    );
}

export default Notebook;