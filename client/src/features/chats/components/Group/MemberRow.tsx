import { Avatar, Box, Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useAppSelector } from 'app/hooks'
import { selectCurrentUser } from 'features/auth/authSlice'
import { Owner, User } from 'models'
import { useEffect, useState } from 'react'

interface Props {
    style: any
    member: Owner
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        '& .info': {
            display: 'flex',
            alignItems: 'center',

            '& .avatar': {
                marginRight: theme.spacing(1)
            }
        }
    }
}))

const MemberRow = ({ style, member }: Props) => {
    const classes = useStyles()
    const currentUser: User = useAppSelector(selectCurrentUser)
    const [disableKickBtn, setDisableKickBtn] = useState(false)

    const { _id, name, avatarUrl } = member

    useEffect(() => {
        if (currentUser) {
            setDisableKickBtn(_id === currentUser._id)
        }
    }, [currentUser])

    return (
        <Box className={classes.root} style={style}>
            <Box className='info' component='span'>
                <Avatar src={avatarUrl} className='avatar'>U</Avatar>

                <Typography className='name'>
                    {name}
                </Typography>
            </Box>

            {currentUser && currentUser.isAdmin && <Button
                style={{
                    color: '#ff4d4f',
                    borderColor: '#ff4d4f',
                    textTransform: 'initial',
                    fontSize: '0.7rem',
                    opacity: disableKickBtn ? 0.6 : 1
                }}
                size='small'
                variant='outlined'
                disabled={disableKickBtn}
            >
                Mời khỏi nhóm
            </Button>}
        </Box>
    )
}

export default MemberRow
