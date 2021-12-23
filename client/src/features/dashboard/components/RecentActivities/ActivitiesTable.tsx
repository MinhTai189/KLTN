import { Avatar, Box, Table, TableBody, TableCell, TablePagination, TableRow, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .avatar': {
            width: 34,
            height: 34,
        },

        '& .status': {
            fontSize: '0.65rem',
            background: theme.palette.primary.main,
            padding: theme.spacing(0.4, 1),
            borderRadius: 10,
            color: '#fff'
        },

        '& .date': {
            fontSize: '0.9rem'
        }
    }
}))

const ActivitiesTable = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Table size='small'>
                <TableBody>
                    <TableRow>
                        <TableCell align="center">
                            <Avatar className='avatar'>
                                U
                            </Avatar>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className='status' component='span'>
                                đang hoạt động
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className="date">
                                12:36, 12/12/1212
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">
                            <Avatar className='avatar'>
                                U
                            </Avatar>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className='status' component='span'>
                                đang hoạt động
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className="date">
                                12:36, 12/12/1212
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">
                            <Avatar className='avatar'>
                                U
                            </Avatar>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className='status' component='span'>
                                đang hoạt động
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className="date">
                                12:36, 12/12/1212
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">
                            <Avatar className='avatar'>
                                U
                            </Avatar>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className='status' component='span'>
                                đang hoạt động
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className="date">
                                12:36, 12/12/1212
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">
                            <Avatar className='avatar'>
                                U
                            </Avatar>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className='status' component='span'>
                                đang hoạt động
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography className="date">
                                12:36, 12/12/1212
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`}
                nextIconButtonText='Trang tiếp theo'
                backIconButtonText='Trang trước'
                count={2}
                rowsPerPage={5}
                page={1}
                onPageChange={() => { }}
            />
        </Box>
    )
}

export default ActivitiesTable
