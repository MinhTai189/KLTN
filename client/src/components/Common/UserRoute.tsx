import { RouteProps, Route, Redirect } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSlice'

export const UserRoute = (props: RouteProps) => {
    const currentUser = useAppSelector(selectCurrentUser)
    const accessToken = localStorage.getItem('accessToken')

    if (!currentUser && !accessToken) return <Redirect to="/" />;

    return <Route {...props} />
}
