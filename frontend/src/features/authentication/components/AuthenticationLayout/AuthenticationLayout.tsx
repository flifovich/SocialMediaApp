
import classes from "./AuthenticationLayout.module.scss";
import { Outlet } from "react-router-dom";

export function AuthenticationLayout(){
    return <div className={`${classes.root}`}>
        <header className={classes.container}>
            <div className={classes.appname}>Socialize</div>
        </header>
        <main className={classes.container}>
            {
                <Outlet />
            }
        </main>
        <footer>
            <ul className={classes.container}>
                <li>
                    <a href="">flifovich <span>2025</span></a>
                    
                </li>
                <li>
                    <a href="">Brand Policy</a>
                </li>
                <li>
                    <a href="">Privacy Policy</a>
                </li>
                <li>
                    <a href="">Copywright Policy</a>
                </li>
                <li>
                    <a href="">Support</a>
                </li>
                <li>
                    <a href="">Contact us</a>
                </li>
                <li>
                    <a href="">Discord</a>
                </li>
            </ul>
        </footer>
    </div>
}