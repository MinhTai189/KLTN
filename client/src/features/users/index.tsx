import { Switch, Route, useRouteMatch } from 'react-router-dom'
import UserListPage from './pages/UserListPage'

const Users = () => {

    return (
        <Switch>
            <Route path='/admin/users'>
                <UserListPage />
            </Route>
        </Switch>
    )
}

export default Users
