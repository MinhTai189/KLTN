import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { RecommendedLayout } from '../Layout/RecommendedLayout'

interface Props {
    listPost: {
        _id: string
        title: string
    }[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        listStyle: 'disc',
        marginLeft: theme.spacing(3),

        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(2)
        },

        '& .item': {
            marginBottom: 4,

            '& a': {
                display: 'block',
                fontSize: '1.05em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                transition: '300ms',

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.95em'
                },

                '&:hover': {
                    color: theme.palette.primary.main
                }
            }
        }
    }
}))

export const RelatedPost = ({ listPost }: Props) => {
    const classes = useStyles()

    return (
        <RecommendedLayout title='Bài viết liên quan'>
            <ul className={classes.root}>
                {listPost.map(post => (
                    <li
                        key={post._id}
                        className="item"
                    >
                        <Link to={`/posts/${post._id}`}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </RecommendedLayout>
    )
}
