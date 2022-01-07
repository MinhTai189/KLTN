import { DeleteOutlined } from '@ant-design/icons'
import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Avatar, Button, Popconfirm, Table, Tooltip, Typography } from 'antd'
import Column from 'antd/lib/table/Column'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1),

        '& .owner-info': {
            display: 'grid',
            placeItems: 'center'
        }
    }
}))

const FeedbackTable = (props: Props) => {
    const classes = useStyles()

    const dataTable = [
        {
            key: '1', index: 1, owner: { avatarUrl: 'https://res.cloudinary.com/dvl0ntexs/image/upload/v1639048070/user-avatar/xsn4o7cizrnetqbha3yc.jpg', name: 'Trần Minh Tài' },
            category: 'Hiệu năng', content: 'e non asperiores explicabo aliquid, temporibus nisi libero. Magni quaerat maxime ad perspiciatis facere eaque deserunt suscipit id corporis!',
            date: '14:20, 16/12/2022'
        },
        {
            key: '2', index: 2, owner: { avatarUrl: 'https://res.cloudinary.com/dvl0ntexs/image/upload/v1639048070/user-avatar/xsn4o7cizrnetqbha3yc.jpg', name: 'Trần Minh Tài' },
            category: 'Hiệu năng', content: 'e non asperiores explicabo aliquid, temporibus nisi libero. Magni quaerat maxime ad perspiciatis facere eaque deserunt suscipit id corporis!',
            date: '14:20, 16/12/2022'
        },
        {
            key: '3', index: 3, owner: { avatarUrl: 'https://res.cloudinary.com/dvl0ntexs/image/upload/v1639048070/user-avatar/xsn4o7cizrnetqbha3yc.jpg', name: 'Trần Minh Tài' },
            category: 'Hiệu năng', content: 'e non asperiores explicabo aliquid, temporibus nisi libero. Magni quaerat maxime ad perspiciatis facere eaque deserunt suscipit id corporis!',
            date: '14:20, 16/12/2022'
        },
        {
            key: '4', index: 4, owner: { avatarUrl: 'https://res.cloudinary.com/dvl0ntexs/image/upload/v1639048070/user-avatar/xsn4o7cizrnetqbha3yc.jpg', name: 'Trần Minh Tài' },
            category: 'Hiệu năng', content: 'e non asperiores explicabo aliquid, temporibus nisi libero. Magni quaerat maxime ad perspiciatis facere eaque deserunt suscipit id corporis!',
            date: '14:20, 16/12/2022'
        },
    ]

    return (
        <Box className={classes.root}>
            <Table dataSource={dataTable}>
                <Column width={30} title="STT" dataIndex="index" key="index" />

                <Column
                    title="Người góp ý"
                    dataIndex="owner"
                    key="owner"
                    width={130}
                    render={data => (
                        <span className='owner-info'>
                            <Avatar
                                src={data.avatarUrl}
                                size='small'
                            />

                            <Typography>
                                {data.name}
                            </Typography>
                        </span>
                    )}
                />

                <Column title="Chủ đề" width={110} dataIndex="category" key="category" />

                <Column title="Nội dung" dataIndex="content" key="content" />

                <Column title="Thời gian" dataIndex="date" key="date" />

                <Column
                    title="Hành động"
                    key="action"
                    render={(text, record) => (
                        <Popconfirm
                            title='Bạn có muốn xóa?'
                            okText='Xóa'
                            cancelText='Hủy'
                            okButtonProps={{ danger: true }}
                        >

                            <Tooltip title='Xóa'>
                                <Button type='primary' danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                />
            </Table>
        </Box>
    )
}

export default FeedbackTable
