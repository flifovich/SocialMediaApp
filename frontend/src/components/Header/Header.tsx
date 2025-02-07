import { NavLink } from 'react-router-dom';
import classes from './Header.module.scss';
import { useAuthentication } from '../../features/authentication/contexts/AuthenticationContextProvider';
import { useEffect, useState } from 'react';
import { Profile } from './components/Profile/Profile';

export function Header(){
    const { user } = useAuthentication();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNavigationMenu, setShowNavigationMenu] = useState(
        window.innerWidth > 1080 ? true : false
    );

    useEffect(() => {
        const handleResize = () => {
            setShowNavigationMenu(window.innerWidth > 1080);
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [])
    
    return (
        <header className={classes.root}>
            <div className={classes.container}>
                <div className={classes.left}>
                    <NavLink to="/">
                        Socialize
                    </NavLink>
                    
                </div>
                <div className={classes.right}>
                    <button
                    className={classes.toggle}
                    onClick={() => {
                        setShowNavigationMenu((prev) => !prev);
                        setShowProfileMenu(false);
                    }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                    </svg>
                    </button>

                    {showNavigationMenu ? (
                        <ul>
                            <li>
                                <NavLink 
                                    to="/"
                                    className={({ isActive }) => (isActive ? classes.active : "")}
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        if(window.innerWidth <= 1080) {
                                            setShowNavigationMenu(false);
                                        }
                                    }}
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="24"
                                    height="24"
                                    focusable="false"
                                    >
                                    <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                                    </svg>
                                <span>Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/friends"
                                    className={({ isActive }) => (isActive ? classes.active : "")}
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        if(window.innerWidth <= 1080) {
                                            setShowNavigationMenu(false);
                                        }
                                    }}
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    focusable="false"
                                    >
                                    <path d="M13 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2h10zM9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm8-4V6h-2V4h2V2h2v2h2v2h-2v2z"></path>
                                    </svg>
                                <span>Friends</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/notifications"
                                    className={({ isActive }) => (isActive ? classes.active : "")}
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        if(window.innerWidth <= 1080) {
                                            setShowNavigationMenu(false);
                                        }
                                    }}
                                >
                                   <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="24"
                                    height="24"
                                    focusable="false"
                                    >
                                    <path d="M12 22s-7-4.35-10-9c-2-3.36-1-8 3-9.5 2.58-.87 5.43.64 7 3.17 1.57-2.53 4.42-4.04 7-3.17 4 1.5 5 6.14 3 9.5-3 4.65-10 9-10 9z"></path>                                    </svg>
                                <span>Notifications</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/messages"
                                    className={({ isActive }) => (isActive ? classes.active : "")}
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        if(window.innerWidth <= 1080) {
                                            setShowNavigationMenu(false);
                                        }
                                    }}
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    focusable="false"
                                    >
                                    <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                                    </svg>
                                <span>Messages</span>
                                </NavLink>
                            </li>
                        </ul>
                    ): null}

                    {user ? (
                        <Profile 
                            setShowNavigationMenu={setShowNavigationMenu}
                            showProfileMenu={showProfileMenu}
                            setShowProfileMenu={setShowProfileMenu}
                        />
                    ): null}
                </div>
            </div>
        </header>
    )
}