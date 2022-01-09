import { FileDoneOutlined, HomeOutlined, PieChartOutlined, ReadOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Props {

}

const { Sider } = Layout

export const AdminSider = (props: Props) => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
        >
            <Menu defaultSelectedKeys={[location.pathname.split('/')[2]]} mode="inline" theme='dark'>
                <Menu.Item key='dashboard' icon={<PieChartOutlined />} style={{ marginTop: 0 }}>
                    <Link to='/admin/dashboard'>Thống kê</Link>
                </Menu.Item>

                <Menu.Item key='users' icon={<UserOutlined />}>
                    <Link to='/admin/users'>Tài khoản</Link>
                </Menu.Item>

                <Menu.Item key='motels' icon={<HomeOutlined />}>
                    <Link to='/admin/motels'>Nhà trọ</Link>
                </Menu.Item>

                <Menu.Item key='posts' icon={<ReadOutlined />}>
                    <Link to='/admin/posts'>Bài viết</Link>
                </Menu.Item>

                <Menu.Item key='approves' icon={<FileDoneOutlined />}>
                    <Link to='/admin/approves'>Danh sách duyệt</Link>
                </Menu.Item>

                <Menu.Item key='feedback' icon={<SolutionOutlined />}>
                    <Link to='/admin/feedback'>Góp ý</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}
