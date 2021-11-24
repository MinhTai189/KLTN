import { Avatar, Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Post } from 'models'
import { Link } from 'react-router-dom'
import { calculateCreatedTime } from 'utils/calculateCreatedTime'

interface Props {
    post: Post
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 0),


        '& a': {
            color: theme.palette.primary.main,
            transition: '300ms',

            '&:hover': {
                color: theme.palette.secondary.main
            }
        },

        '& .avatar': {
            width: 40,
            height: 40,
            marginRight: theme.spacing(1),
        },

        '& .info': {
            overflow: 'hidden',

            '& .title': {
                width: '100%',
                fontSize: '0.9em',

                '& a': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    display: 'block'
                }
            }
        },

        '& .bottom': {
            fontSize: 12,
            color: theme.palette.text.hint
        }
    },
}))

export const PostInfo = ({ post }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Avatar className='avatar' src={post.owner.avatarUrl} />

            <div className="info">
                <Typography className='title'>
                    <Link to={`/posts/${post._id}`}>
                        {post.content}
                    </Link>
                </Typography>

                <Typography className='bottom'>
                    {calculateCreatedTime(post.createdAt)} &#x22C5;&#xa0;

                    <Link to='/'>
                        {post.owner.name}
                    </Link>
                </Typography>
            </div>

        </Box>
    )
}
