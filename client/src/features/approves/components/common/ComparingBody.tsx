import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from '@material-ui/core'
import approveApis from 'api/approve'
import { ComparisonMotel, Response, School } from 'models'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Phone, Email, Facebook } from '@material-ui/icons'
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
import TableRoom from '../Motels/TableRoom'
import { Spin } from 'antd'
import { LoadingAdmin } from 'components/Common'

interface Props {
    motelId: string
}

interface TableRow {
    label: string
    old: any
    new: any
    key: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',

        '& *::-webkit-scrollbar': {
            width: 0
        },

        '& > .title': {
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: theme.spacing(2)
        },

        '& .table': {
            margin: 'auto',
            height: 'calc(100% - 40px)',
            overflow: 'auto',

            '& .thumbnail': {
                maxHeight: 400,
                width: '100%',
                objectFit: 'cover'
            },

            '& .list-img': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 10,

                '& > .img': {
                    width: '25%',

                    '& .img': {
                        width: '100%',
                        height: 80,
                        objectFit: 'cover'
                    }
                }
            },

            '& .list-contact': {
                '& .row': {
                    display: 'flex',
                    alignItems: 'center',

                    '&:not(:last-child)': {
                        marginBottom: theme.spacing(1)
                    },

                    '& svg': {
                        width: 20,
                        height: 20,
                        marginRight: theme.spacing(1),
                        fill: theme.palette.text.secondary
                    }
                }
            }
        }
    }
}))

const listContactIcon = {
    phone: <Phone />,
    email: <Email />,
    facebook: <Facebook />,
    zalo: <Zalo />
}

const ComparingBody = ({ motelId }: Props) => {
    const classes = useStyles()

    const [dataTable, setDataTable] = useState<TableRow[]>([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const fetchComparisonMotel = async () => {
            setLoading(true)

            try {
                const response: Response<ComparisonMotel> = await approveApis.getComparisonMotel(motelId)
                const mapData = mapComparisonMotel(response.data)

                setDataTable(mapData)

                setLoading(false)
            } catch (error: any) {
                setLoading(false)
                toast.error(error.response.data.message)
            }
        }

        fetchComparisonMotel()
    }, [motelId])

    if (loading) return <LoadingAdmin size='large' />

    return (
        <Box className={classes.root}>
            <Typography
                className='title'
                variant='h3'
            >
                So sánh dữ liệu thay đổi
            </Typography>

            <Box className='table'>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{
                                width: '10%'
                            }}></TableCell>
                            <TableCell style={{
                                width: '45%'
                            }}>
                                Dữ liệu hiện tại
                            </TableCell>

                            <TableCell style={{
                                width: '45%'
                            }}>
                                Dữ liệu thay đổi
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataTable.map(row => {
                            const oldRow = mapRowTable(row.key, row.old)
                            const newRow = mapRowTable(row.key, row.new)

                            return (
                                <TableRow key={row.key}>
                                    <TableCell>{row.label}</TableCell>

                                    <TableCell>{oldRow}</TableCell>

                                    <TableCell>{newRow}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default ComparingBody

function mapComparisonMotel(data: ComparisonMotel) {
    const listLabel = {
        name: 'Tên nhà trọ',
        address: 'Địa chỉ',
        school: 'Trường học lân cận',
        desc: 'Thông tin mô tả',
        contact: 'Liên hệ',
        phone: 'Điện thoại',
        email: 'Email',
        facebook: 'Facebook',
        zalo: 'Zalo',
        status: 'Trạng thái',
        available: 'Phòng trống',
        thumbnail: 'Ảnh bìa',
        images: 'Ảnh khác',
        room: 'Phòng trọ'
    }

    const listConvertData = {
        school: (school: School[]) => {
            return school.map(x => x.name).join(',')
        },
        status: (status: boolean) => status ? 'Còn phòng' : 'Hết phòng'
    }

    const result: TableRow[] = []


    Object.keys(data.old).forEach(key => {
        // @ts-ignore
        if (!listLabel[key]) return

        // convert data to stable data for table
        // @ts-ignore
        const oldData = listConvertData[key] ? listConvertData[key](data.old[key]) : data.old[key]
        // @ts-ignore
        const newData = listConvertData[key] ? listConvertData[key](data.new[key]) : data.new[key]

        result.push({
            // @ts-ignore
            label: listLabel[key],
            old: oldData ?? null,
            new: newData ?? null,
            key
        })
    })

    return result
}

function mapRowTable(key: string, data: any) {
    if (data === null) return ''

    switch (key) {
        case 'thumbnail':
            return (
                <img className='thumbnail' src={data} alt="motel thumbnail" />
            )
        case 'images':
            return (
                <ul className='list-img'>
                    {data.map((imgUrl: string, idx: string) => (
                        <li key={idx} className="img">
                            <img className='img' src={imgUrl} alt="motel image" />
                        </li>
                    ))}
                </ul>
            )
        case 'contact':
            return (
                <ul className="list-contact">
                    {Object.keys(data).map((key: string) => {
                        if (!data[key]) return null

                        return (
                            <li key={key} className='row'>
                                {/* @ts-ignore */}
                                {listContactIcon[key]}
                                {/* @ts-ignore */}
                                <Typography className='text' component='span'>
                                    {data[key]}
                                </Typography>
                            </li>
                        )
                    })}
                </ul>
            )
        case 'room':
            return (
                <TableRoom rooms={data} />
            )
        default:
            return (
                <Typography className='text' component='span'>
                    {data.toString()}
                </Typography>
            )
    }
}
