import { CheckCircleFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { Button, Popconfirm, Rate, Space, Table, TablePaginationConfig, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MotelDataTable } from 'models'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { roundMark } from 'utils'
import { motelActions, selectDataMotel, selectFilterMotel, selectLoadingMotel, selectPaginationMotel } from '../motelSlice'

interface Props {
    handleRemove: (record: MotelDataTable) => void;
    onClickEditMotel: (record: MotelDataTable) => void
}

export const MotelTable = ({ handleRemove, onClickEditMotel }: Props) => {
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
            const mark: number[] = roundMark(motel.mark as any) || [0, 0]

            return {
                key: motel._id,
                number,
                name: motel.name,
                owner: motel.owner?.name,
                available: motel.available,
                address: motel.address,
                status: motel.status,
                amountRoom: motel.room.length,
                vote: motel.vote,
                mark: mark[0] + mark[1],
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
            width: 60
        }, {
            title: 'Tên nhà trọ',
            dataIndex: 'name',
            key: 'name',
            width: 200
        }, {
            title: 'Người đăng',
            dataIndex: 'owner',
            key: 'owner',
        }, {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 220,
            ellipsis: {
                showTitle: false,
            },
            render: (school: string) => (
                <Tooltip placement="topLeft" title={school}>
                    {school}
                </Tooltip>
            ),
        }, {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => {
                if (status) return <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
            }
        }, {
            title: 'Loại phòng',
            dataIndex: 'amountRoom',
            key: 'amountRoom',
        }, {
            title: 'Phòng trống',
            dataIndex: 'available',
            key: 'available',
        }, {
            title: 'Đánh giá',
            dataIndex: 'vote',
            key: 'vote',
        }, {
            title: 'Số sao',
            dataIndex: 'mark',
            key: 'mark',
            width: 165,
            render: (mark: number) => (
                <Rate disabled defaultValue={mark} />
            )
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
        onClickEditMotel(record)
    }

    return (
        <Table
            columns={columns}
            dataSource={dataTable}
            pagination={paginationTB}
            loading={loading}
            onChange={handleChangeTable}
            scroll={{ x: 1300 }}
        />
    )
}
