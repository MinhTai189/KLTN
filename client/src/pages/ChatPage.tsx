import { useAppDispatch } from "app/hooks"
import { chatActions } from "features/chats/chatSlice"
import { ChatSection } from "features/chats/components"
import { useEffect } from "react"

const ChatPage = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(chatActions.getChatGroup())
    }, [])

    return (
        <ChatSection />
    )
}

export default ChatPage
