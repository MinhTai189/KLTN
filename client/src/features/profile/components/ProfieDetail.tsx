import { Avatar, Box, Button, List, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core'
import { CardGiftcard, CloudUpload, Loyalty, QuestionAnswer, SupervisedUserCircle, VerifiedUser } from '@material-ui/icons'
import { Modal } from 'antd'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Background from 'assets/images/profile-background.jpg'
import { DetectClickOutsize } from 'components/Common/DetectClickOutsize'
import { authActions, selectCurrentUser, selectUpdateUserData } from 'features/auth/authSlice'
import { ProfileUser, Response, UpdateData, User } from 'models'
import { useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { ModalBodyEdit } from './ModalBodyEdit'
import axiosClient from 'api/axiosClient'
import { userApi } from 'api/user'
import { toast } from 'react-toastify'

interface Props {
    user: ProfileUser
    init: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& > .background-container': {
            width: '100%',
            height: '50vh',
            background: `url(${Background}) no-repeat right bottom`,
            backgroundSize: 'cover',
        },

        '& .container-profile': {
            display: 'flex',
            width: '100%',
            maxWidth: 1100,
            padding: theme.spacing(0, 1),
            margin: 'auto',

            '& > .avatar': {
                width: '17vw',
                height: '17vw',
                boxShadow: theme.shadows[10],
                transform: 'translateY(-40%)',
                border: '5px solid #fff'
            },

            '& > .wrapper': {
                marginLeft: theme.spacing(4),
                paddingTop: theme.spacing(2),
                display: 'flex',
                width: '100%',

                '& .detail-info': {
                    flex: 1,

                    '& .name': {
                        fontSize: '2.3rem',
                        fontWeight: 600,
                    },

                    '& .school': {
                        fontSize: '1.05rem',
                        paddingLeft: theme.spacing(0.5),
                        fontWeight: 500,
                    },

                    '& .list-info': {
                        display: 'flex',
                        marginTop: theme.spacing(1),
                        paddingLeft: theme.spacing(0.5),

                        '& .item': {
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: theme.spacing(2),

                            '& .icon': {
                                fill: theme.palette.text.secondary,
                                marginRight: theme.spacing(0.5),
                                width: 16,
                                height: 16,
                            },

                            '& .text': {
                                color: theme.palette.text.secondary,
                                fontSize: '0.825rem',
                                lineHeight: 1
                            },
                        }
                    },
                },

                '& .btn-wrapper': {
                    position: 'relative',
                    width: 32,
                    height: 32,

                    '& .btn-action': {
                        display: 'grid',
                        placeItems: 'center',
                        width: 32,
                        height: 32,
                        background: '#fff',
                        border: '1px solid #aaa',
                        outline: 'none',
                        borderRadius: 100,
                        cursor: 'pointer',
                        transition: '300ms',

                        '&:hover': {
                            background: '#efefef'
                        },

                        '& .dots': {
                            width: 3.5,
                            height: 3.5,
                            background: '#aaa',
                            borderRadius: 100,
                            position: 'relative',

                            '&::after, &::before': {
                                content: '""',
                                position: 'absolute',
                                background: '#aaa',
                                width: 3.5,
                                height: 3.5,
                                borderRadius: 100,
                                top: 0
                            },

                            '&::after': {
                                left: 6,
                            },

                            '&::before': {
                                right: 6,
                            },
                        },
                    },

                    '& .dropdown': {
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        background: '#fff',
                        boxShadow: theme.shadows[3],
                        minWidth: 150,
                        padding: theme.spacing(0.5, 0),
                        fontSize: '0.8rem'
                    }
                }
            }
        }
    }
}))

export const ProfieDetail = ({ user, init }: Props) => {
    const classes = useStyles()
    const { id } = useParams<{ id: string }>()
    const history = useHistory()

    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)
    const updateUserData = useAppSelector(selectUpdateUserData)

    const [showDropdown, setShowDropdown] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const listInfo = [
        { icon: <SupervisedUserCircle className='icon' />, label: user.rank },
        { icon: <CardGiftcard className='icon' />, label: `${user.credit} điểm uy tín` },
        { icon: <CloudUpload className='icon' />, label: `${user.posts} bài đăng` },
        { icon: <Loyalty className='icon' />, label: '12 yêu thích' },
    ]

    const handleSubmitEdit = async (data: UpdateData, avatar: File | undefined) => {
        setLoading(true)

        const { avatarUrl, ...updateData } = data

        try {
            if (avatar) {
                const formAvatar = new FormData()
                formAvatar.append('file', avatar)
                formAvatar.append('folder', 'user-avatar')

                const response: Response<any> = await axiosClient.post('/uploads', formAvatar, { headers: { "Content-type": "multipart/form-data" } })

                //@ts-ignore
                updateData.avatarUrl = response.data
            }

            await userApi.updateUser(updateData, id)

            init()

            const rememberMe = !!localStorage.getItem('accessToken')

            dispatch(authActions.login({ rememberMe, isAutoLogin: true }))

            setLoading(false)
            toast.success('Cập nhật thông tin thành công!')
            setShowModalEdit(false)
        } catch (error: any) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    }

    return (
        <>
            <Box className={classes.root}>
                <div className="background-container" />

                <Box className='container-profile'>
                    <Avatar
                        className='avatar'
                        src={user.avatarUrl!}
                    >
                        U
                    </Avatar>

                    <Box className='wrapper'>
                        <Box className='detail-info'>
                            <Typography
                                className='name'
                                variant='h1'
                            >
                                {user.name}

                                {user.isAdmin && <VerifiedUser
                                    color='primary'
                                    style={{
                                        marginLeft: 4
                                    }}
                                />}
                            </Typography>

                            <Typography className='school'>
                                {user.school.name}
                            </Typography>

                            <ul className="list-info">
                                {listInfo.map((item, index) => (
                                    <li
                                        key={index}
                                        className="item"
                                    >
                                        {item.icon}

                                        <Typography className='text'>
                                            {item.label}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>

                            {currentUser && id !== currentUser?._id && <Box
                                className='btn-group'
                                mt={2}
                            >
                                <Button
                                    size='small'
                                    variant='outlined'
                                    color='primary'
                                    startIcon={<Loyalty />}
                                    style={{
                                        textTransform: 'initial',
                                        marginRight: 16,
                                    }}
                                >
                                    Yêu thích
                                </Button>

                                <Button
                                    size='small'
                                    variant='contained'
                                    color='primary'
                                    startIcon={<QuestionAnswer />}
                                    style={{
                                        textTransform: 'initial'
                                    }}
                                >
                                    Nhắn tin
                                </Button>
                            </Box>}
                        </Box>

                        {id === currentUser?._id && <Box
                            className="btn-wrapper"
                            component='span'
                        >
                            <button
                                className='btn-action'
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <span className="dots" />
                            </button>

                            {showDropdown && <DetectClickOutsize cb={() => setTimeout(() => setShowDropdown(false), 100)}>
                                <List className='dropdown'>
                                    <ListItem
                                        button
                                        onClick={() => setShowModalEdit(true)}
                                    >
                                        <ListItemText>
                                            Chỉnh sửa
                                        </ListItemText>
                                    </ListItem>

                                    <ListItem
                                        button
                                        onClick={() => history.push('/auth/change-password')}
                                    >
                                        <ListItemText>
                                            Đổi mật khẩu
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </DetectClickOutsize>}
                        </Box>}
                    </Box>
                </Box>
            </Box>

            <Modal
                visible={showModalEdit}
                title='Chỉnh sửa thông tin'
                onCancel={() => setShowModalEdit(false)}
                footer={null}
            >
                {updateUserData && <ModalBodyEdit
                    updateUserData={updateUserData}
                    handleSubmitEdit={handleSubmitEdit}
                    loading={loading}
                />}
            </Modal>
        </>
    )
}
