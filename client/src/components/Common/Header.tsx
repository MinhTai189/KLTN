import { Box, createStyles, makeStyles, Theme, Typography, Badge, Avatar } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Logo from 'assets/images/logo.png';
import { authActions, selectCurrentUser } from 'features/auth/authSlice';
import { User } from 'models';
import { useCallback, useEffect, useState } from 'react';
import { DropDownInfor } from '../Home';
import { ButtonCustom } from './Button';
import { Link, NavLink } from 'react-router-dom'
import { Forum, Notifications } from '@material-ui/icons';
import { NotifDropDown } from 'features/notification/components';
import { DetectClickOutsize } from './DetectClickOutsize';
import { NAVIGATION_ROUTES } from 'constant/constant';
import { selectTotalUnseenMessageChat } from 'features/chats/chatSlice';

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

            [theme.breakpoints.down('md')]: {
                width: 40,
                height: 40
            }
        },
        navLinks: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

                [theme.breakpoints.down('md')]: {
                    padding: '4px 8px',
                    fontSize: 13,
                }
            },

            [theme.breakpoints.down('sm')]: {
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

                '&.notif': {
                    [theme.breakpoints.down(490)]: {
                        position: 'fixed',
                        top: 60,
                    }
                }
            }
        }
    }),
);

const calcSizeBtn = (width: number) => {
    let size = 'medium'

    if (width <= 960)
        size = 'small'

    return size
}

export const Header = ({ isChangeNav }: Props) => {
    const classes = useStyles();
    const dispatch = useAppDispatch()

    const totalNewMessage = useAppSelector(selectTotalUnseenMessageChat)
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)

    const [showNotif, setShowNotif] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [sizeBtn, setSizeBtn] = useState<any>('large')

    const amountNotif = useCallback(() => {
        if (!currentUser?.notify) return 0

        return currentUser.notify.filter(notify => !notify.read).length
    }, [currentUser])

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
        <div className={classes.root} style={isChangeNav ? { background: '#1976d2' } : {}}>
            <nav className={classes.nav} style={isChangeNav ? { padding: '8px 16px' } : {}}>
                <Link to='/'>
                    <img className={classes.logo} src={Logo} alt="logo" />
                </Link>

                <ul
                    className={classes.navLinks}
                >
                    {NAVIGATION_ROUTES.map((route, index) => {
                        return (
                            <NavLink key={index} to={route.route} exact>
                                <li className='nav-link'>
                                    <Typography>
                                        {route.name}
                                    </Typography>
                                </li>
                            </NavLink>
                        )
                    })}
                </ul>

                {currentUser ?
                    <Box className={classes.ctaWrapper}>
                        <Box className='badge' component='span'>
                            <Link to='/chats'>
                                <Badge
                                    badgeContent={totalNewMessage}
                                    color="primary"
                                    showZero
                                >
                                    <Forum />
                                </Badge>
                            </Link>
                        </Box>

                        <Box className='badge' component='span'>
                            <Badge
                                badgeContent={amountNotif()}
                                color="secondary"
                                showZero
                                onClick={() => setShowNotif(!showNotif)}
                            >
                                <Notifications />
                            </Badge>

                            {showNotif && <DetectClickOutsize cb={() => setTimeout(() => setShowNotif(false), 100)}>
                                <Box className='dropdown notif'>
                                    <NotifDropDown />
                                </Box>
                            </DetectClickOutsize>}
                        </Box>

                        {currentUser && <Box className='avatar-wrapper'>
                            <Avatar
                                className='avatar'
                                src={currentUser.avatarUrl}
                                onClick={() => setShowDropdown(!showDropdown)} />

                            {showDropdown && <DetectClickOutsize cb={() => setTimeout(() => setShowDropdown(false), 100)}>
                                <Box className='dropdown'>
                                    <DropDownInfor />
                                </Box>
                            </DetectClickOutsize>}
                        </Box>}
                    </Box>
                    : <ButtonCustom sizeBtn={sizeBtn}>
                        <Link to='/auth/login' onClick={() => dispatch(authActions.loginFailed(''))}>????ng nh???p</Link>
                    </ButtonCustom>
                }
            </nav>
        </div>
    );
}
