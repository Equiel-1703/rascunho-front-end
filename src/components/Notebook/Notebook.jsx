import styles from './Notebook.module.css';

import NotebookContext from './NotebookContext.jsx';

import LeftPanel from './LeftPanel/LeftPanel.jsx';
import MainPanel from './MainPanel/MainPanel.jsx';
import ActionsPanel from './ActionsPanel/ActionsPanel.jsx';
import { WindowSize } from '../WindowSize/WindowSize.jsx';

import { useState, useRef, useLayoutEffect, useEffect } from 'react';

function Notebook() {
    const { width, _ } = WindowSize();
    const isMobile = width <= 768; // Mobile breakpoint

    const mainContainerRef = useRef(null);
    const [mainContainerHeight, setMainContainerHeight] = useState(0);

    // This is used to keep track of the main container height for the mobile left panel
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
    }, []);

    // Scroll to the notebook on mount
    useEffect(() => {
        if (mainContainerRef.current) {
            const parent = mainContainerRef.current.parentElement;

            parent.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const toggleLeftMenu = () => setLeftMenuOpen(!leftMenuOpen);

    // Toggle no-scroll class on body based on left menu state
    useEffect(() => {
        if (isMobile) {
            if (leftMenuOpen) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [leftMenuOpen, isMobile]);

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