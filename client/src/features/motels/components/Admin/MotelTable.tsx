import { CheckCircleFilled, DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons'
import { Box } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import { Avatar, Button, Popconfirm, Rate, Space, Table, TablePaginationConfig, Tooltip } from 'antd'
import { motelApi } from 'api/motel'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { UserTooltip } from 'components/Common'
import { MotelDataTable, Owner } from 'models'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { roundMark } from 'utils'
import { calculateCreatedTimeHDMY } from 'utils/convert-date/calculateCreatedTime'
import { mapPriceMonth } from 'utils/getPriceMotel'
import { motelActions, selectDataMotel, selectFilterMotel, selectLoadingMotel, selectPaginationMotel } from '../../motelSlice'

interface Props {
    handleRemove: (record: MotelDataTable) => void;
    onClickEditMotel: (record: MotelDataTable) => void
}

interface Optional {
    wifi: string;
    ml: string;
    gac: string;
    nx: string;
    camera: string;
    quat: string;
    tl: string;
    giuong: string;
    gt: string;
    cc: string;
    dcvs: string;
}

const additionalString: Optional = {
    wifi: 'Wifi',
    ml: 'Máy lạnh',
    gac: 'Gác',
    nx: 'Nhà xe',
    camera: 'Camera',
    quat: 'Quạt',
    tl: 'Trên lầu',
    giuong: 'Giường',
    gt: 'Giường tầng',
    cc: 'Chung chủ',
    dcvs: 'Dụng cụ vệ sinh',
};

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

            const roomDataTable = motel.room.map((room, index) => {
                let utilities = ''
                let idx = 0

                Object.entries(room.optional).forEach(([key, value]: any) => {
                    if (!!value) {
                        if (idx !== 0) utilities += ', ';
                        idx++

                        //@ts-ignore
                        utilities += additionalString[key];
                    }
                });

                return {
                    id: room._id,
                    key: index,
                    room: `Phòng ${index + 1}`,
                    price: mapPriceMonth(room.price),
                    empty: room.remain,
                    total: room.total,
                    square: `${room.area.length}m x ${room.area.width}m`,
                    utilities,
                    motelId: motel._id
                }
            })

            return {
                key: motel._id,
                number,
                thumbnail: motel.thumbnail,
                name: motel.name,
                owner: motel.owner,
                available: motel.available,
                address: motel.address,
                status: motel.status,
                amountRoom: motel.room.length,
                vote: motel.vote,
                mark: mark[0] + mark[1],
                room: roomDataTable,
                createdAt: calculateCreatedTimeHDMY(motel.createdAt!)
            } as MotelDataTable
        })

        setDataTable(newData)

        setPaginationTB({
            current: pagination._page,
            pageSize: pagination._limit,
            total: pagination._totalRows
        })
    }, [pagination, filter, motelData])

    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            width: 60
        }, {
            title: 'Ảnh bìa',
            dataIndex: 'thumbnail',
            width: 110,
            align: 'center' as 'center',
            render: (thumbnail: string) => (
                <img style={{
                    width: '100%',
                    objectFit: 'cover'
                }} src={thumbnail} />
            )
        }, {
            title: 'Tên nhà trọ',
            dataIndex: 'name',
            key: 'name',
            width: 200
        }, {
            title: 'Người đăng',
            dataIndex: 'owner',
            key: 'owner',
            align: 'center' as 'center',
            width: 120,
            render: (owner: Owner) => (
                <UserTooltip data={owner}>
                    <Avatar src={owner.avatarUrl} size='large' />
                </UserTooltip>
            )
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
            align: 'center' as 'center',
            render: (status: boolean) => {
                if (status) return <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
                return <Cancel style={{ color: '#ff4d4f', fontSize: 23 }} />
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
        }, {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 165,
        }, {
            title: 'Hành động',
            key: 'action',
            width: 140,
            fixed: 'right' as 'right',
            align: 'center' as 'center',
            render: (text: string, record: any) => (
                <Space size="small">
                    <Tooltip title='Xem chi tiết'>
                        <Button
                            style={{ background: '#bb86fc', borderColor: '#bb86fc' }}
                            type='primary'
                            icon={<EyeOutlined />}
                            onClick={() => history.push(`/motels/${record.key}`)}
                        />
                    </Tooltip>

                    <Tooltip title='Sửa'>
                        <Button type='primary' icon={<EditFilled />} onClick={() => onClickEditBtn(record)} />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn muốn xóa?"
                        placement="leftTop"
                        onConfirm={() => handleRemove(record)}
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

    const roomColumns = [
        {
            title: '',
            dataIndex: 'room',
            key: 'room',
            width: 110,
        },
        {
            title: 'Giá thuê',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Phòng trống',
            dataIndex: 'empty',
            key: 'empty',
            width: 130,
        },
        {
            title: 'Tổng phòng',
            dataIndex: 'total',
            key: 'total',
            width: 130,
        },
        {
            title: 'Diện tích',
            dataIndex: 'square',
            key: 'square',
        },
        {
            title: 'Tiện ích',
            dataIndex: 'utilities',
            key: 'utilities',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center' as 'center',
            render: (text: string, record: any) => (
                <Popconfirm
                    title="Bạn muốn xóa?"
                    placement="leftTop"
                    onConfirm={() => handleRemoveRoom(record)}
                    okText="Xóa"
                    okButtonProps={{ danger: true }}
                    cancelText="Không"
                >
                    <Tooltip title='Xóa'>
                        <Button type="primary" size='small' danger icon={<DeleteFilled />} />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ]

    const handleChangeTable = (pagi: TablePaginationConfig) => {
        dispatch(motelActions.setFilter({
            ...filter,
            _limit: pagi.pageSize,
            _page: pagi.current
        }))
    }

    const onClickEditBtn = (record: MotelDataTable) => {
        onClickEditMotel(record)
    }

    const handleRemoveRoom = async (record: any) => {
        try {
            await motelApi.removeRoom(record.motelId, record.id)

            toast.success('Đã xóa phòng trọ thành công')
            dispatch(motelActions.setFilter({ ...filter }))
        } catch (error: any) {
            toast.success(error.response.data.message)
        }
    }

    return (
        <Table
            columns={columns}
            dataSource={dataTable}
            pagination={paginationTB}
            loading={loading}
            onChange={handleChangeTable}
            scroll={{ x: 1700 }}
            expandable={{
                expandedRowRender: record => (
                    <Table columns={roomColumns} dataSource={record.room} pagination={false} size='small' />
                ),
            }}
        />
    )
}
