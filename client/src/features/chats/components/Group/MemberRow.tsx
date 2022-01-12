import { Avatar, Box, Button, makeStyles, Theme, Typography } from '@material-ui/core'
import chatApis from 'api/chat'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import ChatContext from 'contexts/ChatContext'
import { selectCurrentUser } from 'features/auth/authSlice'
import { chatActions } from 'features/chats/chatSlice'
import { Owner, User } from 'models'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

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
    const { setShowListMember } = useContext(ChatContext)
    const dispatch = useAppDispatch()

    const currentUser: User = useAppSelector(selectCurrentUser)
    const [disableKickBtn, setDisableKickBtn] = useState(false)

    const { groupId } = useParams<{ groupId: string }>()
    const { _id, name, avatarUrl } = member

    useEffect(() => {
        if (currentUser) {
            setDisableKickBtn(_id === currentUser._id)
        }
    }, [currentUser])

    const handleKickMember = async () => {
        try {
            await chatApis.kickMemberOutGroup(groupId, _id)

            toast.success(`Đã mời ${name} ra khỏi nhóm thành công`)

            setShowListMember(false)
            dispatch(chatActions.refetchChatGroup())
            dispatch(chatActions.resetFilterMessage())
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

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
                onClick={handleKickMember}
            >
                Mời khỏi nhóm
            </Button>}
        </Box>
    )
}

export default MemberRow
