import { RouteProps, Route, Redirect } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSlice'

export const AdminRoute = (props: RouteProps) => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (!currentUser?.isAdmin) return <Redirect to="/" />;

    return <Route {...props} />
}
