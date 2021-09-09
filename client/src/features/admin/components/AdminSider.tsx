import { Layout, Menu } from 'antd'
import { PieChartOutlined, UserOutlined, HomeOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {

}

const { Sider } = Layout

export const AdminSider = (props: Props) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => setCollapsed(collapsed)}>
            <Menu defaultSelectedKeys={['dashboard']} mode="inline" theme='dark'>
                <Menu.Item key='dashboard' icon={<PieChartOutlined />} style={{ marginTop: 0 }}>
                    <Link to='/admin/dashboard'>Thống kê</Link>
                </Menu.Item>

                <Menu.Item key='users' icon={<UserOutlined />}>
                    <Link to='/admin/users'>Tài khoản</Link>
                </Menu.Item>

                <Menu.Item key='motel' icon={<HomeOutlined />}>
                    <Link to='/admin/motels'>Nhà trọ</Link>
                </Menu.Item>

                <Menu.Item key='browse-list' icon={<FileDoneOutlined />}>
                    <Link to='/admin/browse-list'>Danh sách duyệt</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}
