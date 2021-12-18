import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core'
import { Room } from 'models'
import { changeRoomToTable } from 'utils'

interface Props {
    rooms: Room[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiTableCell-head': {
            fontSize: '0.6rem'
        },

        '& .MuiTableCell-body': {
            fontSize: '0.65rem'
        },

        '& .status': {
            fontSize: '0.65rem !important',
            padding: '1px 6px !important'
        }
    }
}))

const TableRoom = ({ rooms }: Props) => {
    const classes = useStyles()
    const dataTable = changeRoomToTable(rooms)

    return (
        <Table className={classes.root} size='small'>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center">Giá thuê</TableCell>
                    <TableCell align="center">Trống/Tổng phòng</TableCell>
                    <TableCell align="center">Diện tích</TableCell>
                    <TableCell align="center" style={{ maxWidth: 150 }}>Tiện ích</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {dataTable.map((row) => (
                    <TableRow key={row._id}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="center">{row.price}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">{row.area}</TableCell>
                        <TableCell align="left">{row.additional}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TableRoom
