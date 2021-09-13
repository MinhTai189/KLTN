import AddEditPage from 'features/motels/pages/AddEditPage'
import { Switch, Route } from 'react-router-dom'
import MotelListPage from './pages/MotelListPage'

const Motel = () => {
    return (
        <Switch>
            <Route path='/admin/motels' exact>
                <MotelListPage />
            </Route>

            <Route path='/admin/motels/edit/:id'>
                <AddEditPage />
            </Route>

            <Route path='/admin/motels/add'>
                <AddEditPage />
            </Route>
        </Switch>
    )
}

export default Motel
