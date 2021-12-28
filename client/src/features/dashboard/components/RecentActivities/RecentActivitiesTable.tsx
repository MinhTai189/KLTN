import { Avatar, Box, Table, TableBody, TableCell, TablePagination, TableRow, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { UserTooltip } from "components/Common"
import { RecentActivity } from "models"
import { useState } from "react"
import { Link } from "react-router-dom"
import { calculateCreatedTimeHDMY } from "utils/convert-date/calculateCreatedTime"

interface Props {
    data: RecentActivity[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .avatar': {
            width: 34,
            height: 34,
        },

        '& .content': {
            fontSize: '0.8rem',
        },

        '& .date': {
            fontSize: '0.65rem'
        },
    }
}))

const RecentActivitiesTablee = ({ data }: Props) => {
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
                        .map(activity => (
                            <TableRow hover>
                                <TableCell
                                    style={{
                                        paddingRight: 4
                                    }}
                                >
                                    <UserTooltip data={activity.owner}>
                                        <Link to={`/profile/${activity.owner._id}`}>
                                            <Avatar src={activity.owner.avatarUrl} className='avatar'>
                                                {activity.owner.name[0]}
                                            </Avatar>
                                        </Link>
                                    </UserTooltip>
                                </TableCell>

                                <TableCell align="left">
                                    <Typography className='content'>
                                        {activity.content}
                                    </Typography>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography className="date">
                                        {calculateCreatedTimeHDMY(activity.createdAt)}
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

export default RecentActivitiesTablee
