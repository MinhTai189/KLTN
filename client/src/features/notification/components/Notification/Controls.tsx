import { Box, Button, Checkbox, FormControlLabel, Paper, Theme } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch } from "app/hooks"
import { notifyActions } from "features/notification/notifySlice"
import { ChangeEvent } from "react"

interface Props {
    totalPage: number
    handlePagination: (e: any, page: number) => void
    status: { read: boolean; unread: boolean }
    setStatus: (state: any) => void
    handleChecked: (e: ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'sticky',
        top: 65,
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1.5),
        },

        '& .rows': {
            margin: theme.spacing(1.5, 0),

            [theme.breakpoints.down('sm')]: {
                margin: theme.spacing(0.5, 0),
            },

            '&.mt': {
                marginTop: theme.spacing(6),

                [theme.breakpoints.down('sm')]: {
                    marginTop: theme.spacing(4)
                },

                [theme.breakpoints.down('xs')]: {
                    marginTop: theme.spacing(1),
                }
            }
        },

        '& .cb-group': {
            display: 'flex',
            flexDirection: 'column',

            [theme.breakpoints.down('xs')]: {
                flexDirection: 'row',
            }
        }
    }
}))

const Controls = ({ status, totalPage, setStatus, handlePagination, handleChecked }: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()

    const handleReadAll = () => {
        dispatch(notifyActions.readAll())
    }



    return (
        <Paper className={classes.root}>
            <Box className='rows'>
                <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    style={{
                        textTransform: 'initial'
                    }}
                    onClick={handleReadAll}
                >
                    Đánh dấu xem tất cả
                </Button>
            </Box>

            <Box className='cb-group'>
                <FormControlLabel
                    control={<Checkbox color='primary' checked={status.read} onChange={handleChecked} name="read" />}
                    label="Đã xem: 8"
                />
                <FormControlLabel
                    control={<Checkbox color='primary' checked={status.unread} onChange={handleChecked} name="unread" />}
                    label="Chưa xem: 15"
                />
            </Box>

            <Box
                className="rows mt"
                display='flex'
                justifyContent='center'
            >
                <Pagination
                    count={totalPage}
                    onChange={handlePagination}
                    variant="outlined"
                    shape="rounded"
                    size='small'
                    color='primary'
                />
            </Box>
        </Paper>
    )
}

export default Controls
