import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Theme, Paper } from "@material-ui/core"
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
        marginTop: 16,
        marginInline: 'auto',

        '& .MuiTableCell-root': {
            padding: theme.spacing(1, 0.7),
            fontSize: '0.75rem'
        },

        "& .MuiTableCell-head": {
            fontSize: '0.65rem'
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
        <TableContainer className={classes.root} component={Paper}>
            <Table style={{
                minWidth: 560
            }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Giá thuê</TableCell>
                        <TableCell align="center">Trống/Tổng phòng</TableCell>
                        <TableCell align="center">Diện tích</TableCell>
                        <TableCell align="center" style={{ width: 150 }}>Tiện ích</TableCell>
                        <TableCell align="center">Hành động</TableCell>
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
                                <ButtonCustom sizeBtn='small' onClick={() => handleEditClick(row._id)}>Chỉnh sửa</ButtonCustom>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
