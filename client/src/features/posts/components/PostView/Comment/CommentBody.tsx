import { Box, Theme, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BtnAction } from '../Common/BtnAction'
import { ListTool } from '../Common/ListTool'
import { TotalAction } from '../Common/TotalAction'
import { ModalStaticAction } from '../Post/ModalStaticAction'

interface Props {
    typing: boolean
    handleRely: () => void
    positionAction?: 'left' | 'right'
    sizeAction?: 'small' | 'large'
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    body: {
        background: '#edeef2',
        padding: theme.spacing(2),
        width: '100%',
        borderRadius: 10,
        position: 'relative',

        '& .total-action-wrapper': {
            position: 'absolute',
            bottom: -8,
            padding: theme.spacing(0.2, 0.5),
            background: '#fff',
            borderRadius: 10,
            boxShadow: theme.shadows[3]
        }
    },
    infoCmtContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,

        '& .left': {
            display: 'flex',
            alignItems: 'center',

            '& .author-name': {
                fontSize: '0.85em',
                marginRight: 8,

                '& a': {
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    transition: '300ms',

                    '&:hover': {
                        color: theme.palette.secondary.main
                    }
                }
            },

            '& .author-rank': {
                fontSize: '0.6em',
                marginRight: 8,
                background: '#cecece',
                padding: theme.spacing(0.2, 0.5),
                borderRadius: 5
            },

            '& .timestamp': {
                fontSize: '0.8em',
                color: theme.palette.text.secondary
            }
        }
    },
    content: {
        fontSize: '1em'
    },
    controls: {
        marginTop: 4,

        '& .dot': {
            width: 5,
            height: 5,
            position: 'relative',
            marginInline: 8,

            '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 5,
                height: 5,
                background: '#f1f1f1',
                borderRadius: 50
            }
        },

        '& .MuiButton-root': {
            padding: theme.spacing(0.2, 0),
            minWidth: 40,

            '& .MuiButton-label': {
                textTransform: 'capitalize',
                color: theme.palette.text.primary,
                fontWeight: 400,
                fontSize: '0.8em'
            }
        }
    }
}))

export const CommentBody = ({ typing, handleRely, positionAction = 'right', sizeAction = 'large' }: Props) => {
    const classes = useStyles()
    const [showModalStatic, setShowModalStatic] = useState(false)

    const handleClickRely = () => {
        handleRely()
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.body}>
                <Box className={classes.infoCmtContainer}>
                    <Box className="left">
                        <Typography
                            variant='h6'
                            className='author-name'
                        >
                            <Link to='/'>
                                Trần Minh Tài
                            </Link>
                        </Typography>

                        <Typography className='author-rank'>
                            Admin
                        </Typography>

                        <Typography
                            component='small'
                            className='timestamp'
                        >
                            5 giờ trước
                        </Typography>
                    </Box>

                    <ListTool />
                </Box>

                <Typography className={classes.content}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor quidem exercitationem molestias facilis sed commodi, sapiente illum laudantium natus, explicabo eos, pariatur enim fugit? Obcaecati consequuntur consectetur nemo eveniet incidunt.
                </Typography>

                <Box
                    className='total-action-wrapper'
                    onClick={() => setShowModalStatic(true)}
                >
                    <TotalAction size='small' />
                </Box>
            </Box>

            <Box
                className={classes.controls}
                display='flex'
                justifyContent='flex-end'
                alignItems='center'
            >
                <BtnAction
                    positionAction={positionAction}
                    sizeAction={sizeAction}
                />

                <span className='dot'></span>

                <Button
                    size='small'
                    style={{ background: typing ? '#edeef2' : '' }}
                    onClick={() => handleClickRely()}
                >
                    {typing ? 'Hủy' : 'Trả lời'}
                </Button>
            </Box>

            <ModalStaticAction
                open={showModalStatic}
                onCancel={() => { setShowModalStatic(false) }}
            />
        </Box>
    )
}
