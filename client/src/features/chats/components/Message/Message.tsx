import { Avatar, Box, Button, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import Album from './Album'
import GifPlayer from './GifPlayer'
import LinkPreview from './LinkPreview'

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

        '& .wrapper': {
            '&.preview': {
                maxWidth: 350,

                '& .body': {
                    borderRadius: '10px 10px 0 0'
                }
            },

            '& .body': {
                flex: 1,
                padding: theme.spacing(1.5),
                borderRadius: 10,
                boxShadow: theme.shadows[2],
                border: '1px solid #ccc',
                background: '#d7d7d7',

                '& .content ': {
                    fontSize: '0.95rem',
                    lineHeight: 1.3,
                    marginBottom: theme.spacing(0.5)
                },

                '& .date': {
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary
                }
            },
        },

        '& .btn-control': {
            width: 'fit-content',
            alignSelf: 'center',
            position: 'relative',

            '&:hover': {
                '& .actions': {
                    transform: 'scale(1)',
                    visibility: 'visible',
                    transition: '300ms'
                }
            },

            '& .actions': {
                position: 'absolute',
                background: '#fff',
                boxShadow: theme.shadows[3],
                bottom: 0,
                left: 0,
                width: 'max-content',
                padding: theme.spacing(1, 0),
                borderRadius: 5,
                transform: 'scale(0)',
                visibility: 'hidden',

                '& .action': {
                    cursor: 'pointer',
                    padding: theme.spacing(0.5, 2),
                    userSelect: 'none',

                    '&:hover': {
                        background: 'rgba(0, 0, 0, 0.1)'
                    }
                }
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

            <Box className='wrapper preview'>
                <Box className='body'>
                    {!gif ? <Typography className='content'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    </Typography>

                        : <Album />}

                    <Typography className='date' component='small'>
                        12:30, 12/12/1021&#xa0;&#xa0;&#x22C5;&#xa0;&#xa0;Đã xem
                    </Typography>
                </Box>

                <LinkPreview />
            </Box>

            {isOwner && <Box className='btn-control' component='span'>
                <IconButton size="small">
                    <MoreVert fontSize="inherit" />
                </IconButton>

                <ul className='actions'>
                    <li className='action'>
                        Xóa, gỡ bỏ
                    </li>
                </ul>
            </Box>}
        </Box>
    )
}

export default Message
