import { useAppDispatch, useAppSelector } from "app/hooks"
import { chatActions, selectRefetchGroupChat } from "features/chats/chatSlice"
import { ChatSection } from "features/chats/components"
import { useEffect } from "react"

const ChatPage = () => {
    const dispatch = useAppDispatch()
    const refetchChatGroup = useAppSelector(selectRefetchGroupChat)

    useEffect(() => {
        dispatch(chatActions.getChatGroup())
    }, [refetchChatGroup])

    return (
        <ChatSection />
    )
}

export default ChatPage
