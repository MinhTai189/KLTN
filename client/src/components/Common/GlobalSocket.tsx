import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { authActions, selectCurrentUser } from "features/auth/authSlice"
import { chatActions } from "features/chats/chatSlice"
import { ToastifyContent } from "features/chats/components"
import { Notify, NotifyNewMessage } from "models"
import { useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { getToken, socketClient } from "utils"

interface Props {
    children: any
}

export const GlobalSocket = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const currentUser = useAppSelector(selectCurrentUser)

    const notifyNewMessage = useCallback((notify: NotifyNewMessage) => {
        toast.info(<ToastifyContent notify={notify} />)
        dispatch(chatActions.setTotalUnseen(notify.numMessages))
    }, [dispatch])

    const appendNotify = useCallback((notify: Notify) => {
        dispatch(authActions.setNotify(notify))
    }, [dispatch])

    useEffect(() => {
        if (currentUser) {
            socketClient.on(SOCKET_EVENT.connection, () => { })

            socketClient.emit(SOCKET_EVENT.authentication, {
                accessToken: getToken().accessToken
            })

            socketClient.on(SOCKET_EVENT.notification, appendNotify)
        }

        return () => {
            if (currentUser) {
                socketClient?.off(SOCKET_EVENT.connection, () => { })
                socketClient?.off(SOCKET_EVENT.notification, appendNotify)

                socketClient?.emit(SOCKET_EVENT.disconnection)
            }
        }
    }, [currentUser, appendNotify])

    useEffect(() => {
        if (['admin', 'chats'].includes(location.pathname.split('/')[1]))
            socketClient?.off(SOCKET_EVENT.notifyNewMessage, notifyNewMessage)
        else
            socketClient?.on(SOCKET_EVENT.notifyNewMessage, notifyNewMessage)

        return () => {
            socketClient?.off(SOCKET_EVENT.notifyNewMessage, notifyNewMessage)
        }
    }, [location, notifyNewMessage])

    return (
        <div>
            {children}
        </div>
    )
}
