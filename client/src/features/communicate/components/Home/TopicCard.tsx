import { Box, Card, CardActionArea, CardContent, CardMedia, Theme, Typography, Divider } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useHistory } from "react-router"
import { PostInfo } from "./PostInfo"

interface Props {
    image: string
    title: string
    view: number | string
    count: number | string
    listPost?: any
    background?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 320,
        margin: theme.spacing(1.5, 0),

        '& .top': {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            '& .img': {
                height: 180,
                width: 'auto',
                objectFit: 'cover'
            },

            '& .title': {
                fontSize: '1.25em',
                color: theme.palette.primary.main,
                fontWeight: 500,
                textTransform: 'capitalize',
                marginBottom: theme.spacing(1),
            }
        },

        '& .bottom': {
            width: '100%',

            '& .desc': {
                width: '100%',
                textAlign: 'center',
                fontSize: '1.2em',
                height: 120
            },

            '& .amount': {
                fontSize: '0.8em',
                textAlign: 'right',
                width: '100%',
                display: 'block'
            },

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
                        fontWeight: 400
                    },

                    '& .text': {
                        fontSize: '0.8em',
                        color: theme.palette.text.hint
                    }
                }
            }
        }
    }
}))

export const TopicCard = ({ image, title, view, count, listPost, background = '#fff' }: Props) => {
    const classes = useStyles()
    const history = useHistory()

    const handleClickNavigation = () => {
        history.push('/posts')
    }

    return (
        <Card
            className={classes.root}
            style={{ background }}
        >
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
                            Lượt xem
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

                <Divider />

                <PostInfo />
                <PostInfo />
                <PostInfo />
            </CardContent>
        </Card>
    )
}
