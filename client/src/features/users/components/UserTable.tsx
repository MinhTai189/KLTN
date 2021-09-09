import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, TablePaginationConfig, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Pagination, User, UserDataTable, UserUpdate } from 'models'
import { getUserById } from 'utils'
import { useEffect, useState } from 'react'
import { selectData, selectFilter, selectLoading, selectPagination, userActions } from '../usersSlice'
import { Chip } from '@material-ui/core'
import { Face } from '@material-ui/icons'

interface Props {
    setShowUpdateForm: (value: boolean) => void;
    setUserUpdating: (value: UserUpdate) => void;
    handleRemove: (record: UserDataTable) => void
}

export const UserTable = ({ setShowUpdateForm, setUserUpdating, handleRemove }: Props) => {
    const [dataTable, setDataTable] = useState<UserDataTable[]>([])
    const loading = useAppSelector(selectLoading)
    const pagination: Pagination = useAppSelector(selectPagination)

    const filter = useAppSelector(selectFilter)
    const [paginationTB, setPaginationTB] = useState<TablePaginationConfig>({})
    const dispatch = useAppDispatch()

    const userData: User[] = useAppSelector(selectData)

    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            width: 60
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: {
                showTitle: false,
            },
            render: (email: string) => (
                <Tooltip placement="topLeft" title={email}>
                    {email}
                </Tooltip>
            ),
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Uy tín',
            dataIndex: 'credit',
            key: 'credit',
            width: 90,
        },
        {
            title: 'Quyền',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            width: 110,
            render: (isAdmin: boolean) => {
                if (isAdmin)
                    return <Chip
                        icon={<Face />}
                        label='Admin'
                        color='secondary'
                        size="small"
                    />
            }
        },
        {
            title: 'Tỉnh',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'Quận/Huyện/TP',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'Trường học',
            dataIndex: 'school',
            key: 'school',
            ellipsis: {
                showTitle: false,
            },
            render: (school: string) => (
                <Tooltip placement="topLeft" title={school}>
                    {school}
                </Tooltip>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (text: string, record: any) => (
                <Space size="small">
                    <Tooltip title='Sửa'>
                        <Button type='primary' icon={<EditFilled />} onClick={() => onClickEditBtn(record)} />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn muốn xóa?"
                        placement="leftTop"
                        onConfirm={() => handleRemove(record)}
                        okText="Có"
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

    useEffect(() => {
        const newData = userData.map((user, index) => {
            const number = index + 1;

            return {
                key: user._id,
                number,
                isAdmin: user.isAdmin,
                username: user.username,
                email: user.email,
                name: user.name,
                credit: user.credit,
                province: user.province,
                district: user.district,
                school: user.school
            } as UserDataTable
        })

        setDataTable(newData)

        setPaginationTB({
            current: pagination._page,
            pageSize: pagination._limit,
            total: pagination._totalRows
        })
    }, [pagination, filter])

    const handleChangeTable = (pagi: TablePaginationConfig) => {
        dispatch(userActions.setFilter({
            _limit: pagi.pageSize,
            _page: pagi.current
        }))
    }

    const onClickEditBtn = (record: UserDataTable) => {
        setShowUpdateForm(true)

        const userUpdating = getUserById(record.key, userData)

        setUserUpdating({
            key: userUpdating._id,
            name: userUpdating.name,
            isAdmin: userUpdating.isAdmin ? 'admin' : 'user',
            email: userUpdating.email,
            province: userUpdating.province,
            district: userUpdating.district,
            school: userUpdating.school,
            credit: userUpdating.credit,
        } as UserUpdate)
    }

    return (
        <Table
            dataSource={dataTable}
            columns={columns}
            onChange={handleChangeTable}
            pagination={paginationTB}
            loading={loading}
            scroll={{ x: 1300 }}
        />
    )
}
