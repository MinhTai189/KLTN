import { Box, Divider, makeStyles, Theme, Typography } from "@material-ui/core"
import Bell from 'assets/images/bell.png'
import { Link } from "react-router-dom"

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

    return (
        <Box className={classes.root}>
            <Typography className='header' variant='h5'>
                Thông báo
            </Typography>

            <Divider style={{ marginTop: 4 }} />

            <Box className='body'>
                {<>
                    <ul className='notif-list'>
                        {new Array(8).fill(1).map((_, index) => (
                            <li
                                key={index}
                                className={`notif ${index < 4 ? 'unread' : ''}`}
                            >
                                <img
                                    className='icon'
                                    src={Bell}
                                    alt="bell icon"
                                />

                                <Box className='detail'>
                                    <Typography className='message'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, illum consectetur commodi.
                                    </Typography>

                                    <Typography className="date" component='small'>
                                        4 ngày trước
                                    </Typography>
                                </Box>
                            </li>
                        ))}
                    </ul>

                    <Link to='/notifications' className='see-more'>
                        Xem tất cả...
                    </Link>
                </>}

                {/* <NoData content='Hiện tại bạn không có thông báo!' /> */}
            </Box>

            <Box className='mark-all'>
                <Typography className='text'>
                    Đánh dấu đã đọc tất cả
                </Typography>
            </Box>
        </Box>
    )
}
