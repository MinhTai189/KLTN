import { Box, Theme } from '@material-ui/core'
import { Star } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Avatar from 'assets/images/avatar-default.jpg'
import { Rate } from 'models'

interface Props {
    className?: string;
    dataRate: Rate
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 350,
        height: 450,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(3, 2),
        boxShadow: '0px 0px 11px 5px rgba(0, 0, 0, 0.25)',
        opacity: 0,
        position: 'absolute',

        "&.singular": {
            opacity: 1,
            position: 'unset',

            "&:nth-child(2)": {
                marginLeft: 36
            }
        },

        "&.active.dnext": {
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            animation: `$nextActive 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.active.dprev": {
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            animation: `$prevActive 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.next.dnext": {
            opacity: 1,
            transform: 'translateX(350px) scale(0.9)',
            animation: `$nextNext 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.next.dprev": {
            opacity: 1,
            transform: 'translateX(350px) scale(0.9)',
            animation: `$prevNext 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.nNext.dprev": {
            opacity: 0,
            transform: 'translateX(700px) scale(0)',
            animation: `$prevNNext 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.prev.dnext": {
            opacity: 1,
            transform: 'translateX(-350px) scale(0.9)',
            animation: `$nextPrev 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.prev.dprev": {
            opacity: 1,
            transform: 'translateX(-350px) scale(0.9)',
            animation: `$prevPrev 300ms ${theme.transitions.easing.easeInOut} forwards`
        },

        "&.pPrev.dnext": {
            opacity: 0,
            transform: 'translateX(-700px) scale(0)',
            animation: `$nextPPrev 300ms ${theme.transitions.easing.easeInOut} forwards`
        },
    },
    top: {
        textAlign: 'center',

        '& .avatar': {
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `2px solid ${theme.palette.primary.main}`,
            marginBottom: 8
        },

        "& .stars": {
            display: 'flex',
            justifyContent: 'center',
            margin: 0,

            "& .MuiSvgIcon-root": {
                width: '1.5em',
                height: '1.5em',
                fill: '#f3ec50'
            }
        }
    },
    middle: {
        textAlign: 'center',

        "& .content": {
            color: '#7B7B7B',
            marginBottom: 8,
            fontSize: 16
        },

        "& .date": {
            fontSize: 14,
            fontWeight: 600
        }
    },
    bottom: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',

        '& .name': {
            fontSize: 13,
            marginBottom: 0
        },

        '& .position': {
            fontSize: 10,
            color: '#7B7B7B',
        }
    },
    '@keyframes nextActive': {
        'from': {
            transform: 'translateX(0) scale(1)',
        },
        'to': {
            transform: 'translateX(350px) scale(0.9)'
        }
    },
    '@keyframes prevActive': {
        'from': {
            transform: 'translateX(0) scale(1)',
        },
        'to': {
            transform: 'translateX(-350px) scale(0.9)'
        }
    },
    '@keyframes nextNext': {
        '0%': {
            transform: 'translateX(350px) scale(0.9)',
            opacity: 1
        },
        '50%': {
            opacity: 0
        },
        '100%': {
            transform: 'translateX(700px) scale(0)',
            opacity: 0
        }
    },
    '@keyframes prevNext': {
        'from': {
            transform: 'translateX(350px) scale(0.9)'
        },
        'to': {
            transform: 'translateX(0) scale(1)'
        }
    },
    '@keyframes nextPrev': {
        'from': {
            transform: 'translateX(-350px) scale(0.9)'
        },
        'to': {
            transform: 'translateX(0) scale(1)'
        }
    },
    '@keyframes prevPrev': {
        '0%': {
            transform: 'translateX(-350px) scale(0.9)',
            opacity: 1
        },
        '50%': {
            opacity: 0
        },
        '100%': {
            transform: 'translateX(-700px) scale(0.9)',
            opacity: 0
        }
    },
    '@keyframes nextPPrev': {
        'from': {
            transform: 'translateX(-700px) scale(0)',
            opacity: 0
        },
        'to': {
            transform: 'translateX(-350px) scale(0.9)',
            opacity: 1
        }
    },
    '@keyframes prevNNext': {
        'from': {
            transform: 'translateX(700px) scale(0)',
            opacity: 0,
        },
        'to': {
            transform: 'translateX(350px) scale(0.9)',
            opacity: 1
        }
    },
}))

export const CardItem = ({ className = '', dataRate }: Props) => {
    const classes = useStyles()
    const { content, createAt, star, _id, user: { name, avatarUrl, _id: userId } } = dataRate

    const createdDate = new Date(createAt)
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' })

    return (
        <Box className={`${classes.root} ${className}`}>
            <Box className={classes.top}>
                <img className='avatar' src={avatarUrl} alt="avatar" />

                <ul className="stars">
                    {new Array(star).fill(1).map((_, index) => (
                        <li>
                            <Star key={index} />
                        </li>
                    ))}
                </ul>
            </Box>

            <Box className={classes.middle}>
                <p className='content'>{content}</p>

                <small className='date'>{date}</small>
            </Box>

            <Box className={classes.bottom}>
                <h5 className='name'>{name}</h5>

                <small className='position'>Admin</small>
            </Box>
        </Box>
    )
}
