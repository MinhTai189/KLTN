import { useAppDispatch, useAppSelector } from "app/hooks"
import { SOCKET_EVENT } from "constant/constant"
import { authActions, selectCurrentUser } from "features/auth/authSlice"
import { Notify } from "models"
import { useEffect, useRef } from "react"
import { Socket } from 'socket.io-client'
import { getToken, socketClient } from "utils"

interface Props {
    children: any
}

export const GlobalSocket = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const socket = useRef<Socket>()
    const currentUser = useAppSelector(selectCurrentUser)

    useEffect(() => {
        if (currentUser) {
            socket.current = socketClient

            socket.current.on(SOCKET_EVENT.connection, () => { })

            socket.current.emit(SOCKET_EVENT.authentication, {
                accessToken: getToken().accessToken
            })

            socket.current.on(SOCKET_EVENT.notification, (notify: Notify) => {
                dispatch(authActions.setNotify(notify))
            })
        }
    }, [currentUser, dispatch])

    return (
        <div>
            {children}
        </div>
    )
}
