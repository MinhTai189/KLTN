import { Avatar, Box, Chip, TextField, Theme, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import chatApis from 'api/chat'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import ListboxComponent from 'components/Home/Hero/ListboxComponent'
import ChatContext from 'contexts/ChatContext'
import { selectCurrentUser } from 'features/auth/authSlice'
import { chatActions } from 'features/chats/chatSlice'
import { Owner, User } from 'models'
import { ComponentType, HTMLAttributes, useContext, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

interface Props {
    open: boolean
    onCancel: (state: boolean) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    listFriend: {
        display: 'flex',
        alignItems: 'center',

        '& > .avatar': {
            marginRight: theme.spacing(1)
        }
    }
}))

const AddMemberModal = ({ open, onCancel }: Props) => {
    const classes = useStyles()

    const dispatch = useAppDispatch()
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)
    const { activedGroup } = useContext(ChatContext)

    const [selectedMembers, setSelectedMembers] = useState<Owner[]>([])
    const [loading, setLoading] = useState(false)

    const getListFriend = useMemo(() => {
        if (!currentUser?.likes || !activedGroup)
            return []

        return currentUser.likes.filter(
            friend => !activedGroup.members.find(member => member._id === friend._id)
        )
    }, [currentUser, activedGroup])

    const handleSelectMember = (e: any, value: Owner[]) => {
        setSelectedMembers(value)
    }

    const handleAddMember = async () => {
        if (!activedGroup) return

        try {
            let nameMembers = ''
            const convertedMembers = selectedMembers.map((member, index, arr) => {
                nameMembers += `${member.name}${index === arr.length - 1 ? '' : ', '}`

                return member._id
            })

            setLoading(true)

            await chatApis.addChatMember(activedGroup._id, convertedMembers)

            setLoading(false)
            onCancel(false)

            dispatch(chatActions.refetchChatGroup())

            toast.success(`???? th??m ${nameMembers} v??o nh??m th??nh c??ng!`)
        } catch (error: any) {
            setLoading(false)

            toast.error(error.response.data.message)
        }
    }

    return (
        <Modal
            visible={open}
            title='Th??m th??nh vi??n'
            okText='Ho??n th??nh'
            cancelText='H???y'
            afterClose={() => setSelectedMembers([])}
            destroyOnClose
            confirmLoading={loading}
            onOk={handleAddMember}
            onCancel={() => onCancel(false)}

        >
            <Box className='add-member-wrapper'>
                <Autocomplete
                    options={getListFriend}
                    noOptionsText='Kh??ng t??m th???y danh s??ch'
                    multiple
                    value={selectedMembers}
                    onChange={handleSelectMember}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Danh s??ch t??i kho???n" variant="outlined" />}
                    ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
                    renderOption={(option: Owner) => (
                        <Box className={classes.listFriend}>
                            <Avatar src={option.avatarUrl} className='avatar'>U</Avatar>

                            <Typography className='name'>
                                {option.name}
                            </Typography>
                        </Box>
                    )}
                    renderTags={(value: any, getTagProps) =>
                        value.map((option: User, index: number) => (
                            <Chip
                                size='small'
                                avatar={<Avatar src={option.avatarUrl}>U</Avatar>}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                />
            </Box>
        </Modal>
    )
}

export default AddMemberModal
