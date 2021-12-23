import { Box, Button, ButtonGroup, makeStyles, Theme, Typography } from '@material-ui/core'
import { useState } from 'react'
import ListRow from './ListRow'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .btn-control': {
            fontSize: '0.7rem',
            textTransform: 'initial',

            '&.active': {
                background: theme.palette.primary.main,
                color: '#fff'
            }
        },

        '& .list-wrapper': {
            marginTop: theme.spacing(0.5),
            maxHeight: 450,
            overflow: 'auto',
            boxShadow: theme.shadows[3],
            padding: theme.spacing(0.5),

            '&::-webkit-scrollbar': {
                width: 0
            }
        }
    }
}))

export const ListSider = (props: Props) => {
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

            <Box className='list-wrapper'>
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
                <ListRow />
            </Box>
        </Box>
    )
}
