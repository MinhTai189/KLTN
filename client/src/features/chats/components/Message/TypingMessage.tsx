import { Avatar, Box, makeStyles, Theme } from '@material-ui/core'
import { Owner } from 'models'

interface Props {
    user: Owner
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '& .wrapper': {
            maxWidth: '80%',
            display: 'flex',
            gap: 10,

            '& .avatar': {
                width: 40,
            },

            '& .body': {
                flex: 1,
                padding: theme.spacing(1.5),
                borderRadius: 10,
                boxShadow: theme.shadows[2],
                border: '1px solid #ccc',
                background: '#d7d7d7',

                '& .dots': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingInline: theme.spacing(1),
                    gap: theme.spacing(0.5),

                    '& .dot': {
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: theme.palette.primary.main,
                        animation: '$jump infinite 2s',

                        '&:nth-child(2)': {
                            animationDelay: '300ms',
                        },

                        '&:nth-child(3)': {
                            animationDelay: '600ms',
                        }
                    }
                }
            }
        }
    },
    '@keyframes jump': {
        'from': {
            transform: 'translateY(0)',
            opacity: 0.8,
        },
        '50%': {
            transform: 'translateY(2px)',
            opacity: 0.2,
        },
        'to': {
            transform: 'translateY(0)',
            opacity: 1,
        },
    }
}))

const TypingMessage = ({ user }: Props) => {
    const classes = useStyles()

    const { avatarUrl } = user

    return (
        <Box className={classes.root} component='li'>
            <Box className='wrapper'>
                <Avatar src={avatarUrl} className='avatar'>U</Avatar>

                <Box className='body' component='span'>
                    <span className='dots'>
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                    </span>
                </Box>
            </Box>
        </Box>
    )
}

export default TypingMessage
