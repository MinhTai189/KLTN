import { Switch, Route } from 'react-router-dom'
import AddPage from './AddPage'
import MotelListPage from './MotelListPage'

const MotelPage = () => {
    return (
        <Switch>
            <Route path='/admin/motels' exact>
                <MotelListPage />
            </Route>

            <Route path='/admin/motels/add'>
                <AddPage />
            </Route>
        </Switch>
    )
}

export default MotelPage
