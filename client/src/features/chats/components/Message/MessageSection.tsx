import { Box, makeStyles, Theme } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import { useLayoutEffect, useRef, useState } from "react"
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

                '& > .message': {
                    display: 'flex',

                    '&.me': {
                        justifyContent: 'flex-end'
                    }
                }
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
    }
}))

const MessageSection = (props: Props) => {
    const classes = useStyles()

    const scrollBottomRef = useRef<HTMLDivElement>(null)
    const messageContainerRef = useRef<HTMLElement>(null)
    const messagesRef = useRef<HTMLElement>(null)

    const btnScrollToBottomRef = useRef<HTMLElement>()
    const loadMoreRef = useRef<HTMLElement>()
    const observer = useRef<IntersectionObserver>()

    let lastScrollTop = 0

    useLayoutEffect(() => {
        const timeout = window.setTimeout(handleScrollToBottom, 500)

        if (messageContainerRef.current)
            messageContainerRef.current.addEventListener('scroll', handleShowBtnScrollBottom)

        loadMore()

        return () => {
            window.clearTimeout(timeout)
            observer.current && observer.current.disconnect()
        }
    }, [])

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
            console.log(entries)
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

                    {new Array(21).fill(1).map((_, index) => {
                        const isOwner = index % 2 === 0

                        return (
                            <li key={index} className={`message ${isOwner ? 'me' : ''}`}>
                                <Message isOwner={isOwner} gif={index === 0} />
                            </li>
                        )
                    })}

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