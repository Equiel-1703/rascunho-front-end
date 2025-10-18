import styles from './Header.module.css';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { WindowSize } from '../WindowSize/WindowSize.jsx';
import { useAuthContext } from '../AuthContext/AuthContext.jsx';

function Header() {
    const authContext = useAuthContext();
    const navigate = useNavigate();

    const { width, _ } = WindowSize();
    const isMobile = width <= 768; // Mobile breakpoint

    const userInfo = (
        <div className={styles.userInfo}>
            <p>{authContext.loggedUsername}</p>
            <button
                className={styles.logoutButton}
                onClick={
                    async () => {
                        await authContext.logout();

                        // Redirect to home page after logout
                        navigate('/');
                    }
                }
            >
                <img src="/exit.png" alt="" />
            </button>
        </div>
    );

    const [isUserInfoMenuOpen, setIsUserInfoMenuOpen] = useState(false);
    const [userInfoMenuAnimationClass, setUserInfoMenuAnimationClass] = useState('');

    const animationTimeout = 300; // in milliseconds
    const userInfoButtonClick = () => {
        const newState = !isUserInfoMenuOpen;

        if (newState) {
            setUserInfoMenuAnimationClass(styles.slideDown);
            setIsUserInfoMenuOpen(newState);
        } else {
            setUserInfoMenuAnimationClass(styles.slideUp);

            setTimeout(() => {
                setIsUserInfoMenuOpen(newState);
            }, animationTimeout);
        }
    }

    return (
        <header className={styles.header}>
            <Link to={"/"} className={styles.headerLink}>
                <img src="/chameca.png" alt="chameca" draggable="false" />
                <h1>Rascunho</h1>
            </Link>

            {
                (authContext.loggedUsername !== null) &&
                (
                    isMobile ? (
                        <div className={styles.userInfoMobileContainer}>
                            <button
                                className={styles.userInfoButtonMobile}
                                onClick={userInfoButtonClick}
                            >
                                <img src="/drop-down.png" alt="Drop down arrow" />
                            </button>

                            {
                                isUserInfoMenuOpen && (
                                    <div
                                        className={
                                            styles.userInfoMobile
                                            + ` ${userInfoMenuAnimationClass}`
                                        }
                                    >
                                        {userInfo}
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        userInfo
                    )
                )
            }
        </header >
    );
}

export default Header;