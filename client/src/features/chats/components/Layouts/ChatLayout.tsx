import { Box, makeStyles, Theme } from "@material-ui/core"
import ChatContext from "contexts/ChatContext"
import { ReactElement, useContext } from "react"

interface Props {
    group: ReactElement
    onlineUsers: ReactElement
    nav: ReactElement
    children: ReactElement
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        height: '100vh',
        overflow: 'hidden',

        '& > .top': {
            width: '100%',
            height: 60,
            borderBottom: '1px solid #ccc',
        },

        '& > .body': {
            width: '100%',
            height: 'calc(100vh - 60px)',
            display: 'flex',

            '& .left-sider': {
                width: '20%',
                height: '100%',
                borderRight: '1px solid #ccc',
            },

            '& > .message-container': {
                flex: 1,
                height: '100%',
                transition: '300ms'
            },

            '& .right-sider': {
                width: '15%',
                height: '100%',
                borderLeft: '1px solid #ccc',
                transition: '300ms',

                '&.hidden': {
                    width: 0,
                    transform: 'translateX(100%)',
                }
            }
        }
    }
}))

const ChatLayout = ({ group, onlineUsers, nav, children }: Props) => {
    const classes = useStyles()
    const value = useContext(ChatContext)

    return (
        <Box className={classes.root}>
            <Box className="top">
                {nav}
            </Box>

            <Box className="body">
                <Box className="left-sider">
                    {group}
                </Box>

                <Box className="message-container">
                    {children}
                </Box>

                <Box className={`right-sider ${value.showListOnline ? '' : 'hidden'}`}>
                    {onlineUsers}
                </Box>
            </Box>
        </Box>
    )
}

export default ChatLayout
