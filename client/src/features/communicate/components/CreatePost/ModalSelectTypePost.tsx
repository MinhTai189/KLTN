import { Box, makeStyles, Theme, Typography, Button } from '@material-ui/core'
import { Modal } from 'antd'
import { useAppDispatch } from 'app/hooks'
import Motel from 'assets/images/motel.jpg'
import Review from 'assets/images/review.jpg'
import RoomMate from 'assets/images/roommate.jpg'
import { showCreateModalAction } from 'features/communicate/showCreateModalSlice'
import { useHistory } from 'react-router'

interface Props {
    open: boolean
    setTypeModalOpen: (state: number) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        maxWidth: 700,

        '& .body-wrapper': {
            margin: theme.spacing(6, 0, 4),

            '& > .list-option': {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: theme.spacing(3),

                '& .option': {
                    width: 200,
                    height: 200,
                    boxShadow: theme.shadows[4],
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: '100ms',

                    '&:hover': {
                        transform: 'translateY(-5px)'
                    },

                    '& .MuiButton-root': {
                        width: '100%',
                        height: '100%',

                        '& .MuiButton-label': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',

                            '& p': {
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                            }
                        },

                        '&:hover': {
                            background: 'unset'
                        }
                    },
                    '& .icon': {
                        width: '80%'
                    }
                }
            }
        }
    }
}))

export const ModalSelectTypePost = ({ open, setTypeModalOpen }: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const history = useHistory()

    const options = [
        { img: Motel, label: 'Tìm nhà trọ' },
        { img: RoomMate, label: 'Tìm bạn ở ghép' },
        { img: Review, label: ' Đánh giá nhà trọ' },
    ]

    const handleCancel = () => {
        dispatch(showCreateModalAction.close())
    }

    const handleClickSelectPost = (postIndex: number) => {
        dispatch(showCreateModalAction.close())

        setTypeModalOpen(postIndex)
    }

    return (
        <Modal
            className={classes.root}
            visible={open}
            onCancel={handleCancel}
            title='Chọn loại tin mà bạn muốn đăng'
            footer={null}
            width='100%'
        >
            <Box className='body-wrapper'>
                <ul className="list-option">
                    {options.map((option, index) => (
                        <li className='option'>
                            <Button
                                onClick={() => {
                                    handleClickSelectPost(index + 1)
                                    index === 2 && history.push('/create-post/review')
                                }}
                            >
                                <img src={option.img} className="icon" />

                                <Typography className='label'>
                                    {option.label}
                                </Typography>
                            </Button>
                        </li>
                    ))}
                </ul>
            </Box>
        </Modal>
    )
}
