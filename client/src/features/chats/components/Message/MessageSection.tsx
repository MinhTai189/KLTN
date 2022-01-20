import { Box, makeStyles, Theme } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import chatApis from "api/chat"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { chatActions, selectFilterMessageChat, selectListMessageChat, selectListTypingChat, selectPaginationMessageChat } from "features/chats/chatSlice"
import { AddListOnline, Owner } from "models"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { socketClient } from 'utils'
import ChatInfomation from "../Chat/ChatInfomation"
import ChatInput from "../Input/ChatInput"
import Message from "./Message"
import TypingMessage from "./TypingMessage"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',

        '& .message-container': {
            flex: 1,
            position: 'relative',
            overflow: 'auto',

            '& .messages': {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(1.5),
                padding: theme.spacing(0, 1),

                '& .hidden': {
                    height: 30,
                    width: '100%',
                },
            },
        },

        '& .btn-scroll': {
            display: 'none',
            placeItems: 'center',
            position: 'absolute',
            right: 30,
            bottom: 90,
            cursor: 'pointer',
            boxShadow: theme.shadows[2]
        }
    },
}))

const MessageSection = () => {
    const classes = useStyles()
    const history = useHistory()
    const { groupId } = useParams<{ groupId: string }>()

    const listMessage = useAppSelector(selectListMessageChat)
    const listTyping = useAppSelector(selectListTypingChat)

    const dispatch = useAppDispatch()
    const pagination = useAppSelector(selectPaginationMessageChat)
    const filter = useAppSelector(selectFilterMessageChat)

    const scrollBottomRef = useRef<HTMLDivElement>(null)
    const messageContainerRef = useRef<HTMLElement>(null)
    const messagesRef = useRef<HTMLElement>(null)

    const btnScrollToBottomRef = useRef<HTMLElement>()
    const loadMoreRef = useRef<HTMLElement>()
    const observer = useRef<IntersectionObserver>()

    const lastScrollTop = useRef(0)

    const handleScrollToBottom = () => {
        if (!scrollBottomRef.current)
            return

        scrollBottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
        })
    }

    const handleShowBtnScrollBottom = useCallback((e: any) => {
        const st = e.target.scrollTop || 0;
        const height = e.target.clientHeight || 0
        const scrollHeight = e.target.scrollHeight || 0

        if (!btnScrollToBottomRef.current) return

        if (st > lastScrollTop.current) {
            if (scrollHeight - height - st <= 900)
                btnScrollToBottomRef.current.style.display = 'none'
        } else {
            if (scrollHeight - height - st >= 900)
                btnScrollToBottomRef.current.style.display = 'grid'
        }
        lastScrollTop.current = st <= 0 ? 0 : st
    }, [])

    const loadMore = useCallback(() => {
        if (!messageContainerRef.current || !loadMoreRef.current) return

        let options = {
            root: messageContainerRef.current,
            rootMargin: '0px',
            threshold: 1.0
        }

        observer.current = new IntersectionObserver(entries => {
            if (
                entries[0].isIntersecting &&
                pagination._limit < pagination._totalRows
            ) {
                chatApis.getChatMessage({
                    ...filter,
                    _groupId: groupId,
                    _limit: pagination._limit + listMessage.length
                }).then(res => {
                    const curScrollPos = messageContainerRef.current!.scrollTop;
                    const oldScroll = messageContainerRef.current!.scrollHeight - messageContainerRef.current!.clientHeight;

                    dispatch(chatActions.getChatMessageSucceeded(res))

                    var newScroll = messageContainerRef.current!.scrollHeight - messageContainerRef.current!.clientHeight;
                    messageContainerRef.current!.scrollTop = curScrollPos + (newScroll - oldScroll);
                })
                    .catch(err => {
                        chatActions.getChatMessageFailed(err.response.data.message)
                        toast.error(err.response.data.message)
                    })
            }
        }, options);

        observer.current.observe(loadMoreRef.current)
    }, [dispatch, filter, groupId, listMessage.length, pagination._limit, pagination._totalRows])

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.addEventListener('scroll', handleShowBtnScrollBottom)
        }

        const appendNewMessage = (newMessage: any) => {
            dispatch(chatActions.appendNewMessage(newMessage))

            handleScrollToBottom()
        }

        const appendListOnline = (online: AddListOnline) => {
            dispatch(chatActions.updateListOnlineGroup(online))
        }

        const changeRemovedMessage = ({ messageId }: any) => {
            dispatch(chatActions.changeRemovedMessage(messageId))
        }

        const handleKicked = (id: string) => {
            if (groupId === id) {
                toast.info('Bạn đã bị mời ra khỏi nhóm!')
                history.push('/chats')
            }

            dispatch(chatActions.refetchChatGroup())
        }

        const addUserTyping = (user: Owner) => {
            dispatch(chatActions.appendListTyping(user))
        }

        const removeUserTyping = (user: Owner) => {
            dispatch(chatActions.removeUserListTyping(user))
        }

        socketClient.emit(SOCKET_EVENT.subscribeGroup, groupId)

        // subscribe sockets
        socketClient.on(`${SOCKET_EVENT.newMessage}${groupId}`, appendNewMessage)
        socketClient.on(`${SOCKET_EVENT.removeMessage}${groupId}`, changeRemovedMessage)
        socketClient.on(SOCKET_EVENT.listOnlineInGroup, appendListOnline)
        socketClient.on(SOCKET_EVENT.kickMemberOutGroup, handleKicked)
        socketClient.on(SOCKET_EVENT.someoneTyping, addUserTyping)
        socketClient.on(SOCKET_EVENT.someoneStopTyping, removeUserTyping)

        return () => {

            socketClient.emit(SOCKET_EVENT.unsubscribeGroup, {
                groupId
            })

            // unsubscribe sockets
            socketClient.off(`${SOCKET_EVENT.newMessage}${groupId}`, appendNewMessage)
            socketClient.off(SOCKET_EVENT.listOnlineInGroup, appendListOnline)
            socketClient.off(`${SOCKET_EVENT.removeMessage}${groupId}`, changeRemovedMessage)
            socketClient.off(SOCKET_EVENT.someoneTyping, addUserTyping)
            socketClient.off(SOCKET_EVENT.someoneStopTyping, removeUserTyping)
        }
    }, [dispatch, groupId, handleShowBtnScrollBottom, history])

    useLayoutEffect(() => {
        if (messageContainerRef.current)
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight

        loadMore()

        return () => {
            observer.current && observer.current.disconnect()
        }
    }, [listMessage, loadMore])

    return (
        <Box className={classes.root}>
            <ChatInfomation />

            {listMessage.length === 0 && <Alert severity="info">
                Nhóm vẫn chưa có tin nhắn nào! Hãy soạn một vài tin nhắn để bắt đầu cuộc trò chuyện...
            </Alert>}

            <div ref={messageContainerRef as any} className='message-container'>
                <ul ref={messagesRef as any} className="messages">
                    <li ref={loadMoreRef as any}>
                        <Box className="hidden" />
                    </li>

                    <li style={{ flex: 1 }} />

                    {listMessage.map(message => (
                        <Message key={message._id} message={message} />
                    ))}

                    {listTyping.map(user => (
                        <TypingMessage key={user._id} user={user} />
                    ))}

                    <li ref={scrollBottomRef as any}>
                        <Box className="hidden" />
                    </li>
                </ul>
            </div>

            <ChatInput />

            {
                <button ref={btnScrollToBottomRef as any} className='btn-scroll' onClick={handleScrollToBottom}>
                    <KeyboardArrowDown />
                </button>
            }
        </Box >
    )
}

export default MessageSection
