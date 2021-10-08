import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Logo from 'assets/images/logo.png';
import { authActions, selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { Link } from 'react-router-dom';
import { DropDownInfor } from '../Home';
import { ButtonCustom } from './Button';

interface Props {
    isChangeNav: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 199,
            width: '100%',
            padding: `0 calc((100% - 1200px) / 2)`,
            transition: 'all 300ms ease'
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            transition: 'all 300ms ease'
        },
        logo: {
            width: 50,
            height: 50
        },
        navLinks: {
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            listStyle: 'none',
            flex: 1,
            margin: 0,

            "& li": {
                color: 'white',
                cursor: 'pointer',
                padding: '0 12px',
                fontSize: 14,
                background: 'transparent',
                border: `3px solid transparent`,
                transition: `.3s all`,

                "&:hover, &.active": {
                    color: theme.palette.secondary.main,
                    background: 'white',
                    border: `3px solid ${theme.palette.secondary.main}`,
                },

            }
        }
    }),
);

export const Header = ({ isChangeNav }: Props) => {
    const classes = useStyles();
    const currentUser: User = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    return (
        <div className={classes.root} style={isChangeNav ? { backgroundImage: 'linear-gradient(#000 0%, #2d3436 74%)' } : {}}>
            <nav className={classes.nav} style={isChangeNav ? { padding: '4px 16px' } : {}}>
                <img className={classes.logo} src={Logo} alt="logo" />

                <ul className={classes.navLinks}>
                    <li>Trang Chủ</li>
                    <li>Trang chủ</li>
                    <li>Trang chủ</li>
                    <li className='active'>Trang chủ</li>
                    <li>Trang chủ</li>
                    <li>Trang chủ</li>
                </ul>

                {currentUser?.avatarUrl ?
                    <DropDownInfor />
                    : <ButtonCustom sizeBtn='large'>
                        <Link to='/auth/login' onClick={() => dispatch(authActions.loginFailed(''))}>Đăng nhập</Link>
                    </ButtonCustom>
                }
            </nav>
        </div>
    );
}
