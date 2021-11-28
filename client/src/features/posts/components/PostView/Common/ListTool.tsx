import { Box, ListItem, ListItemText, List, makeStyles, Theme, Typography } from "@material-ui/core"
import { MoreHoriz } from "@material-ui/icons"
import { useAppSelector } from "app/hooks"
import { selectCurrentUser } from "features/auth/authSlice"
import { User } from "models"
import { useState } from "react"

interface Props {
    isOwner: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        width: 20,
        height: 20,

        '& .icon': {
            fill: theme.palette.text.secondary,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
        },

        '& .list-tool': {
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            boxShadow: theme.shadows[3],
            width: 135,
            zIndex: 100,
            borderRadius: 5,
            opacity: 0,
            transform: 'scale(0)',
            transition: '200ms',

            '&.active': {
                opacity: 1,
                transform: 'scale(1)',
            },

            '& .MuiTypography-root': {
                fontSize: '1em'
            }
        }
    }
}))

export const ListTool = ({ isOwner }: Props) => {
    const classes = useStyles()
    const currentUser: User = useAppSelector(selectCurrentUser)
    const [showList, setShowList] = useState(false)

    return (
        <Box className={classes.root}>
            <MoreHoriz
                className='icon'
                onClick={() => setShowList(!showList)}
            />

            <List
                className={`list-tool ${showList ? 'active' : ''}`}
                component="ul"
            >
                <ListItem
                    className='tool'
                    button
                    component="li"
                >
                    <ListItemText primary="Báo xấu" />
                </ListItem>

                {currentUser && currentUser.isAdmin && <ListItem
                    className='tool'
                    button
                    component="li"
                >
                    <ListItemText primary="Xóa" />
                </ListItem>}

                {isOwner && <ListItem
                    className='tool'
                    button
                    component="li"
                >
                    <ListItemText primary="Đóng bình luận" />
                </ListItem>}

                {isOwner && <ListItem
                    className='tool'
                    button
                    component="li"
                >
                    <ListItemText primary="Đã hoàn thành" />
                </ListItem>}
            </List>
        </Box>
    )
}
