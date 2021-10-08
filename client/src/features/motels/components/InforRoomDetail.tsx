import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { ButtonCustom } from "components/Common/Button";

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderLeft: '2px solid',

        "& .MuiTableCell-head": {
            fontSize: '0.79rem'
        },

        "& .MuiTableCell-root": {
            border: 'none'
        },

        "& .MuiButton-root": {
            borderColor: '#7c7c7c',
            borderWidth: 2,

            "& .MuiButton-label": {
                color: '#7c7c7c'
            }
        }
    }
}))

function createData(name: string, price: string, amount: string, area: string, ultilities: string) {
    return { name, price, amount, area, ultilities };
}

export const InforRoomDetail = (props: Props) => {
    const classes = useStyles()

    const rows = [
        createData('Phòng trọ 1', '850k/tháng', '3/5', '8m²', 'Máy lạnh, Wifi, Nhà xe, Giường'),
        createData('Phòng trọ 2', '850k/tháng', '3/5', '8m²', 'Máy lạnh, Wifi, Nhà xe, Giường, Camera an ninh, Dụng cụ vệ sinh'),
    ];

    return (
        <TableContainer className={classes.root}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Giá thuê</TableCell>
                        <TableCell align="center">Phòng trống/Tổng phòng</TableCell>
                        <TableCell align="center">Diện tích</TableCell>
                        <TableCell align="center" style={{ width: 250 }}>Tiện ích bổ sung</TableCell>
                        <TableCell align="center">Chỉnh sửa phòng trọ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.price}</TableCell>
                            <TableCell align="center">{row.amount}</TableCell>
                            <TableCell align="center">{row.area}</TableCell>
                            <TableCell align="center">{row.ultilities}</TableCell>
                            <TableCell align="center">
                                <ButtonCustom>Chỉnh sửa</ButtonCustom>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}