import { Box, makeStyles, Theme, Avatar, Typography } from '@material-ui/core'
import AvatarU from 'assets/images/avatar.png'
import { Link } from 'react-router-dom'

interface Props {

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

export const PostInfo = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Avatar className='avatar' src={AvatarU} />

            <div className="info">
                <Typography className='title'>
                    <Link to='/'>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, iure ea molestias tenetur a laboriosam fugit debitis esse praesentium, architecto obcaecati earum quibusdam atque, cupiditate commodi suscipit illo laborum sit.
                    </Link>
                </Typography>

                <Typography className='bottom'>
                    25/01/2021 &#x22C5;&#xa0;

                    <Link to='/'>
                        Tran Minh Tai
                    </Link>
                </Typography>
            </div>

        </Box>
    )
}
