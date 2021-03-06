import { Avatar, Box, IconButton, Theme, Tooltip, Typography } from '@material-ui/core'
import { Menu, MenuOpen, PersonAdd, Settings } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { DetectClickOutsize } from 'components/Common/DetectClickOutsize'
import { GENERAL_GROUP_ID } from 'constant/constant'
import ChatContext from 'contexts/ChatContext'
import { selectCurrentUser } from 'features/auth/authSlice'
import { User } from 'models'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { changeMeToLastMember, optionAvatar } from '../Group/GroupItem'
import AddMemberModal from './AddMemberModal'
import ChangeNameGroupModal from './ChangeNameGroupModal'
import ListSetting from './ListSetting'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 2),
        background: '#edeef2',
        border: '1px solid #ccc',

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1),
        },

        '& .info': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),

            '& .avatar': {
                width: 50,
                height: 50,
                marginRight: theme.spacing(1),
                flexShrink: 0,
                cursor: 'pointer',
                position: 'relative',

                [theme.breakpoints.down('xs')]: {
                    width: 40,
                    height: 40,
                },

                '&.one .MuiAvatar-root': {
                    width: '100%',
                    height: '100%',
                },

                '&.two .MuiAvatar-root': {
                    width: '65%',
                    height: '65%',
                    position: 'absolute',

                    '&:nth-child(1)': {
                        right: 0,
                        top: 0
                    },

                    '&:nth-child(2)': {
                        left: 0,
                        bottom: 0
                    },
                },

                '&.four': {
                    display: 'flex',
                    flexWrap: 'wrap',

                    '& .MuiAvatar-root': {
                        width: '50%',
                        height: '50%',
                    }
                }
            },

            '& .name': {
                fontSize: '1.3rem',
                lineHeight: 1,
                fontWeight: 500,
                marginBottom: 0,

                [theme.breakpoints.down('xs')]: {
                    fontSize: '1rem'
                }
            },

            '& .member': {
                paddingLeft: theme.spacing(0.5),
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
                cursor: 'pointer',

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.8rem'
                }
            }
        },

        '& .controls': {
            display: 'flex',

            '& .control': {
                '& .setting': {
                    width: 'fit-content',
                    position: 'relative',
                },

                '& .MuiIconButton-root': {
                    [theme.breakpoints.down('xs')]: {
                        width: 30,
                        height: 30,
                    },

                    '& .MuiSvgIcon-root': {
                        [theme.breakpoints.down('xs')]: {
                            fontSize: '1rem',
                        }
                    }
                },
            }
        }
    }
}))

const ChatInfomation = () => {
    const classes = useStyles()
    const { showListOnline, activedGroup, setShowListOnline, setShowListMember } = useContext(ChatContext)
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)

    const history = useHistory()
    const [members, setMembers] = useState<any[]>([])
    const [showListSetting, setShowListSetting] = useState(false)

    const [showChangeNameGroupModal, setShowChangeNameGroupModal] = useState(false)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)

    const amountAvatar = useRef(optionAvatar.get(1))

    useEffect(() => {
        if (currentUser && activedGroup) {
            setMembers(changeMeToLastMember(activedGroup.members, currentUser._id))

            if (activedGroup.members.length > 2 && activedGroup.members.length < 4)
                amountAvatar.current = optionAvatar.get(2)

            if (activedGroup.members.length >= 4)
                amountAvatar.current = optionAvatar.get(4)
        }

        return () => {
            amountAvatar.current = optionAvatar.get(1)
        }
    }, [activedGroup, currentUser])

    if (!activedGroup) return <></>

    return (
        <>
            <Box className={classes.root}>
                <Box className='info' component='span'>
                    <Box
                        className={`avatar ${amountAvatar.current?.class}`}
                        onClick={() => history.push('/chats')}
                    >
                        {members.slice(0, amountAvatar.current?.slice || 1).map(member => (
                            <Avatar key={member._id} src={member.avatarUrl}>
                                U
                            </Avatar>
                        ))}
                    </Box>

                    <span className="detail">
                        <Typography className='name' variant='h5'>
                            {activedGroup.name}
                        </Typography>

                        <Typography className='member' onClick={() => setShowListMember(true)}>
                            {activedGroup.members.length} th??nh vi??n
                        </Typography>
                    </span>
                </Box>

                <ul className='controls'>
                    {activedGroup._id !== GENERAL_GROUP_ID && <li className="control" onClick={() => setShowAddMemberModal(true)}>
                        <Tooltip title='Th??m th??nh vi??n'>
                            <IconButton color="primary">
                                <PersonAdd fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </li>}
                    {activedGroup._id !== GENERAL_GROUP_ID && <li className="control">
                        <Box
                            className='setting'
                            component='span'
                        >
                            <Tooltip title='T??y ch???nh'>
                                <IconButton
                                    color="primary"
                                    onClick={() => setShowListSetting(true)}
                                >
                                    <Settings fontSize='small' />
                                </IconButton>
                            </Tooltip>

                            {showListSetting &&
                                <DetectClickOutsize cb={() => setTimeout(() => setShowListSetting(false), 100)}>
                                    <ListSetting onClickChangeNameGroup={() => setShowChangeNameGroupModal(true)} />
                                </DetectClickOutsize>}
                        </Box>
                    </li>}
                    <li className="control" onClick={() => setShowListOnline(!showListOnline)}>
                        <Tooltip title={showListOnline ? 'Thu g???n' : 'Danh s??ch th??nh vi??n'}>
                            <IconButton color="primary">
                                {showListOnline ? <Menu fontSize='small' />
                                    : <MenuOpen fontSize='small' />
                                }
                            </IconButton>
                        </Tooltip>
                    </li>
                </ul>
            </Box>

            <AddMemberModal
                open={showAddMemberModal}
                onCancel={setShowAddMemberModal}
            />

            <ChangeNameGroupModal
                open={showChangeNameGroupModal}
                onCancel={setShowChangeNameGroupModal}
            />
        </>
    )
}

export default ChatInfomation
