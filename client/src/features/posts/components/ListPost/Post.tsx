import { Box, makeStyles, Theme, Typography, Avatar } from '@material-ui/core'
import { Link } from 'react-router-dom'

interface Props {

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

export const Post = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Link to='/posts/6192460b323cc83d776daa43'>
                <Typography
                    variant='h5'
                    className='title'
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus cumque deserunt incidunt numquam beatae praesentium exercitationem accusantium ullam, reprehenderit esse voluptates pariatur nesciunt magnam libero vel magni provident, maiores est.
                </Typography>

                <Box className='content'>
                    <Avatar
                        className='avatar'
                    // src={}
                    >
                        N
                    </Avatar>

                    <Box className='body'>
                        <Box className='author-info'>
                            <Typography
                                variant='h6'
                                className='name'
                            >
                                Tran Minh Tai
                            </Typography>

                            <Typography className='timestamp'>
                                &nbsp;•&nbsp;26 phút
                            </Typography>
                        </Box>

                        <Typography className='text'>
                            Lorem ipsum dolor adipisicing elit. Ea, culpa minus esse dolore, in accusamus natus commodi at neque consequatur rerum illum inventore adipisci omnis quasi sapiente, pariatur officiis maiores?...
                        </Typography>

                        <Box className='tag-wrapper'>
                            <ul className="list-tag">
                                <li className="tag">
                                    <Typography className='text'>
                                        <b>#</b>nam
                                    </Typography>
                                </li>

                                <li className="tag">
                                    <Typography className='text'>
                                        <b>#</b>sachse
                                    </Typography>
                                </li>

                                <li className="tag">
                                    <Typography className='text'>
                                        <b>#</b>nauancungnhau
                                    </Typography>
                                </li>
                            </ul>
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    )
}
