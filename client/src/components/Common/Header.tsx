import { Box, createStyles, makeStyles, Theme, Typography, Badge, Avatar } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Logo from 'assets/images/logo.png';
import { authActions, selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { useEffect, useState } from 'react';
import { DropDownInfor } from '../Home';
import { ButtonCustom } from './Button';
import { Link, NavLink } from 'react-router-dom'
import { Notifications } from '@material-ui/icons';
import { NotifDropDown } from 'features/notification/components';
import { DetectClickOutsize } from './DetectClickOutsize';

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
        },
        ctaWrapper: {
            display: 'flex',
            alignItems: 'flex-end',

            '& .badge': {
                marginRight: theme.spacing(4),
                position: 'relative',

                '& .MuiBadge-root': {
                    cursor: 'pointer',

                    '& > svg': {
                        fill: '#fff'
                    }
                },
            },

            '& .avatar-wrapper': {
                position: 'relative',

                '& .avatar': {
                    boxShadow: theme.shadows[5],
                    outline: `3px solid ${theme.palette.primary.main}`,
                    overflow: 'hidden',
                    transition: `.3s ${theme.transitions.easing.easeIn}`,
                    width: 30,
                    height: 30,
                    cursor: 'pointer',

                    "&:hover": {
                        transform: 'scale(1.03)',
                        boxShadow: theme.shadows[8]
                    }
                }
            },

            '& .dropdown': {
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
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

    const [showNotif, setShowNotif] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
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
    console.log(showDropdown)
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
                    <Box className={classes.ctaWrapper}>
                        <Box className='badge' component='span'>
                            <Badge
                                badgeContent={4}
                                color="secondary"
                                onClick={() => setShowNotif(!showNotif)}
                            >
                                <Notifications />
                            </Badge>

                            {showNotif && <DetectClickOutsize cb={() => setShowNotif(false)}>
                                <Box className='dropdown'>
                                    <NotifDropDown />
                                </Box>
                            </DetectClickOutsize>}
                        </Box>

                        {currentUser && <Box className='avatar-wrapper'>
                            <Avatar
                                className='avatar'
                                src={currentUser.avatarUrl}
                                onClick={() => setShowDropdown(!showDropdown)} />

                            {showDropdown && <DetectClickOutsize cb={() => setShowDropdown(false)}>
                                <Box className='dropdown'>
                                    <DropDownInfor />
                                </Box>
                            </DetectClickOutsize>}
                        </Box>}
                    </Box>
                    : <ButtonCustom sizeBtn={sizeBtn}>
                        <Link to='/auth/login' onClick={() => dispatch(authActions.loginFailed(''))}>Đăng nhập</Link>
                    </ButtonCustom>
                }
            </nav>
        </div>
    );
}
