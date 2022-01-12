import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { authActions, selectCurrentUser } from "features/auth/authSlice"
import { chatActions } from "features/chats/chatSlice"
import { ToastifyContent } from "features/chats/components"
import { Notify, NotifyNewMessage } from "models"
import { useCallback, useEffect, useRef } from "react"
import { DispatchProp } from "react-redux"
import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { Socket } from 'socket.io-client'
import { getToken, socketClient } from "utils"

interface Props {
    children: any
}

export const GlobalSocket = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const socket = useRef<Socket>()
    const currentUser = useAppSelector(selectCurrentUser)

    const notifyNewMessage = useCallback((notify: NotifyNewMessage) => {
        toast.info(<ToastifyContent notify={notify} />)
        dispatch(chatActions.setTotalUnseen(notify.numMessages))
    }, [])

    const appendNotify = (notify: Notify) => {
        dispatch(authActions.setNotify(notify))
    }

    useEffect(() => {
        if (currentUser) {
            socket.current = socketClient

            socket.current.on(SOCKET_EVENT.connection, () => { })

            socket.current.emit(SOCKET_EVENT.authentication, {
                accessToken: getToken().accessToken
            })

            socket.current.on(SOCKET_EVENT.notification, appendNotify)
        }

        return () => {
            socket.current?.off(SOCKET_EVENT.connection, () => { })
            socket.current?.off(SOCKET_EVENT.notification, appendNotify)
        }
    }, [currentUser, dispatch])

    useEffect(() => {
        if (['admin', 'chats'].includes(location.pathname.split('/')[1]))
            socket.current?.off(SOCKET_EVENT.notifyNewMessage, notifyNewMessage)
        else
            socket.current?.on(SOCKET_EVENT.notifyNewMessage, notifyNewMessage)
    }, [location])

    return (
        <div>
            {children}
        </div>
    )
}
