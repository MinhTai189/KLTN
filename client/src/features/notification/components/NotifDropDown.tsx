import { Box, Divider, makeStyles, Theme, Typography } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { NoData } from "components/Common"
import { selectCurrentUser } from "features/auth/authSlice"
import { notifyActions } from 'features/notification/notifySlice'
import { User } from "models"
import { Link, useHistory } from "react-router-dom"
import { calculateCreatedTime } from "utils/convert-date/calculateCreatedTime"

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: '#fff',
        boxShadow: theme.shadows[5],
        borderRadius: 10,
        width: '100vw',
        maxWidth: 400,
        maxHeight: 600,
        padding: theme.spacing(1.5, 1.5, 0.5),
        overflow: 'hidden',

        '& .header': {
            fontSize: '1.2rem'
        },

        '& .body': {
            minHeight: 200,
            maxHeight: 450,
            overflow: 'auto',

            '&::-webkit-scrollbar': {
                width: 0
            },

            '& .notif-list': {
                '& .notif': {
                    display: 'flex',
                    padding: theme.spacing(0.7),
                    margin: theme.spacing(1, 0),
                    cursor: 'pointer',
                    borderRadius: 5,
                    transition: '300ms',

                    '&.unread': {
                        background: '#edeef2'
                    },

                    '&:hover': {
                        background: '#b4b4b4'
                    },

                    '& .icon': {
                        width: 50,
                        height: 50,
                        marginRight: theme.spacing(1)
                    },

                    '& .detail': {
                        '& .message': {
                            fontSize: '1.05em',
                            lineHeight: 1.3,
                        },

                        '& .date': {
                            fontSize: '0.85em',
                            color: theme.palette.text.secondary
                        }
                    }
                }
            },

            '& .see-more': {
                textAlign: 'center',
                width: '100%',
                display: 'block',
                marginTop: theme.spacing(1),
                transition: '300ms',

                '&:hover': {
                    color: theme.palette.secondary.main
                }
            }
        },

        '& .mark-all': {
            marginTop: theme.spacing(1),
            display: 'grid',
            placeItems: 'center',
            height: 50,
            cursor: 'pointer',
            borderTop: '1px solid #ccc',

            '& .text': {
                color: theme.palette.primary.dark
            }
        }
    }
}))

export const NotifDropDown = ({ }: Props) => {
    const classes = useStyles()

    const currentUser: User = useAppSelector(selectCurrentUser)
    const history = useHistory()
    const dispatch = useAppDispatch()

    const handleReadAll = () => {
        dispatch(notifyActions.readAll())
    }

    const handleReadAndNavigate = (notifyId: string, url: string) => {
        url && history.push(url)
        dispatch(notifyActions.read(notifyId))
    }

    return (
        <Box className={classes.root}>
            <Typography className='header' variant='h5'>
                Thông báo
            </Typography>

            <Divider style={{ marginTop: 4 }} />

            <Box className='body'>
                {currentUser.notify && currentUser.notify.length > 0 ? <>
                    <ul className='notif-list'>
                        {currentUser.notify.slice(0, 10).map(notify => (
                            <li
                                key={notify._id}
                                className={`notif ${!notify.read ? 'unread' : ''}`}
                                onClick={() => handleReadAndNavigate(notify._id, notify.url)}
                            >
                                <img
                                    className='icon'
                                    src={notify.imageUrl}
                                    alt="bell icon"
                                />

                                <Box className='detail'>
                                    <Typography className='message'>
                                        {notify.message}
                                    </Typography>

                                    <Typography className="date" component='small'>
                                        {calculateCreatedTime(notify.createdAt)}
                                    </Typography>
                                </Box>
                            </li>
                        ))}
                    </ul>

                    {currentUser.notify.length > 10 && <Link to='/notifications' className='see-more'>
                        Xem tất cả...
                    </Link>}
                </>

                    : <NoData content='Hiện tại bạn không có thông báo!' />}
            </Box>

            <Box
                className='mark-all'
                onClick={handleReadAll}
            >
                <Typography className='text'>
                    Đánh dấu đã đọc tất cả
                </Typography>
            </Box>
        </Box>
    )
}
