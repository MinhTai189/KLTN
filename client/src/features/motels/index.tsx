import AddEditPage from 'features/motels/pages/AddEditPage'
import { Switch, Route } from 'react-router-dom'
import AddPage from './pages/AddPage'
import MotelListPage from './pages/MotelListPage'

const Motel = () => {
    return (
        <Switch>
            <Route path='/admin/motels' exact>
                <MotelListPage />
            </Route>

            {/* <Route path='/admin/motels/edit/:id'>
                <AddEditPage />
            </Route> */}

            <Route path='/admin/motels/add'>
                <AddPage />
            </Route>
        </Switch>
    )
}

export default Motel
