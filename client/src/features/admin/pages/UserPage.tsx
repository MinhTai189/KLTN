import { Route, Switch } from 'react-router-dom'
import UserListPage from './UserListPage'

const UserPage = () => {

    return (
        <Switch>
            <Route path='/admin/users'>
                <UserListPage />
            </Route>
        </Switch>
    )
}

export default UserPage
