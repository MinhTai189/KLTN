import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core"
import AvatarWithBadge from "components/Common/AvatarWithBadge"
import { Link } from "react-router-dom"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: theme.spacing(1.5),

        '& > a': {
            display: 'flex',
            alignItems: 'center',

            '& .MuiBadge-root': {
                width: 38,
                height: 38,
            },

            '& .avatar': {
                width: 38,
                height: 38,
            },

            '& .info-wrapper': {
                marginLeft: theme.spacing(1),

                '& .name': {
                    fontSize: '0.9rem',
                    lineHeight: 1
                },

                '& .rank': {
                    fontSize: '0.575rem',
                    background: '#edeef2',
                    padding: theme.spacing(0.3, 0.8),
                    borderRadius: 10
                }
            }
        }
    }
}))

const ListRow = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Link to='/'>
                <AvatarWithBadge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    <Avatar className='avatar' alt="user image" >U</Avatar>
                </AvatarWithBadge>

                <Box className="info-wrapper">
                    <Typography className="name" variant='h6'>
                        Trần Minh Tài
                    </Typography>

                    <Typography className='rank' component='span'>
                        Người qua đường
                    </Typography>
                </Box>
            </Link>
        </Box>
    )
}

export default ListRow
