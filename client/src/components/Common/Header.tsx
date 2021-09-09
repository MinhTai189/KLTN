import { AppBar, Button, createStyles, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import { DropDownInfor } from '../Home';
import { selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        toolbar: {
            justifyContent: 'flex-end'
        },
        btn: {
            borderRadius: 15,

            "& a": {
                color: 'inherit'
            }
        }
    }),
);

export const Header = () => {
    const classes = useStyles();
    const currentUser: User = useAppSelector(selectCurrentUser)

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    {currentUser?.avatarUrl ?
                        <DropDownInfor />
                        : <Button className={classes.btn} color='secondary' variant="contained">
                            <Link to='/auth/login'>Đăng nhập</Link>
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}
