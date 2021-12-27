import { Avatar, Box, Paper, Theme, Typography } from "@material-ui/core"
import { ChatOutlined, FavoriteBorder } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { Post } from "models"
import { calculateCreatedTime } from "utils/convert-date/calculateCreatedTime"
import { Link } from 'react-router-dom'
import { UserTooltip } from "components/Common"

interface Props {
    post: Post
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        width: '100%',
        boxShadow: theme.shadows[2],

        '& > .author-info': {
            display: 'flex',
            alignItems: 'center',

            '& .avatar': {
                marginRight: theme.spacing(1),
                width: 40,
                height: 40,
            },

            '& .details': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',

                '& .name': {
                    fontSize: '1em',
                    cursor: 'pointer',
                    transition: '300ms',

                    '&:hover': {
                        color: theme.palette.primary.main
                    }
                },

                '& .date': {
                    fontSize: '0.85em',
                    color: theme.palette.text.secondary
                }
            }
        },

        '& > .post-detail-container': {
            paddingLeft: 48,
            marginTop: theme.spacing(1),

            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },

            '& .title': {
                fontSize: '1.4em',
                width: '100%',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                display: 'block',
                cursor: 'pointer',
                marginBottom: theme.spacing(1),
                transition: '300ms',

                [theme.breakpoints.down('sm')]: {
                    fontSize: '1.3em',
                },

                [theme.breakpoints.down('xs')]: {
                    fontSize: '1.2em',
                },

                '&:hover': {
                    color: theme.palette.primary.main
                }
            },

            '& .tags': {
                display: 'flex',
                marginBottom: theme.spacing(1),

                '& .tag': {
                    '&:not(:last-child)': {
                        marginRight: theme.spacing(1.5),
                    },

                    '& .text': {
                        fontSize: '0.95em',
                        color: theme.palette.text.secondary,

                        [theme.breakpoints.down('sm')]: {
                            fontSize: '0.85em',
                        },
                    }
                }
            },

            '& .static-wrraper': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                [theme.breakpoints.down('xs')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                },

                '& .left': {
                    display: 'flex',

                    '& .static': {
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: theme.spacing(3),

                        '& .text': {
                            [theme.breakpoints.down('xs')]: {
                                fontSize: '0.9em'
                            },
                        },

                        '& .icon': {
                            marginRight: theme.spacing(1),

                            [theme.breakpoints.down('xs')]: {
                                width: 16,
                                height: 16,
                                marginRight: theme.spacing(0.5),
                            },
                        }
                    }
                },

                '& .thread': {
                    background: '#d6d6d7',
                    padding: theme.spacing(0.5, 1),
                    borderRadius: 15,
                    fontSize: '0.85em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.7em',
                        marginTop: theme.spacing(1)
                    },
                }
            }
        }
    }
}))

export const PostRecent = ({ post }: Props) => {
    const classes = useStyles()

    const { _id, createdAt, title, tags, totalLikes, numComments, subject: { name: thread }, owner: { _id: userId, avatarUrl, name }, owner } = post

    return (
        <Paper className={classes.root}>
            <Box className='author-info'>
                <UserTooltip data={owner}>
                    <Avatar
                        className='avatar'
                        src={avatarUrl as string}
                    />
                </UserTooltip>

                <Box
                    className='details'
                    component='span'
                >
                    <Typography
                        className='name'
                        variant='h6'
                    >
                        <Link to={`/profile/${userId}`}>
                            {name}
                        </Link>
                    </Typography>

                    <Typography
                        className='date'
                        component='small'
                    >
                        {calculateCreatedTime(createdAt)}
                    </Typography>
                </Box>
            </Box>

            <Box className='post-detail-container'>
                <Typography
                    variant='h3'
                    className='title'
                >
                    <Link to={`/posts/${_id}`}>
                        {title}
                    </Link>
                </Typography>


                <ul className="tags">
                    {tags.map((tag, index) => (
                        <li
                            key={index}
                            className="tag"
                        >
                            <Typography className='text'>
                                {`#${tag}`}
                            </Typography>
                        </li>
                    ))}
                </ul>

                <Box className='static-wrraper'>
                    <div className="left">
                        <span className="static">
                            <FavoriteBorder className='icon' />

                            <Typography className='text'>
                                {totalLikes} lượt thích
                            </Typography>
                        </span>

                        <span className="static">
                            <ChatOutlined className='icon' />

                            <Typography className='text'>
                                {numComments} bình luận
                            </Typography>
                        </span>
                    </div>

                    <Typography className="thread">
                        {thread}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}
