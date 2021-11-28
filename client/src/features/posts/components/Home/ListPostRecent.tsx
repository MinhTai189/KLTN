import { Box, Theme, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { selectListDataPost } from 'features/posts/postSlice'
import { Link } from 'react-router-dom'
import { PostRecent } from './PostRecent'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& > .top': {
            marginBottom: theme.spacing(3.5),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 0,
            },

            '& .title': {
                fontSize: '1.5rem',

                [theme.breakpoints.down('sm')]: {
                    fontSize: '1.2rem',
                    marginBottom: theme.spacing(1.5)
                }
            },
        },

        '& .list-post': {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,

            [theme.breakpoints.down('md')]: {
                gridTemplateColumns: '1fr',
            },
        }
    }
}))

export const ListPostRecent = () => {
    const classes = useStyles()
    const listRecentPost = useAppSelector(selectListDataPost)

    return (
        <Box className={classes.root} mb={5} mt={10}>
            <Box className='top'>
                <Typography variant='h2' className='title'>
                    Danh sách bài viết mới nhất
                </Typography>

                <Button
                    size='small'
                    style={{
                        textTransform: 'initial',
                        fontWeight: 400
                    }}
                >
                    <Link to='/posts'>
                        Xem tất cả
                    </Link>
                </Button>
            </Box>

            <ul className='list-post'>
                {listRecentPost.map(post => (
                    <PostRecent
                        key={post._id}
                        post={post}
                    />
                ))}
            </ul>
        </Box>
    )
}
