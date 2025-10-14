import styles from './Notebook.module.css';

import NotebookContext from './NotebookContext.jsx';

import LeftPanel from './LeftPanel/LeftPanel.jsx';
import MainPanel from './MainPanel/MainPanel.jsx';
import ActionsPanel from './ActionsPanel/ActionsPanel.jsx';
import { WindowSize } from '../WindowSize/WindowSize.jsx';

import { useState, useRef, useLayoutEffect } from 'react';

function Notebook() {
    const { width, _ } = WindowSize();
    const isMobile = width <= 768; // Mobile breakpoint

    const mainContainerRef = useRef(null);
    const [mainContainerHeight, setMainContainerHeight] = useState(0);

    useLayoutEffect(() => {
        const mainContainer = mainContainerRef.current;
        if (!mainContainer) return;

        // Create a ResizeObserver to monitor height changes
        const resizeObserver = new ResizeObserver(() => {
            setMainContainerHeight(mainContainer.clientHeight);
        });

        resizeObserver.observe(mainContainer);
        
        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
        };
    }, []); // Runs once on mount

    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const toggleLeftMenu = () => setLeftMenuOpen(!leftMenuOpen);

    return (
        <div ref={mainContainerRef} className={styles.mainContainer}>
            <NotebookContext>
                {
                    isMobile ? (
                        <div className={styles.mobileWrapper}>
                            <div
                                className={
                                    leftMenuOpen ? styles.leftPanelMobileOpen : styles.leftPanelMobileClosed
                                }
                                style={{ height: `${mainContainerHeight}px` }}
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