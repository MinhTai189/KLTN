import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { AdminSider } from 'features/admin/components'
import ApprovePage from 'features/admin/pages/ApprovePage'
import FeedbackPage from 'features/admin/pages/FeedbackPage'
import MotelPage from 'features/admin/pages/MotelPage'
import PostPage from 'features/admin/pages/PostPage'
import UserPage from 'features/admin/pages/UserPage'
import { Link, Route, Switch } from 'react-router-dom'
import DashboardPage from '../features/admin/pages/DashboardPage'

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
                            <DashboardPage />
                        </Route>

                        <Route path='/admin/users'>
                            <UserPage />
                        </Route>

                        <Route path='/admin/motels'>
                            <MotelPage />
                        </Route>

                        <Route path='/admin/posts'>
                            <PostPage />
                        </Route>

                        <Route path='/admin/approves'>
                            <ApprovePage />
                        </Route>

                        <Route path='/admin/feedback'>
                            <FeedbackPage />
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminPage
