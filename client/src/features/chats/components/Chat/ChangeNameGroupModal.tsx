import { TextField } from "@material-ui/core"
import { Modal } from "antd"
import ChatContext from "contexts/ChatContext"
import { useContext, useEffect, useState } from "react"

interface Props {
    open: boolean
    onCancel: (state: boolean) => void
}

const ChangeNameGroupModal = ({ open, onCancel }: Props) => {
    const { activedGroup } = useContext(ChatContext)
    const [input, setInput] = useState('')

    useEffect(() => {
        if (activedGroup) {
            if (activedGroup.members.length > 2)
                setInput(activedGroup.name)
        }
    }, [activedGroup])

    return (
        <Modal
            visible={open}
            onCancel={() => onCancel(false)}
            okText='Hoàn thành'
            cancelText='Hủy'
            title='Đổi tên nhóm'
        >
            <TextField
                label="Tên nhóm"
                fullWidth
                placeholder="Nhập tên nhóm vào đây..."
                variant='outlined'
                value={input}
                onChange={e => setInput(e.target.value)}
            />
        </Modal>
    )
}

export default ChangeNameGroupModal
