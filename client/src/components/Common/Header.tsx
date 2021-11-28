import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Logo from 'assets/images/logo.png';
import { authActions, selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { useEffect, useState } from 'react';
import { DropDownInfor } from '../Home';
import { ButtonCustom } from './Button';
import { Link, NavLink } from 'react-router-dom'

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
            padding: `0 calc((100% - 1400px) / 2)`,
            transition: 'all 300ms ease'
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 16px',
            transition: 'all 300ms ease'
        },
        logo: {
            width: 40,
            height: 40,

            [theme.breakpoints.down('sm')]: {
                width: 40,
                height: 40
            }
        },
        navLinks: {
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            listStyle: 'none',
            flex: 1,
            margin: 0,

            '& > a.active .nav-link, & .nav-link:hover': {
                background: theme.palette.primary.main,
            },

            "& li": {
                color: 'white',
                cursor: 'pointer',
                padding: '4px 16px',
                background: 'transparent',
                transition: `.3s all`,
                borderRadius: 20,
                textTransform: 'capitalize',
                marginInline: 4,

                '& .MuiTypography-root': {
                    fontSize: '0.9em',
                    letterSpacing: 1,
                },

                [theme.breakpoints.down('sm')]: {
                    padding: '0 4px',
                    fontSize: 13,
                }
            },

            [theme.breakpoints.down('xs')]: {
                display: 'none'
            }
        }
    }),
);

const routes = [
    {
        route: '/',
        name: 'Trang chủ'
    },
    {
        route: '/motels',
        name: 'Nhà trọ'
    },
    {
        route: '/posts',
        name: 'Bài viết'
    },
]

const calcSizeBtn = (width: number) => {
    let size = 'medium'

    if (width <= 960)
        size = 'small'

    return size
}

export const Header = ({ isChangeNav }: Props) => {
    const classes = useStyles();
    const currentUser: User = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    const [sizeBtn, setSizeBtn] = useState<any>('large')

    useEffect(() => {
        setSizeBtn(calcSizeBtn(window.innerWidth))

        window.addEventListener('resize', () => {
            const size = calcSizeBtn(window.innerWidth)

            setSizeBtn(size)
        })

        return () => {
            window.removeEventListener('resize', () => { })
        }
    }, [])

    return (
        <div className={classes.root} style={isChangeNav ? { background: '#1769aa' } : {}}>
            <nav className={classes.nav} style={isChangeNav ? { padding: '8px 16px' } : {}}>
                <Link to='/'>
                    <img className={classes.logo} src={Logo} alt="logo" />
                </Link>

                <ul
                    className={classes.navLinks}
                >
                    {routes.map((route, index) => {
                        return (
                            <NavLink to={route.route} exact>
                                <li
                                    key={index}
                                    className='nav-link'
                                >
                                    <Typography>
                                        {route.name}
                                    </Typography>
                                </li>
                            </NavLink>
                        )
                    })}
                </ul>

                {currentUser?.avatarUrl ?
                    <DropDownInfor />
                    : <ButtonCustom sizeBtn={sizeBtn}>
                        <Link to='/auth/login' onClick={() => dispatch(authActions.loginFailed(''))}>Đăng nhập</Link>
                    </ButtonCustom>
                }
            </nav>
        </div>
    );
}
