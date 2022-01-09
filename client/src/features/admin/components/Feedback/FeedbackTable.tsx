import { DeleteOutlined } from '@ant-design/icons'
import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Avatar, Button, Popconfirm, Table, Tooltip } from 'antd'
import Column from 'antd/lib/table/Column'
import { UserTooltip } from 'components/Common'
import { Owner } from 'models'

interface Props {
    dataTable: any[]
    loading: boolean
    handleRemoveFeedback: (feedbackId: string) => void
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

const FeedbackTable = ({ dataTable, loading, handleRemoveFeedback }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Table dataSource={dataTable} loading={loading}>
                <Column width={30} title="STT" dataIndex="index" key="index" />

                <Column
                    title="Người góp ý"
                    dataIndex="owner"
                    key="owner"
                    width={130}
                    align='center'
                    render={(data: Owner) => (
                        <UserTooltip data={data}>
                            <Avatar
                                src={data.avatarUrl}
                                size='large'
                            />
                        </UserTooltip>
                    )}
                />

                <Column title="Chủ đề" width={180} dataIndex="category" key="category" />

                <Column title="Nội dung" dataIndex="content" key="content" />

                <Column title="Thời gian" dataIndex="date" key="date" />

                <Column
                    title="Hành động"
                    key="action"
                    align='center'
                    render={(text, record: any) => (
                        <Popconfirm
                            title='Bạn có muốn xóa?'
                            okText='Xóa'
                            cancelText='Hủy'
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleRemoveFeedback(record.key)}
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
