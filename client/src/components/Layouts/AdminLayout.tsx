import { Layout } from 'antd'
import { AdminSider } from 'features/admin/components'
import BrowseList from 'features/browse-list'
import Dashboard from 'features/dashboard'
import Motel from 'features/motels'
import Users from 'features/users'
import { Switch, Route } from 'react-router-dom'

const { Header, Content } = Layout

export const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />

            <Layout>
                <AdminSider />

                <Content style={{ background: '#fff' }}>
                    <Switch>
                        <Route path='/admin/dashboard'>
                            <Dashboard />
                        </Route>

                        <Route path='/admin/users'>
                            <Users />
                        </Route>

                        <Route path='/admin/motels'>
                            <Motel />
                        </Route>

                        <Route path='/admin/browse-list'>
                            <BrowseList />
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
