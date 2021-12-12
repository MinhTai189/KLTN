import { Theme, makeStyles, Box, Avatar, Typography, Button, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'


interface Props {
    children: any
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1),

        '& .top-wrapper': {
            display: 'flex',

            '& .left-info': {
                display: 'flex',
                alignItems: 'center',
                flex: 1,

                '& .avatar': {
                    marginRight: theme.spacing(1),
                },

                '& .name a': {
                    fontWeight: 500
                },
            },

            '& .rows': {
                display: 'flex',
                alignItems: 'center',

                '& .date': {
                    fontSize: '0.85em',
                    color: theme.palette.text.secondary
                },

                '& .dot': {
                    width: 5,
                    height: 5,
                    background: '#ccc',
                    borderRadius: '50%',
                    marginInline: 8,
                },

                '& .type': {
                    fontSize: '0.65em',
                    padding: theme.spacing(0.2, 0.7),
                    borderRadius: 10,
                    background: '#ccc'
                }
            },
        },

        '& > .body': {
            padding: theme.spacing(0.1, 1.5),
            marginTop: theme.spacing(1),
            height: 300,
            boxShadow: theme.shadows[4]
        }
    }
}))

export const ApproveItem = ({ children }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className='top-wrapper'>
                <Box className="left-info">
                    <Avatar className='avatar'>A</Avatar>

                    <span className="details">
                        <Typography className='name'>
                            <Link to='/'>
                                Trần Minh Tài
                            </Link>
                        </Typography>

                        <span className="rows">
                            <Typography className='date'>
                                18:30, 16/12/2021
                            </Typography>

                            <span className="dot" />

                            <Typography className='type'>
                                Thêm mới
                            </Typography>
                        </span>
                    </span>
                </Box>

                <Box className='right-controls rows'>
                    <Button
                        className='btn btn-remove'
                        color='primary'
                        variant='outlined'
                        size='small'
                        style={{
                            borderColor: '#ff4d4f',
                            color: '#ff4d4f',
                            marginRight: 16,
                            textTransform: 'initial'
                        }}
                    >
                        Xóa
                    </Button>

                    <Button
                        className='btn btn-accept'
                        color='primary'
                        variant='contained'
                        size='small'
                    >
                        Duyệt
                    </Button>
                </Box>
            </Box>

            <Paper className='body'>
                {children}
            </Paper>
        </Box>
    )
}
