
import classes from "./Loader.module.scss";

export function Loader(){
    return (
        <div className={classes.root}>
            <img src="" alt="Loading..." />
            <div className={classes.container}>
                <div className={classes.content}></div>
            </div>
        </div>
    )
}