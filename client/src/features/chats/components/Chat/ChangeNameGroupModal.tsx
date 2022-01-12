import { TextField } from "@material-ui/core"
import { Modal } from "antd"
import chatApis from "api/chat"
import { useAppDispatch } from "app/hooks"
import ChatContext from "contexts/ChatContext"
import { chatActions } from "features/chats/chatSlice"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

interface Props {
    open: boolean
    onCancel: (state: boolean) => void
}

const ChangeNameGroupModal = ({ open, onCancel }: Props) => {
    const dispatch = useAppDispatch()

    const { activedGroup } = useContext(ChatContext)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (activedGroup) {
            if (activedGroup.members.length > 2)
                setInput(activedGroup.name)
        }
    }, [activedGroup])

    const handleChangeGroupName = async () => {
        if (!activedGroup) return

        if (input.length > 20) {
            toast.error('Tên nhóm tối đa 20 ký tự!!!')
            return
        }

        try {
            setLoading(true)

            await chatApis.changeChatNameGroup(input.trim(), activedGroup._id)

            toast.success('Đổi tên nhóm thành công!')
            setLoading(false)
            onCancel(false)

            dispatch(chatActions.refetchChatGroup())
        } catch (error: any) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    }

    return (
        <Modal
            visible={open}
            onCancel={() => onCancel(false)}
            okText='Hoàn thành'
            cancelText='Hủy'
            title='Đổi tên nhóm'
            destroyOnClose
            confirmLoading={loading}
            onOk={handleChangeGroupName}
        >
            <TextField
                label="Tên nhóm"
                fullWidth
                placeholder="Nhập tên nhóm vào đây..."
                variant='outlined'
                required
                value={input}
                onChange={e => setInput(e.target.value)}
            />
        </Modal>
    )
}

export default ChangeNameGroupModal
