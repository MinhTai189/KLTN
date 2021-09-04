import { Avatar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { useAppSelector } from 'app/hooks';
import { selectCurrentUser } from 'features/auth/authSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        toolbar: {
            justifyContent: 'flex-end'
        },
        avatar: {
            cursor: 'pointer',
            boxShadow: theme.shadows[3]
        }
    }),
);

export const Header = () => {
    const classes = useStyles();
    const currentUser = useAppSelector(selectCurrentUser)

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    {currentUser?.avatarUrl && <Avatar className={classes.avatar} src={currentUser.avatarUrl} />}
                </Toolbar>
            </AppBar>
        </div>
    );
}
