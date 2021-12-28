import { Avatar, Box, Table, TableBody, TableCell, TablePagination, TableRow, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { UserTooltip } from "components/Common"
import { Motel } from "models"
import { useState } from "react"
import { Link } from "react-router-dom"
import { calculateCreatedTimeHDMY } from "utils/convert-date/calculateCreatedTime"

interface Props {
    data: Motel[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .avatar': {
            width: 34,
            height: 34,
        },

        '& .motel': {
            fontSize: '0.8rem',
        },

        '& .date': {
            fontSize: '0.65rem'
        }
    }
}))

const RecentMotelTable = ({ data }: Props) => {
    const classes = useStyles()
    const [currentPage, setCurrentPage] = useState(0)
    const ROW_PER_PAGE = 5

    const handleChangePage = (e: any, page: number) => {
        setCurrentPage(page)
    }

    return (
        <Box className={classes.root}>
            <Table size='small'>
                <TableBody>
                    {data.slice(currentPage * ROW_PER_PAGE, currentPage * ROW_PER_PAGE + ROW_PER_PAGE)
                        .map(motel => (
                            <TableRow hover>
                                <TableCell
                                    style={{
                                        paddingRight: 4
                                    }}
                                >
                                    <UserTooltip data={motel.owner!}>
                                        <Link to={`/profile/${motel.owner?._id!}`}>
                                            <Avatar src={motel.owner?.avatarUrl} className='avatar'>
                                                {motel.owner?.name[0]}
                                            </Avatar>
                                        </Link>
                                    </UserTooltip>
                                </TableCell>

                                <TableCell align="left">
                                    <Typography className='motel'>
                                        {motel.name}
                                    </Typography>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography className="date">
                                        {calculateCreatedTimeHDMY(motel.createdAt!)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count !== -1 ? `${count} dòng` : `nhiều hơn ${to}`}`}
                nextIconButtonText='Trang tiếp theo'
                backIconButtonText='Trang trước'
                count={data.length}
                rowsPerPage={ROW_PER_PAGE}
                page={currentPage}
                onPageChange={handleChangePage}
            />
        </Box>
    )
}

export default RecentMotelTable
