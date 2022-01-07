import { RouteProps, Route, Redirect } from 'react-router-dom'
import { getToken } from 'utils'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSlice'

export const UserRoute = (props: RouteProps) => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (!currentUser && !getToken().accessToken) return <Redirect to="/" />;

    return <Route {...props} />
}
