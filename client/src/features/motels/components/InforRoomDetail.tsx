import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { useAppSelector } from "app/hooks";
import { ButtonCustom } from "components/Common/Button";
import { selectCurrentUser } from "features/auth/authSlice";
import { Room } from "models";
import { toast } from "react-toastify";
import { changeRoomToTable } from "utils";

interface Props {
    room: Room[];
    setOpenRoomModal: (state: boolean) => void;
    handleSelectRoom: (id: string) => void
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

export const InforRoomDetail = ({ room, setOpenRoomModal, handleSelectRoom }: Props) => {
    const classes = useStyles()
    const dataTable = changeRoomToTable(room)
    const currentUser = useAppSelector(selectCurrentUser)

    const handleEditClick = (id: string) => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để có thể sử dụng chức năng này!')
            return;
        }

        setOpenRoomModal(true)
        handleSelectRoom(id)
    }

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
                    {dataTable.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.price}</TableCell>
                            <TableCell align="center">{row.status}</TableCell>
                            <TableCell align="center">{row.area}</TableCell>
                            <TableCell align="left">{row.additional}</TableCell>
                            <TableCell align="center">
                                <ButtonCustom onClick={() => handleEditClick(row._id)}>Chỉnh sửa</ButtonCustom>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
