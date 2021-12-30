import { Box, Button, ButtonGroup, makeStyles, Paper, Theme } from '@material-ui/core'
import { memo, useState } from 'react'
import ListOnline from './ListOnline'
import ListPermission from './ListPermission'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',

        '& .btn-control': {
            fontSize: '0.7rem',
            textTransform: 'initial',

            '&.active': {
                background: theme.palette.primary.main,
                color: '#fff'
            }
        },

        '& .list-wrapper': {
            height: 600,
            overflow: 'auto',
            boxShadow: theme.shadows[3],
            paddingInline: theme.spacing(1),

            '& *::-webkit-scrollbar': {
                width: 0
            }
        }
    }
}))

export const ListSider = memo(() => {
    const classes = useStyles()
    const [listMode, setListMode] = useState('online')

    return (
        <Box className={classes.root}>
            <Box className='controls'>
                <ButtonGroup fullWidth>
                    <Button
                        className={`btn-control ${listMode === 'online' ? 'active' : ''}`}
                        onClick={() => setListMode('online')}
                    >
                        Trực tuyến
                    </Button>

                    <Button
                        className={`btn-control ${listMode === 'permission' ? 'active' : ''}`}
                        onClick={() => setListMode('permission')}
                    >
                        Quản trị
                    </Button>
                </ButtonGroup>
            </Box>

            <Paper className='list-wrapper'>
                {listMode === 'online' ? <ListOnline />
                    : <ListPermission />}
            </Paper>
        </Box>
    )
})
