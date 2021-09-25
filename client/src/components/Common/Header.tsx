import { AppBar, Button, createStyles, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import { DropDownInfor } from '../Home';
import { selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 199,
            width: '100vw',
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            height: 60
        },
        logo: {
            width: 30,
            height: 30
        },
        navLinks: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            listStyle: 'none',

            "& li": {
                padding: '0 8px'
            }
        }
    }),
);

export const Header = () => {
    const classes = useStyles();
    const currentUser: User = useAppSelector(selectCurrentUser)

    return (
        <div className={classes.root}>
            <nav className={`${classes.nav} container`}>
                <img className={classes.logo} src="https://cdn.thukyluat.vn/nhch-images//CauHoi_Hinh/9eb6abaa-8cda-456c-ad66-26ba4da23ffe.jpg" alt="logo" />

                <ul className={classes.navLinks}>
                    <li>Trang Chủ</li>
                    <li>Trang chủ</li>
                    <li>Trang chủ</li>
                    <li>Trang chủ</li>
                </ul>

                {currentUser?.avatarUrl ?
                    <DropDownInfor />
                    : <Button color='secondary' variant="contained">
                        <Link to='/auth/login'>Đăng nhập</Link>
                    </Button>
                }
            </nav>
        </div>
    );
}
