import { Box, Button, Grid, makeStyles, Theme, Typography } from "@material-ui/core"
import { ContactMail, Facebook, GitHub } from "@material-ui/icons"
import { NAVIGATION_ROUTES } from "constant/constant"
import { Link } from "react-router-dom"
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(8),
        borderTop: `2px solid ${theme.palette.primary.main}`,
        background: theme.palette.primary.dark,
        padding: theme.spacing(4, 4, 8),
        width: '100%',
        color: "#fff",

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2),
        },

        '& .footer-wrapper': {
            width: '100%',
            maxWidth: 1500,
            marginInline: 'auto',

            '& .wrapper': {
                marginBottom: theme.spacing(2),

                '& .label': {
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    marginBottom: theme.spacing(2),
                    paddingBottom: theme.spacing(0.5),
                    color: "#fff",
                    position: 'relative',

                    '&::after': {
                        content: '""',
                        width: '100%',
                        height: 2,
                        background: '#fff',
                        left: 0,
                        bottom: 0,
                        position: 'absolute'
                    }
                },

                '& form': {
                    '& .row': {
                        marginBlock: theme.spacing(2),
                        display: 'flex',
                        flexDirection: 'column',

                        '& label': {
                            fontSize: '0.9rem'
                        },

                        '& input, textarea': {
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.95rem',
                            padding: theme.spacing(1),
                            color: theme.palette.text.primary,
                            resize: 'none'
                        },
                    }
                },

                '& .list-item': {
                    '& .item': {
                        '&:not(:last-child)': {
                            marginBottom: theme.spacing(2),
                        },

                        '& a': {
                            fontSize: '1rem',
                            transition: '200ms',

                            '&:hover': {
                                color: theme.palette.secondary.main,
                                paddingLeft: theme.spacing(1)
                            }
                        }
                    }
                },

                '& .constructor-wrapper': {
                    '&:not(:last-child)': {
                        marginBottom: theme.spacing(4),
                    },

                    '& .name': {
                        fontSize: '1.05rem',
                        color: '#fff',
                        fontWeight: 500
                    },

                    '& .job': {
                        fontSize: '0.8rem'
                    },

                    '& .school': {
                        fontSize: '0.75rem',
                    },

                    '& .socials': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(3),
                        marginTop: theme.spacing(1),

                        '& .social': {
                            lineHeight: 1,

                            '& a': {
                                display: 'grid',
                                placeItems: 'center',
                                background: '#fff',
                                borderRadius: 5,
                                width: 23,
                                height: 23,
                                transition: '300ms',

                                '& svg': {
                                    height: 13,
                                    width: 'auto',
                                    fill: '#333'
                                },

                                '&:hover': {
                                    background: theme.palette.secondary.main,

                                    '& svg': {
                                        fill: '#fff'
                                    },
                                }
                            },
                        }
                    }
                }
            },
        }
    },
}))

const socials = [
    [{
        icon: <ContactMail />,
        href: 'mailto:tranminhtai189@gmail.com'
    },
    {
        icon: <Facebook />,
        href: 'https://www.facebook.com/tranminhtai.99'
    },
    {
        icon: <Zalo />,
        href: 'https://zalo.me/84366471931'
    },
    {
        icon: <GitHub />,
        href: 'https://github.com/MinhTai189'
    },],
    [{
        icon: <ContactMail />,
        href: 'mailto:tanmaijnguyen@gmail.com'
    },
    {
        icon: <Facebook />,
        href: 'https://www.facebook.com/tanmaij.nguyen'
    },
    {
        icon: <Zalo />,
        href: 'https://zalo.me/84366471931'
    },
    {
        icon: <GitHub />,
        href: 'https://github.com/tanmaij'
    },]
]

export const Footer = () => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className='footer-wrapper'>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={7} md={4}>
                        <Box className="wrapper">
                            <Typography className='label' variant='h4'>
                                Được xây dựng bởi
                            </Typography>

                            <Box className="constructor-wrapper">
                                <Typography className='name' variant='h4'>
                                    Trần Minh Tài
                                </Typography>

                                <Typography className='job'>
                                    Web Developer
                                </Typography>

                                <Typography className='school'>
                                    Trường đại học Tiền Giang
                                </Typography>

                                <ul className="socials">
                                    {socials[0].map((social, index) => (
                                        <li key={index} className='social'>
                                            <a href={social.href} target='_blank'>
                                                {social.icon}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Box>

                            <Box className="constructor-wrapper">
                                <Typography className='name' variant='h4'>
                                    Nguyễn Tấn Mãi
                                </Typography>

                                <Typography className='job'>
                                    Back-end Developer
                                </Typography>

                                <Typography className='school'>
                                    Trường đại học Tiền Giang
                                </Typography>

                                <ul className="socials">
                                    {socials[1].map((social, index) => (
                                        <li key={index} className='social'>
                                            <a href={social.href} target='_blank'>
                                                {social.icon}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={5} md={3}>
                        <Box className="wrapper">
                            <Typography className='label' variant='h4'>
                                Chuyển hướng
                            </Typography>

                            <ul className="list-item">
                                {NAVIGATION_ROUTES.map((item) => (
                                    <li key={item.route} className="item">
                                        <Link to={item.route}>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={5}>
                        <Box className="wrapper">
                            <Typography className='label' variant='h4'>
                                Góp ý
                            </Typography>

                            <form>
                                <Box className="row">
                                    <label htmlFor="caterogy-input">Chủ đề</label>
                                    <input type="text" id='caterogy-input' placeholder="Hãy nhập một chủ đề..." />
                                </Box>

                                <Box className='row'>
                                    <label htmlFor="content-input">Nội dung góp ý</label>
                                    <textarea id='content-input' rows={4} placeholder="Hãy nhập nội dung vào đây..." />
                                </Box>

                                <Box mt={3}>
                                    <Button
                                        style={{
                                            borderRadius: 0
                                        }}
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                    >
                                        Gửi
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
