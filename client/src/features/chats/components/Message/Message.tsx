import { Avatar, Box, IconButton, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import chatApis from 'api/chat'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { TYPE_MESSAGE } from 'constant/constant'
import { selectCurrentUser } from 'features/auth/authSlice'
import { chatActions } from 'features/chats/chatSlice'
import { ChatMessage, User } from 'models'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { isUrlValid } from 'utils'
import { calculateCreatedTimeHDMY } from 'utils/convert-date/calculateCreatedTime'
import Album from './Album'
import GifPlayer from './GifPlayer'
import LinkPreview from './LinkPreview'

interface Props {
    message: ChatMessage
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '&.me': {
            justifyContent: 'flex-end',

            '& .message-wrapper': {
                flexDirection: 'row-reverse',

                '& .body': {
                    background: '#c4d9e9'
                }
            },
        },

        '& .message-wrapper': {
            maxWidth: '80%',
            display: 'flex',
            gap: 10,

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

                    '&.removed': {
                        background: '#fff',
                        opacity: 0.6
                    },

                    '& .content ': {
                        fontSize: '0.95rem',
                        lineHeight: 1.3,
                        marginBottom: theme.spacing(0.5),

                        '& a': {
                            color: theme.palette.primary.main,
                            textDecoration: 'underline'
                        }
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
    }
}))

const mapContentLink = (content: string) => {
    return content.split(' ').map(part => {
        if (!isUrlValid(part))
            return part

        return `<a href="${part}" target="_blank">${part}</a>`
    }).join(' ')
}

const Message = ({ message }: Props) => {
    const classes = useStyles()

    const dispatch = useAppDispatch()
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)
    const [isOwner, setIsOwner] = useState(false)

    const { _id, type, content, urlImages, urlGif, dataLink, createdAt, seen, owner: { avatarUrl, name }, removed } = message

    useEffect(() => {
        if (currentUser) {
            setIsOwner(message.owner._id === currentUser._id)
        }
    }, [currentUser, message])

    const handleRemoveMessage = async () => {
        try {
            await chatApis.removeChatMessage(_id)

            dispatch(chatActions.resetFilterMessage())
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <Box className={`${classes.root} ${isOwner ? 'me' : ''}`} component='li'>
            <Box className='message-wrapper'>
                <Box className='avatar'>
                    <Tooltip title={name}>
                        <Avatar src={avatarUrl}>U</Avatar>
                    </Tooltip>
                </Box>

                <Box className={`wrapper ${type === TYPE_MESSAGE.link ? 'preview' : ''}`}>
                    <Box className={`body ${removed ? 'removed' : ''}`}>
                        {removed ? <Typography>
                            Tin nhắn đã được thu hồi
                        </Typography>
                            : <>
                                {type === TYPE_MESSAGE.text && <Typography className='content'>
                                    {content}
                                </Typography>}

                                {type === TYPE_MESSAGE.link &&
                                    <p className='content' dangerouslySetInnerHTML={{ __html: mapContentLink(content) }} />}

                                {type === TYPE_MESSAGE.image && <Album images={urlImages} />}

                                {type === TYPE_MESSAGE.gif && <GifPlayer gif={urlGif} />}

                                <Typography className='date' component='small'>
                                    {calculateCreatedTimeHDMY(createdAt)}

                                    {isOwner && seen.length > 1 && <span>&#xa0;&#xa0;&#x22C5;&#xa0;&#xa0;Đã xem</span>}
                                </Typography>
                            </>
                        }
                    </Box>

                    {type === TYPE_MESSAGE.link && <LinkPreview dataLink={dataLink} />}
                </Box>

                {isOwner && <Box className='btn-control' component='span'>
                    <IconButton size="small">
                        <MoreVert fontSize="inherit" />
                    </IconButton>

                    <ul className='actions'>
                        <li className='action' onClick={handleRemoveMessage}>
                            Xóa, gỡ bỏ
                        </li>
                    </ul>
                </Box>}
            </Box>
        </Box>
    )
}

export default Message
