import { useAppDispatch, useAppSelector } from "app/hooks"
import { authActions, selectCurrentUser } from "features/auth/authSlice"
import { Notify } from "models"
import { useEffect, useRef } from "react"
import { io, Socket } from 'socket.io-client'
import { getToken } from "utils"

interface Props {
    children: any
}

export const GlobalSocket = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const socket = useRef<Socket>()
    const currentUser = useAppSelector(selectCurrentUser)

    useEffect(() => {
        if (currentUser) {
            socket.current = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] })

            socket.current.on('connection', () => { })

            socket.current.emit('auth', {
                accessToken: getToken().accessToken
            })

            socket.current.on('notify', (notify: Notify) => {
                dispatch(authActions.setNotify(notify))
                console.log('notify', notify)
            })
        }
    }, [currentUser])

    return (
        <div>
            {children}
        </div>
    )
}
