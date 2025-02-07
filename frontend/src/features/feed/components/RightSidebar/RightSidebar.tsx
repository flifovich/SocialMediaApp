import { Button } from '../../../../components/button/Button';
import classes from './RightSidebar.module.scss';

export function RightSidebar(){
    return (
        <div className={classes.root}>
            <h3>People you might know:</h3>
            <div className={classes.items}>
                <div className={classes.item}>
                    <img src="https://i.pravatar.cc/300" alt="" className={classes.avatar} />
                    <div className={classes.content}>
                        <div className={classes.name}>Aleksandar Stefanovic</div>
                        <div className={classes.description}>Professional League player</div>
                        <Button size="medium" outline className={classes.button}>
                            Follow +
                        </Button>
                    </div>
                </div>
                <div className={classes.item}>
                    <img src="https://i.pravatar.cc/300" alt="" className={classes.avatar} />
                    <div className={classes.content}>
                    <div className={classes.name}>Petar Cosic</div>
                        <div className={classes.description}>Profesor u Tehnickoj MLD</div>
                        <Button size="medium" outline className={classes.button}>
                            Follow +
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}