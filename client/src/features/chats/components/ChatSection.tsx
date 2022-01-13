import { Box, makeStyles, Theme, Typography } from "@material-ui/core"
import { useAppSelector } from "app/hooks"
import ChooseGroup from 'assets/images/choose-group.jpg'
import ChatContext from "contexts/ChatContext"
import { ChatGroup } from "models"
import { useEffect, useState } from "react"
import { Route, Switch, useParams } from "react-router-dom"
import { selectListGroupChat } from "../chatSlice"
import GroupSection from "./Group/GroupSection"
import ListMemberModal from "./Group/ListMemberModal"
import MessageSection from "./Message/MessageSection"
import Navigation from "./Navigation/Navigation"
import OnlineSection from "./Online/OnlineSection"

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
                width: 310,
                height: '100%',
                borderRight: '1px solid #ccc',
            },

            '& > .message-container': {
                flex: 1,
                height: '100%',
                transition: '300ms'
            },

            '& .right-sider': {
                width: '100%',
                maxWidth: 220,
                height: '100%',
                borderLeft: '1px solid #ccc',
                transition: '300ms',

                '&.hidden': {
                    width: 0,
                    transform: 'translateX(100%)',
                }
            }
        }
    },
    chooseGroup: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 100,

        '& img': {
            height: 250,
            width: 250,
            borderRadius: '50%'
        },

        '& .text': {
            fontSize: '1.5rem',
            marginTop: theme.spacing(1)
        }
    }
}))

export const ChatSection = () => {
    const classes = useStyles()
    const listGroup = useAppSelector(selectListGroupChat)
    const { groupId } = useParams<{ groupId: string }>()

    const [showListOnline, setShowListOnline] = useState(false)
    const [showListMember, setShowListMember] = useState(false)
    const [activedGroup, setActivedGroup] = useState<ChatGroup | undefined>()

    useEffect(() => {
        if (listGroup.length > 0) {
            if (groupId) {
                const foundGroup = listGroup.find(group => group._id === groupId)

                foundGroup && setActivedGroup(foundGroup)
            }
        }
    }, [listGroup, groupId])

    return (
        <ChatContext.Provider value={{
            activedGroup,
            setActivedGroup,
            showListOnline,
            setShowListOnline,
            setShowListMember
        }}>
            <Box className={classes.root}>
                <Box className="top">
                    <Navigation />
                </Box>

                <Box className="body">
                    <Box className="left-sider">
                        <GroupSection />
                    </Box>

                    <Box className="message-container">
                        <Switch>
                            <Route exact path='/chats'>
                                <Box className={classes.chooseGroup}>
                                    <img src={ChooseGroup} alt='Tìm nhà trọ' />

                                    <Typography className='text' variant='h3'>
                                        Hãy chọn một nhóm để bắt đầu cuộc trò chuyện...
                                    </Typography>
                                </Box>
                            </Route>

                            <Route path='/chats/:groupId'>
                                <MessageSection key={groupId} />
                            </Route>
                        </Switch>
                    </Box>

                    <Box className={`right-sider ${showListOnline ? '' : 'hidden'}`}>
                        <OnlineSection />
                    </Box>
                </Box>
            </Box>

            <ListMemberModal open={showListMember} />
        </ChatContext.Provider>
    )
}
