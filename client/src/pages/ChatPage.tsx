import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { chatActions, selectRefetchGroupChat } from "features/chats/chatSlice"
import { ChatSection } from "features/chats/components"
import { AddLastMessage } from "models"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { socketClient } from "utils"

const ChatPage = () => {
    const dispatch = useAppDispatch()
    const refetchChatGroup = useAppSelector(selectRefetchGroupChat)
    const { groupId } = useParams<{ groupId: string }>()

    useEffect(() => {
        const getNewMessage = (newMessage: AddLastMessage) => {
            if (newMessage.groupId === groupId)
                return

            dispatch(chatActions.changeLastMessageGroup(newMessage))
        }

        socketClient.emit(SOCKET_EVENT.subscribeGroups)

        socketClient.on(SOCKET_EVENT.newMessageGroups, getNewMessage)

        return () => {
            socketClient.emit(SOCKET_EVENT.unsubscribeGroups)
            socketClient.off(SOCKET_EVENT.newMessageGroups, getNewMessage)
        }
    }, [])

    useEffect(() => {
        dispatch(chatActions.getChatGroup())
    }, [refetchChatGroup])

    return (
        <ChatSection />
    )
}

export default ChatPage
