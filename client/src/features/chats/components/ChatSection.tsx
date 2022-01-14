import { Box, IconButton, makeStyles, Theme, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
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
            position: 'relative',

            '& .left-sider': {
                width: 310,
                height: '100%',
                borderRight: '1px solid #ccc',

                [theme.breakpoints.down('md')]: {
                    width: 250
                },

                [theme.breakpoints.down('sm')]: {
                    position: 'absolute',
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    zIndex: 100,
                    background: '#fff'
                },

                '&.show': {
                    [theme.breakpoints.down('sm')]: {
                        display: 'inline-block'
                    },
                }
            },

            '& > .message-container': {
                flex: 1,
                height: '100%',
                transition: '300ms',

                [theme.breakpoints.down('sm')]: {
                    position: 'absolute',
                    inset: 0,
                    background: '#fff'
                }
            },

            '& .right-sider': {
                width: '100%',
                maxWidth: 220,
                height: '100%',
                borderLeft: '1px solid #ccc',
                transition: '300ms',

                [theme.breakpoints.down('lg')]: {
                    position: 'fixed',
                    top: 59,
                    right: 0,
                    height: 'calc(100% - 59px)',
                    borderTop: '1px solid #ccc',
                    background: '#fff',
                },

                '&.hidden': {
                    width: 0,
                    transform: 'translateX(100%)',

                    '& .btn-close': {
                        display: 'none'
                    }
                },

                '& .btn-close': {
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    top: 0,
                    right: '100%',
                    display: 'inline-block',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'hidden',

                    '& .MuiIconButton-root': {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }
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

    const [showListGroup, setShowListGroup] = useState(true)

    useEffect(() => {
        if (listGroup.length > 0) {
            if (groupId) {
                const foundGroup = listGroup.find(group => group._id === groupId)

                foundGroup && setActivedGroup(foundGroup)
            }
        }

        setShowListGroup(!groupId)
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
                    <Box className={`left-sider ${showListGroup ? 'show' : ''}`}>
                        <GroupSection />
                    </Box>

                    <Box className="message-container">
                        <Switch>
                            <Route exact path='/chats'>
                                <Box className={classes.chooseGroup}>
                                    <img src={ChooseGroup} alt='' />

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

                        <span className="btn-close" onClick={() => setShowListOnline(false)}>
                            <IconButton>
                                <Close />
                            </IconButton>
                        </span>
                    </Box>
                </Box>
            </Box>

            <ListMemberModal open={showListMember} />
        </ChatContext.Provider>
    )
}
