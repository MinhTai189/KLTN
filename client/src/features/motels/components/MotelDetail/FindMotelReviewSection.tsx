import { Box, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { selectFindRoommatePost, selectReviewPost } from 'features/posts/postSlice'
import { Post } from 'models'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1),
            marginTop: theme.spacing(2),
        },

        '& .wrapper': {
            '& .top': {
                marginBottom: theme.spacing(1.5),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',

                '& .title': {
                    fontSize: '1.45em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '1.25em'
                    },
                },

                '& .see-more': {
                    fontSize: '0.8em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.7em'
                    },
                }
            },

            '& .list-post': {
                listStyle: 'disc',
                listStylePosition: 'inside',

                '& .post-title a': {
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.8rem'
                    },

                    "&:hover": {
                        color: theme.palette.primary.main,
                        transition: '300ms'
                    }
                }
            }
        }
    }
}))

export const FindMotelReviewSection = () => {
    const classes = useStyles()
    const { id } = useParams<{ id: string }>()

    const listFindRoommatePost = useAppSelector(selectFindRoommatePost)
    const listReviewPost = useAppSelector(selectReviewPost)

    const [listFindRoommate, setListFindRoomate] = useState<Post[]>([])
    const [listReview, setListReview] = useState<Post[]>([])

    useEffect(() => {
        setListFindRoomate(listFindRoommatePost.filter(post => post.motel._id === id))

        setListReview(listReviewPost.filter(post => post.motel.id === id))
    }, [listFindRoommatePost, listReviewPost, id])

    return (
        <>
            {listFindRoommate.length > 0 && <Paper
                className={classes.root}
                component='section'
            >
                <Box className='wrapper'>
                    <Box className='top'>
                        <Typography
                            className='title'
                            variant='h3'
                        >
                            Tìm người ở ghép
                        </Typography>

                        {listFindRoommate.length > 3 && <Link className='see-more' to='/posts'>
                            Xem thêm
                        </Link>}
                    </Box>

                    <ul className="list-post">
                        {listFindRoommate.slice(0, 3).map(post => (
                            <li
                                className="post-title"
                                key={post._id}
                            >
                                <Link to={`/posts/${post._id}`}>
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Box>
            </Paper>}

            {listReview.length > 0 && <Paper className={classes.root}>
                <Box className='wrapper'>
                    <Box className='top'>
                        <Typography
                            className='title'
                            variant='h3'
                        >
                            Đánh giá nhà trọ
                        </Typography>

                        {listReview.length > 3 && <Link className='see-more' to='/posts'>
                            Xem thêm
                        </Link>}
                    </Box>

                    <ul className="list-post">
                        {listReview.slice(0, 3).map(post => (
                            <li
                                className="post-title"
                                key={post._id}
                            >
                                <Link to={`/posts/${post._id}`}>
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Box>
            </Paper>}
        </>
    )
}
