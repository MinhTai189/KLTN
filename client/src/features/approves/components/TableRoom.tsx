import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiTableCell-head': {
            fontSize: '0.75em'
        },

        '& .MuiTableCell-body': {
            fontSize: '0.8em'
        }
    }
}))

const TableRoom = (props: Props) => {
    const classes = useStyles()

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
                <TableRow>
                    <TableCell>
                        Phòng trọ 1
                    </TableCell>
                    <TableCell align="center">800k/tháng</TableCell>
                    <TableCell align="center">1/12</TableCell>
                    <TableCell align="center">8m x 9m</TableCell>
                    <TableCell align="center">Máy lạnh, Quạt máy,</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default TableRoom
