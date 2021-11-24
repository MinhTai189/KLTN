import { Box, makeStyles, Theme, Typography, Avatar } from '@material-ui/core'
import { REVIEW_ID } from 'contants/contants'
import ListPostContext from 'features/posts/contexts/ListPostContext'
import { Post as PostModel } from 'models'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { calculateCreatedTime } from 'utils/calculateCreatedTime'

interface Props {
    postData: PostModel
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(4),

        '& .title': {
            fontSize: '1.2em',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            marginBottom: 8,
            transition: '300ms',

            '&:hover': {
                color: theme.palette.primary.main
            }
        },

        '& .content': {
            display: 'flex',

            '& .avatar': {
                width: '1.7em',
                height: '1.7em',
                marginRight: theme.spacing(1.5),
            },

            '& .body': {
                background: '#edeef2',
                width: '100%',
                borderRadius: 10,
                padding: theme.spacing(1.5, 2),

                '& .author-info': {
                    display: 'flex',
                    alignItems: 'center',

                    '& .name': {
                        fontSize: '0.95em',
                        color: theme.palette.text.primary
                    },

                    '& .timestamp': {
                        fontSize: '0.9em',
                        color: theme.palette.text.hint
                    },
                },

                '& .text': {
                    fontSize: '1.1em',
                    fontWeight: 400,
                    marginTop: 8,
                    lineHeight: 1.6
                }
            },

            '& .tag-wrapper': {
                '& .list-tag': {
                    display: 'flex',
                    justifyContent: 'flex-end',

                    '& .tag': {
                        '&:not(:last-child)': {
                            marginRight: 12,
                        },

                        '& .text': {
                            fontSize: '0.8725em',
                            color: theme.palette.text.secondary
                        }
                    }
                }
            }
        }
    }
}))

export const Post = ({ postData }: Props) => {
    const classes = useStyles()
    const { _id, title, owner: { avatarUrl, name }, createdAt, content, tags, subject: { _id: subjectId } } = postData

    return (
        <Box className={classes.root} component='li'>
            <Link to={`/posts/${_id}`}>
                <Typography
                    variant='h5'
                    className='title'
                >
                    {title}
                </Typography>

                <Box className='content'>
                    <Avatar
                        className='avatar'
                        src={avatarUrl as string}
                    />

                    <Box className='body'>
                        <Box className='author-info'>
                            <Typography
                                variant='h6'
                                className='name'
                            >
                                {name}
                            </Typography>

                            <Typography className='timestamp'>
                                &nbsp;•&nbsp;{calculateCreatedTime(createdAt)}
                            </Typography>
                        </Box>

                        {subjectId !== REVIEW_ID && <Typography className='text'>
                            {content}
                        </Typography>}

                        <Box className='tag-wrapper'>
                            <ul className="list-tag">
                                {tags.map((tag, index) => (
                                    <li key={index} className="tag">
                                        <Typography className='text'>
                                            <b>#</b>{tag}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    )
}
