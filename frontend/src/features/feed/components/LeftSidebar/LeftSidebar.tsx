import { useAuthentication } from '../../../authentication/contexts/AuthenticationContextProvider';
import classes from './LeftSidebar.module.scss';

export function LeftSidebar(){
    const { user } = useAuthentication();
    return (
        <div className={classes.root}>
            <div className={classes.cover}>
                <img 
                src="https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Cover" />
            </div>
            <div className={classes.avatar}>
                <img src={user?.profilePicture || "/avatar.png"} alt="" />
            </div>
            <div className={classes.name}>{user?.firstName + " " + user?.lastName + " - "}
                                         <span className={classes.username}>{"@" + user?.username}</span></div>
            <div className={classes.description}>{user?.description}</div>
            <div className={classes.info}>
            <div className={classes.item}>
                    <div className={classes.label}>Posts</div>
                    <div className={classes.value}>5</div>
                </div>
                <div className={classes.item}>
                    <div className={classes.label}>Following</div>
                    <div className={classes.value}>89</div>
                </div>
                <div className={classes.item}>
                    <div className={classes.label}>Followers</div>
                    <div className={classes.value}>134</div>
                </div>
                
            </div>
        </div>
    )
}