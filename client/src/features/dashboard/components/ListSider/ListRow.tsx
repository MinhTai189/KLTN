import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core"
import { UserTooltip } from "components/Common"
import AvatarWithBadge from "components/Common/AvatarWithBadge"
import { Owner } from "models"
import { Link } from "react-router-dom"

interface Props {
    user: Owner
    isOnline?: boolean
    style: any
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: theme.spacing(2),

        '& > a': {
            display: 'flex',
            alignItems: 'center',

            '& .MuiBadge-root': {
                width: 40,
                height: 40,

                '&.hidden-badge .MuiBadge-dot': {
                    display: 'none'
                }
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

const ListRow = ({ user, isOnline, style }: Props) => {
    const classes = useStyles()

    const { avatarUrl, name, rank } = user

    return (
        <Box className={classes.root} style={style}>
            <Link to={`/profile/${user._id}`}>
                <AvatarWithBadge
                    className={isOnline ? '' : "hidden-badge"}
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    <UserTooltip data={user}>
                        <Avatar src={avatarUrl} className='avatar' alt="user image" >
                            {name[0]}
                        </Avatar>
                    </UserTooltip>
                </AvatarWithBadge>

                <Box className="info-wrapper">
                    <Typography className="name" variant='h6'>
                        {name}
                    </Typography>

                    <Typography className='rank' component='span'>
                        {rank}
                    </Typography>
                </Box>
            </Link>
        </Box>
    )
}

export default ListRow
