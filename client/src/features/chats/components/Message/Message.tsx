import { Avatar, Box, makeStyles, Theme, Typography } from '@material-ui/core'
import Album from './Album'
import GifPlayer from './GifPlayer'

interface Props {
    isOwner?: boolean
    gif?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        maxWidth: '80%',
        display: 'flex',
        gap: 10,

        '&.me': {
            flexDirection: 'row-reverse',

            '& .body': {
                background: '#c4d9e9'
            }
        },

        '& .avatar': {
            width: 40,
        },

        '& .body': {
            flex: 1,
            padding: theme.spacing(1.5),
            borderRadius: 10,
            boxShadow: theme.shadows[2],
            border: '1px solid #ccc',
            background: '#f0f0f0',

            '& .content ': {
                fontSize: '0.95rem',
                lineHeight: 1.3,
                marginBottom: theme.spacing(0.5)
            },

            '& .date': {
                fontSize: '0.75rem',
                color: theme.palette.text.secondary
            }
        }
    }
}))

const Message = ({ isOwner, gif }: Props) => {
    const classes = useStyles()

    return (
        <Box className={`${classes.root} ${isOwner ? 'me' : ''}`}>
            <Box className='avatar'>
                <Avatar>U</Avatar>
            </Box>

            <Box className='body'>
                {!gif ? <Typography className='content'>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus sit odit, neque adipisci dolore nulla quasi cupiditate
                </Typography>

                    : <Album />}

                <Typography className='date' component='small'>
                    12:30, 12/12/1021&#xa0;&#xa0;&#x22C5;&#xa0;&#xa0;Đã xem
                </Typography>
            </Box>
        </Box>
    )
}

export default Message
