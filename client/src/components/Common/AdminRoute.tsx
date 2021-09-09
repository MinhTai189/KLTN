import { RouteProps, Route, Redirect } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSlice'

export const AdminRoute = (props: RouteProps) => {
    const { isAdmin } = useAppSelector(selectCurrentUser)

    if (!isAdmin) return <Redirect to="/" />;

    return <Route {...props} />
}
