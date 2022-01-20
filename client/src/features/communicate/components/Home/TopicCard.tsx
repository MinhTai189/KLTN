import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Theme, Tooltip, Typography } from "@material-ui/core"
import { PostAdd } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch } from "app/hooks"
import { createPostModalActions } from "features/posts/openCreatePostModalSlice"
import { useHistory } from "react-router"

interface Props {
    image: string
    title: string
    view: number | string
    count: number | string
    type: number
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        boxShadow: theme.shadows[6],
        borderRadius: 30,

        '& .top': {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            '& .img': {
                height: 170,
                width: 'auto',
                objectFit: 'cover',

                [theme.breakpoints.down('xs')]: {
                    height: 140
                },
            },

            '& .title': {
                fontSize: '1.25em',
                color: theme.palette.primary.main,
                fontWeight: 500,
                textTransform: 'capitalize',
                marginBottom: theme.spacing(1),

                [theme.breakpoints.down('xs')]: {
                    fontSize: '1.15em',
                },
            }
        },

        '& .bottom': {
            width: '100%',

            '& .static': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginBottom: theme.spacing(1.5),

                '& .pairs': {
                    textAlign: 'center',

                    '& .num': {
                        fontSize: '1.3em',
                        lineHeight: 1,
                        fontWeight: 400,

                        [theme.breakpoints.down('xs')]: {
                            fontSize: '1.15em',
                        },
                    },

                    '& .text': {
                        fontSize: '0.8em',
                        color: theme.palette.text.hint,

                        [theme.breakpoints.down('xs')]: {
                            fontSize: '0.75em',
                        },
                    }
                }
            }
        }
    }
}))

export const TopicCard = ({ image, title, view, count, type }: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const history = useHistory()

    const handleClickNavigation = () => {
        history.push('/posts')
    }

    const handleClickCreatePost = () => {
        if (type === 3) {
            console.log('zoooooo', type);
            history.push('/create-post/review')
            return
        }

        dispatch(createPostModalActions.setShowModal(type))
    }

    return (
        <Card className={classes.root}>
            <CardActionArea
                onClick={handleClickNavigation}
            >
                <Box className='top'>
                    <CardMedia
                        className='img'
                        src={image}
                        component='img'
                    />

                    <Typography className='title' variant='h5'>
                        {title}
                    </Typography>
                </Box>
            </CardActionArea>

            <CardContent className='bottom'>
                <div className="static">
                    <span className="pairs">
                        <Typography className='num' variant='h6'>
                            {view}
                        </Typography>

                        <Typography className='text'>
                            Truy cập
                        </Typography>
                    </span>

                    <span className="pairs">
                        <Typography className='num' variant='h6'>
                            {count}
                        </Typography>

                        <Typography className='text'>
                            Bài viết
                        </Typography>
                    </span>
                </div>

                <Box textAlign='center'>
                    <Tooltip title='Đăng bài viết'>
                        <IconButton onClick={handleClickCreatePost}>
                            <PostAdd />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    )
}
