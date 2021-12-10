import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { AdminSider } from 'features/admin/components'
import ApprovePage from 'features/admin/pages/ApprovePage'
import MotelPage from 'features/admin/pages/MotelPage'
import UserPage from 'features/admin/pages/UserPage'
import Dashboard from 'features/dashboard'
import { Link, Route, Switch } from 'react-router-dom'

const { Header, Content } = Layout

const AdminPage = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    size='small'
                >
                    <Link to='/'>
                        Trang chủ
                    </Link>
                </Button>
            </Header>

            <Layout>
                <AdminSider />

                <Content style={{ background: '#fff' }}>
                    <Switch>
                        <Route path='/admin/dashboard'>
                            <Dashboard />
                        </Route>

                        <Route path='/admin/users'>
                            <UserPage />
                        </Route>

                        <Route path='/admin/motels'>
                            <MotelPage />
                        </Route>

                        <Route path='/admin/approves'>
                            <ApprovePage />
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminPage
