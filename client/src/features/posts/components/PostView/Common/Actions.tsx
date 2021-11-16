import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { useAction } from 'hooks'

interface Props {
    size?: 'small' | 'large'
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: '#fff',
        boxShadow: theme.shadows[5],
        display: 'inline-block',
        padding: theme.spacing(0.5, 1.7),
        borderRadius: 40,

        '& .list-action': {
            display: 'flex',
            margin: 0,

            '& .action': {
                position: 'relative',

                '&:not(:last-child)': {
                    marginRight: theme.spacing(1.5),
                },

                '&:hover .label': {
                    bottom: '100%',
                    opacity: 1
                },

                '&.small': {
                    '& .btn svg': {
                        width: '2.5em',
                        height: '2.5em',
                    },

                    '& .label': {
                        fontSize: '0.6em',
                        padding: theme.spacing(0.2, 0.6),
                    },

                    '&:not(:last-child)': {
                        marginRight: theme.spacing(1),
                    },
                },

                '& .btn-action': {
                    display: 'grid',
                    placeItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',

                    '&:hover': {
                        animation: `$icon 300ms cubic-bezier(0.38, 0.16, 0.56, 1.3)`,
                    },

                    '& svg': {
                        width: '3em',
                        height: '3em',
                    }
                },

                '& .label': {
                    position: 'absolute',
                    bottom: '80%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: theme.palette.primary.main,
                    fontSize: '0.7em',
                    padding: theme.spacing(0.2, 0.6),
                    color: '#fff',
                    borderRadius: 10,
                    opacity: 0,
                    transition: '100ms',
                    transitionDelay: '200ms'
                }
            }
        }
    },
    '@keyframes icon': {
        '0%': {
            transform: 'translateX(2px)',
        },
        '20%': {
            transform: 'translateX(-2px)',
        },
        '40%': {
            transform: 'translateX(2px)',
        },
        '60%': {
            transform: 'translateX(-2px)',
        },
        '80%': {
            transform: 'translateX(2px)',
        },
        '100%': {
            transform: 'translateX(-2px)',
        }
    }
}))

export const Actions = ({ size = 'large' }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    return (
        <Box className={classes.root}>
            <ul className="list-action">
                {listAction.map((action, index) => {
                    return (
                        <li
                            className={`action ${size}`}
                            key={index}
                        >
                            <button className='btn-action'>
                                {action.icon}
                            </button>

                            <Typography
                                className='label'
                                component='span'
                            >
                                {action.label}
                            </Typography>
                        </li>
                    )
                })}
            </ul>
        </Box>
    )
}
