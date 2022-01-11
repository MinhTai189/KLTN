import { Box, makeStyles, Theme } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import chatApis from "api/chat"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { chatActions, selectFilterMessageChat, selectListMessageChat, selectPaginationMessageChat } from "features/chats/chatSlice"
import { useEffect, useLayoutEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { socketClient } from 'utils'
import ChatInfomation from "../Chat/ChatInfomation"
import ChatInput from "../Input/ChatInput"
import Message from "./Message"

interface Props {

}

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
            display: 'grid',
            placeItems: 'center',
            position: 'absolute',
            right: 30,
            bottom: 90,
            cursor: 'pointer',
            boxShadow: theme.shadows[2]
        }
    },
}))

const MessageSection = (props: Props) => {
    const classes = useStyles()
    const listMessage = useAppSelector(selectListMessageChat)
    const { groupId } = useParams<{ groupId: string }>()

    const dispatch = useAppDispatch()
    const pagination = useAppSelector(selectPaginationMessageChat)
    const filter = useAppSelector(selectFilterMessageChat)

    const scrollBottomRef = useRef<HTMLDivElement>(null)
    const messageContainerRef = useRef<HTMLElement>(null)
    const messagesRef = useRef<HTMLElement>(null)

    const btnScrollToBottomRef = useRef<HTMLElement>()
    const loadMoreRef = useRef<HTMLElement>()
    const observer = useRef<IntersectionObserver>()

    const countLoading = useRef(1)
    let lastScrollTop = 0

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.addEventListener('scroll', handleShowBtnScrollBottom)
        }

        const appendNewMessage = (newMessage: any) => {
            dispatch(chatActions.appendNewMessage(newMessage))

            handleScrollToBottom()
        }

        console.log(groupId)

        socketClient.emit(SOCKET_EVENT.subscribeGroup, groupId)



        socketClient.on(`${SOCKET_EVENT.newMessage}${groupId}`, appendNewMessage)
        loadMore()

        return () => {
            countLoading.current = 1

            if (messageContainerRef.current) {
                messageContainerRef.current.removeEventListener('scroll', handleShowBtnScrollBottom)
            }

            if (btnScrollToBottomRef.current)
                btnScrollToBottomRef.current.style.display = 'none'

            observer.current && observer.current.disconnect()
            socketClient.emit(SOCKET_EVENT.unsubscribeGroup, {
                groupId
            })
            socketClient.off(`${SOCKET_EVENT.newMessage}${groupId}`, appendNewMessage)
        }
    }, [])

    useLayoutEffect(() => {
        if (messageContainerRef.current)
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }, [listMessage])

    const handleScrollToBottom = () => {
        if (!scrollBottomRef.current)
            return

        scrollBottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
        })
    }

    const handleShowBtnScrollBottom = (e: any) => {
        const st = e.target.scrollTop || 0;
        const height = e.target.clientHeight || 0
        const scrollHeight = e.target.scrollHeight || 0

        if (!btnScrollToBottomRef.current) return

        if (st > lastScrollTop) {
            if (scrollHeight - height - st <= 900)
                btnScrollToBottomRef.current.style.display = 'none'
        } else {
            if (scrollHeight - height - st >= 900)
                btnScrollToBottomRef.current.style.display = 'grid'
        }
        lastScrollTop = st <= 0 ? 0 : st
    }

    const loadMore = () => {
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

                countLoading.current++
            }
        }, options);

        observer.current.observe(loadMoreRef.current)
    }

    return (
        <Box className={classes.root}>
            <ChatInfomation />

            <div ref={messageContainerRef as any} className='message-container'>
                <ul ref={messagesRef as any} className="messages">
                    <li ref={loadMoreRef as any}>
                        <Box className="hidden" />
                    </li>

                    <li style={{ flex: 1 }} />

                    {listMessage.map(message => (
                        <Message key={message._id} message={message} />
                    ))}

                    <li ref={scrollBottomRef as any}>
                        <Box className="hidden" />
                    </li>
                </ul>
            </div>

            <ChatInput />

            {<button ref={btnScrollToBottomRef as any} className='btn-scroll' onClick={handleScrollToBottom}>
                <KeyboardArrowDown />
            </button>}
        </Box>
    )
}

export default MessageSection
