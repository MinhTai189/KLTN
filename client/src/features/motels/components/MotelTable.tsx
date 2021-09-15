import { CheckCircleFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { Button, Popconfirm, Rate, Space, Table, TablePaginationConfig, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MotelDataTable } from 'models'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { roundMark } from 'utils'
import { motelActions, selectDataMotel, selectFilterMotel, selectLoadingMotel, selectPaginationMotel } from '../motelSlice'

interface Props {
    handleRemove: (record: MotelDataTable) => void
}

export const MotelTable = ({ handleRemove }: Props) => {
    const motelData = useAppSelector(selectDataMotel)
    const pagination = useAppSelector(selectPaginationMotel)
    const filter = useAppSelector(selectFilterMotel)

    const loading = useAppSelector(selectLoadingMotel)
    const dispatch = useAppDispatch()
    const history = useHistory()

    const [dataTable, setDataTable] = useState<MotelDataTable[]>([])
    const [paginationTB, setPaginationTB] = useState<TablePaginationConfig>()

    useEffect(() => {
        const newData = motelData.map((motel, index) => {
            const number = index + 1;

            return {
                key: motel._id,
                number,
                name: motel.name,
                address: motel.address,
                status: motel.status,
                // room: motel.room,
                area: `${motel.area.length * motel.area.width}m²`,
                vote: motel.vote,
                mark: roundMark(motel.mark as any),
                price: `${motel.price}vnd`,
            } as MotelDataTable
        })

        setDataTable(newData)

        setPaginationTB({
            current: pagination._page,
            pageSize: pagination._limit,
            total: pagination._totalRows
        })
    }, [pagination, filter])

    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
        }, {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => {
                if (status) return <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
            }
        }, {
            title: 'Số phòng',
            dataIndex: 'room',
            key: 'room',
        }, {
            title: 'Diện tích',
            dataIndex: 'area',
            key: 'area',
        }, {
            title: 'Lượt đánh giá',
            dataIndex: 'vote',
            key: 'vote',
        }, {
            title: 'Đánh giá',
            dataIndex: 'mark',
            key: 'mark',
            render: (mark: number) => (
                <Rate disabled defaultValue={mark} />
            )
        }, {
            title: 'Giá thuê',
            dataIndex: 'price',
            key: 'price',
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

    const handleChangeTable = (pagi: TablePaginationConfig) => {
        dispatch(motelActions.setFilter({
            _limit: pagi.pageSize,
            _page: pagi.current
        }))
    }

    const onClickEditBtn = (record: MotelDataTable) => {
        history.push(`/admin/motels/edit/${record.key}`)
    }

    return (
        <Table
            columns={columns}
            dataSource={dataTable}
            pagination={paginationTB}
            loading={loading}
            onChange={handleChangeTable}
        />
    )
}
