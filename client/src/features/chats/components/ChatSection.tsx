import { useAppSelector } from "app/hooks"
import ChatContext from "contexts/ChatContext"
import { ChatGroup } from "models"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { selectListGroupChat } from "../chatSlice"
import GroupSection from "./Group/GroupSection"
import ChatLayout from "./Layouts/ChatLayout"
import MessageSection from "./Message/MessageSection"
import Navigation from "./Navigation/Navigation"
import OnlineSection from "./Online/OnlineSection"

interface Props {

}

export const ChatSection = (props: Props) => {
    const listGroup = useAppSelector(selectListGroupChat)
    const { groupId } = useParams<{ groupId: string }>()

    const [showListOnline, setShowShowListOnline] = useState(false)
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
            setShowShowListOnline
        }}>
            <ChatLayout
                group={<GroupSection />}
                onlineUsers={<OnlineSection />}
                nav={<Navigation />}
            >
                <MessageSection />
            </ChatLayout>
        </ChatContext.Provider>
    )
}
