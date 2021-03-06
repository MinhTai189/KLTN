import { Avatar, Box, Button, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import ApproveContext from 'contexts/ApproveContext'
import { Owner } from 'models'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { calculateCreatedTimeHDMY } from 'utils/convert-date/calculateCreatedTime'


interface Props {
    children: any
    modalId?: string
    isUpdate?: boolean
    isReview?: boolean
    type: string
    user: Owner
    createdAt: string
    title?: string
    content?: string
    setDataPreviewModal?: (state: any) => void
    onApprove: () => void
    onRefuse: () => void
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
                    background: '#edeef2'
                },

                '&.right-controls': {
                    gap: theme.spacing(1.5)
                }
            },
        },

        '& > .body': {
            padding: theme.spacing(0.1, 1.5),
            marginTop: theme.spacing(1),
            boxShadow: theme.shadows[4]
        }
    }
}))

export const ApproveItem = ({ children, modalId, isUpdate, isReview, type, user, createdAt, title, content, setDataPreviewModal, onApprove, onRefuse }: Props) => {
    const classes = useStyles()
    const valueContext = useContext(ApproveContext)

    const handleOpenModal = () => {
        if (isUpdate) {
            valueContext.setOpenModalApprove({
                ...valueContext.openModalApprove,
                type: 'update',
                id: modalId!
            })
        }
        else if (isReview) {
            setDataPreviewModal?.({
                title: title || '',
                content: content || ''
            })
            valueContext.setOpenModalApprove({
                ...valueContext.openModalApprove,
                type: 'review',
                id: modalId!,
            })
        }
    }

    return (
        <Box className={classes.root}>
            <Box className='top-wrapper'>
                <Box className="left-info">
                    <Link to={`/profile/${user._id}`}>
                        <Avatar
                            className='avatar'
                            src={user.avatarUrl}
                        >
                            {user.name[0]}
                        </Avatar>
                    </Link>

                    <span className="details">
                        <Typography className='name'>
                            <Link to={`/profile/${user._id}`}>
                                {user.name}
                            </Link>
                        </Typography>

                        <span className="rows">
                            <Typography className='date'>
                                {calculateCreatedTimeHDMY(createdAt)}
                            </Typography>

                            <span className="dot" />

                            <Typography className='type'>
                                {type}
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
                            textTransform: 'initial'
                        }}
                        onClick={onRefuse}
                    >
                        X??a
                    </Button>

                    {(isUpdate || isReview) && <Button
                        className='btn btn-remove'
                        color='primary'
                        variant='outlined'
                        size='small'
                        style={{
                            borderColor: '#bb86fc',
                            color: '#bb86fc',
                            textTransform: 'initial'
                        }}
                        onClick={handleOpenModal}
                    >
                        {isReview ? 'Xem tr?????c' : 'So s??nh'}
                    </Button>}

                    <Button
                        className='btn btn-accept'
                        color='primary'
                        variant='contained'
                        size='small'
                        style={{
                            textTransform: 'initial'
                        }}
                        onClick={onApprove}
                    >
                        Duy???t
                    </Button>
                </Box>
            </Box>

            <Paper className='body'>
                {children}
            </Paper>
        </Box>
    )
}
