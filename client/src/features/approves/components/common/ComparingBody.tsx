import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from '@material-ui/core'

interface Props {

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
            overflow: 'auto'
        }
    }
}))

const ComparingBody = (props: Props) => {
    const classes = useStyles()

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
                                width: 150
                            }}></TableCell>
                            <TableCell>
                                Dữ liệu hiện tại
                            </TableCell>

                            <TableCell style={{
                                width: '50%'
                            }}>
                                Dữ liệu thay đổi
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {new Array(10).fill(1).map((_, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    Tiêu đề
                                </TableCell>
                                <TableCell>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore voluptatibus mollitia suscipit quia possimus dolore fugit aliquid tempore impedit, quibusdam rerum architecto, cum quae culpa quo, perferendis asperiores est porro.
                                </TableCell>
                                <TableCell>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus nihil mollitia totam temporibus aliquam laudantium eveniet facere. Ea placeat impedit magnam assumenda hic
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default ComparingBody
