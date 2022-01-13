import { Box, Button, Checkbox, FormControlLabel, Paper, Theme } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { notifyActions, selectFilterNotify, selectPaginationNotify, selectDataNotify } from "features/notification/notifySlice"
import { ChangeEvent, useEffect, useState } from "react"

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

const Controls = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const notifyFilter = useAppSelector(selectFilterNotify)

    const notifyData = useAppSelector(selectDataNotify)
    const notifyPagination = useAppSelector(selectPaginationNotify)
    const [status, setStatus] = useState({
        read: true,
        unread: true
    })

    useEffect(() => {
        dispatch(notifyActions.setFilter({
            ...notifyFilter,
            _page: 1,
            _read: [status.read, status.unread]
        }))
    }, [status, dispatch])

    const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(prev => ({ ...prev, [e.target.name]: e.target.checked }))
    }

    const handleReadAll = () => {
        dispatch(notifyActions.readAll())
    }

    const handlePagination = (e: any, page: number) => {
        dispatch(notifyActions.setFilter({
            ...notifyFilter,
            _page: page,
        }))
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
                    label={`Đã xem: ${notifyData ? notifyData.read : 0}`}
                />
                <FormControlLabel
                    control={<Checkbox color='primary' checked={status.unread} onChange={handleChecked} name="unread" />}
                    label={`Chưa xem: ${notifyData ? notifyData.unread : 0}`}
                />
            </Box>

            <Box
                className="rows mt"
                display='flex'
                justifyContent='center'
            >
                <Pagination
                    count={Math.ceil(notifyPagination._totalRows / notifyPagination._limit)}
                    page={notifyPagination._page}
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
