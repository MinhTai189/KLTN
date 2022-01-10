import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Theme } from "@material-ui/core"
import { Edit, ExitToApp } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import chatApis from "api/chat"
import { useAppDispatch } from "app/hooks"
import { chatActions } from "features/chats/chatSlice"
import { useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"

interface Props {
    onClickChangeNameGroup: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'absolute',
        width: 'max-content',
        top: '150%',
        borderRadius: 5,
        right: 0,
        zIndex: 99,
        background: '#fff',
        boxShadow: theme.shadows[3],

        '& .exit': {
            color: '#ff4d4f',

            '& svg': {
                fill: '#ff4d4f'
            },
        }
    }
}))

const ListSetting = ({ onClickChangeNameGroup }: Props) => {
    const classes = useStyles()

    const history = useHistory()
    const { groupId } = useParams<{ groupId: string }>()
    const dispatch = useAppDispatch()


    const handleLeaveGroup = async () => {
        if (!groupId) return

        try {
            await chatApis.leaveChatGroup(groupId)

            history.push('/chats')
            dispatch(chatActions.refetchChatGroup())
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <Box className={classes.root}>
            <List>
                <ListItem button onClick={onClickChangeNameGroup}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>

                    <ListItemText primary='Đổi tên nhóm' />
                </ListItem>

                <Divider />

                <ListItem button className="exit" onClick={handleLeaveGroup}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>

                    <ListItemText primary='Rời nhóm' />
                </ListItem>
            </List>
        </Box>
    )
}

export default ListSetting
