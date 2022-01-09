import { DeleteFilled, EyeOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, Tooltip, Table, Avatar, TablePaginationConfig } from "antd"
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { postAction, selectFilterPost, selectListDataPost, selectPaginationPost } from 'features/posts/postSlice'
import { useState, useEffect } from 'react'
import { Post, Owner } from 'models'
import { calculateCreatedTimeHDMY } from 'utils/convert-date/calculateCreatedTime'
import { useHistory } from 'react-router-dom'
import { UserTooltip } from 'components/Common'
import postApi from "api/post"
import { toast } from "react-toastify"

interface Props {
    loading: boolean
}

const mapDataTable = (listPost: Post[]) => {
    return listPost.map((post, index) => ({
        key: post._id,
        number: index + 1,
        owner: post.owner,
        title: post.title,
        thread: post.subject.name,
        disabledComment: post.block,
        like: post.totalLikes,
        comment: post.numComments,
        createdAt: calculateCreatedTimeHDMY(post.createdAt),
    }))
}

export const PostTable = ({ loading }: Props) => {
    const history = useHistory()
    const dispatch = useAppDispatch()

    const listPost = useAppSelector(selectListDataPost)
    const pagination = useAppSelector(selectPaginationPost)
    const filter = useAppSelector(selectFilterPost)

    const [dataTable, setDataTable] = useState<any[]>()
    const [paginationTB, setPaginationTB] = useState<TablePaginationConfig>({})


    useEffect(() => {
        setDataTable(mapDataTable(listPost))

        setPaginationTB({
            current: pagination._page,
            pageSize: pagination._limit,
            total: pagination._totalRows
        })
    }, [pagination, listPost])

    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            width: 60
        },
        {
            title: 'Tác giả',
            dataIndex: 'owner',
            key: 'owner',
            width: 80,
            render: (owner: Owner) => (
                <UserTooltip data={owner}>
                    <Avatar src={owner.avatarUrl} size='large' />
                </UserTooltip>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Chủ đề',
            dataIndex: 'thread',
            key: 'thread',
        },
        {
            title: 'Đóng bình luận',
            dataIndex: 'disabledComment',
            key: 'disabledComment',
            align: 'center' as 'center',
            render: (status: boolean) => {
                if (status)
                    return (
                        <span style={{
                            padding: '2px 6px',
                            background: '#ff4d4f',
                            borderRadius: 4,
                            color: '#fff',
                            fontSize: '0.7rem'
                        }}>
                            Đã đóng
                        </span>)
            }
        },
        {
            title: 'Lượt thích',
            dataIndex: 'like',
            key: 'like',
        },
        {
            title: 'Lượt bình luận',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            fixed: 'right' as 'right',
            align: 'center' as 'center',
            render: (text: string, record: any) => (
                <Space size="small">
                    <Tooltip title='Xem chi tiết'>
                        <Button
                            style={{ background: '#bb86fc', borderColor: '#bb86fc' }}
                            type='primary'
                            icon={<EyeOutlined />}
                            onClick={() => history.push(`/posts/${record.key}`)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn muốn xóa?"
                        placement="leftTop"
                        onConfirm={() => handleRemovePost(record.key)}
                        okText="Xóa"
                        okButtonProps={{ danger: true }}
                        cancelText="Không"
                    >
                        <Tooltip title='Xóa'>
                            <Button type="primary" danger icon={<DeleteFilled />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const handleChangeTable = (pagi: TablePaginationConfig) => {
        dispatch(postAction.setFilter({
            ...filter,
            _limit: pagi.pageSize,
            _page: pagi.current
        }))
    }

    const handleRemovePost = async (postId: string) => {
        try {
            await postApi.remove(postId)

            dispatch(postAction.setFilter({ ...filter }))

            toast.success('Xóa dữ liệu thành công!')
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <Table
            columns={columns}
            dataSource={dataTable}
            loading={loading}
            scroll={{ x: 1300 }}
            pagination={paginationTB}
            onChange={handleChangeTable}
        />
    )
}
