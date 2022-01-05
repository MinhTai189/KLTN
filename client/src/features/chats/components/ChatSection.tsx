import { createContext, useState } from "react"
import GroupSection from "./Group/GroupSection"
import ChatLayout from "./Layouts/ChatLayout"
import MessageSection from "./Message/MessageSection"
import Navigation from "./Navigation/Navigation"
import OnlineSection from "./Online/OnlineSection"

interface Props {

}

interface Context {
    showListOnline: boolean
    setShowShowListOnline: (state: boolean) => void
}

export const ChatContext = createContext<Context>({
    showListOnline: true,
    setShowShowListOnline: () => { }
})

export const ChatSection = (props: Props) => {
    const [showListOnline, setShowShowListOnline] = useState(false)

    return (
        <ChatContext.Provider value={{
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
