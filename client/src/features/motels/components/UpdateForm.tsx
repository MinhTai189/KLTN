import { Button, Modal, Space } from 'antd'
import { useAppSelector } from 'app/hooks'
import { MotelOnly, Room } from 'models'
import { useState } from 'react'
import { UpdateMotelModal } from '.'
import { selectLoadingMotel } from '../motelSlice'
import { UpdateRoomModal } from './UpdateRoomModal'


interface Props {
    showUpdateForm: boolean;
    setShowUpdateForm: (value: any) => void;
    selectedMotelUpdate: MotelOnly;
    selectedRoomUpdate: Array<Room>;
    handleUploadThumbnail: (file: any) => void;
    handleUploadImages: (files: any) => void;
    handleUpdateMotel: (data: MotelOnly) => void;
    handleUpdateRoom: (data: Room) => void
}

interface ChangeRoom {
    current: number;
    end: boolean;
    start: boolean;
    data: Room;
}


export const UpdateForm = ({ showUpdateForm, setShowUpdateForm, selectedMotelUpdate, handleUpdateMotel, handleUploadThumbnail, handleUploadImages, selectedRoomUpdate, handleUpdateRoom }: Props) => {
    const [clickModal, setClickModal] = useState('')
    const [changeRoom, setChangeRoom] = useState<ChangeRoom>({
        current: 0,
        start: true,
        end: selectedRoomUpdate.length > 0,
        data: selectedRoomUpdate[0]
    })

    const [title, setTitle] = useState('Chọn một dữ liệu muốn chỉnh sửa')
    const loading = useAppSelector(selectLoadingMotel)

    const nextRoomUpdate = () => {
        setChangeRoom((old) => {
            if (old.current < selectedRoomUpdate.length - 1)
                return { ...old, current: old.current + 1, data: selectedRoomUpdate[old.current + 1], start: false }
            return { ...old, end: true }
        })
    }

    const prevRoomUpdate = () => {
        setChangeRoom((old) => {
            if (old.current > 0)
                return { ...old, current: old.current - 1, data: selectedRoomUpdate[old.current - 1], end: false }
            return { ...old, start: true }
        })
    }

    const handleOk = () => {
        setClickModal('')
        setTitle('Chọn một dữ liệu muốn chỉnh sửa')
    }

    const handleCancel = () => {
        setShowUpdateForm(false)
    }

    const onClickSelectUpdate = (select: string) => {
        setClickModal(select)
        select === 'motel' ? setTitle('Chỉnh sửa nhà trọ')
            : setTitle('Chỉnh sửa phòng trọ')
    }

    return (
        <Modal
            title={clickModal === 'room' ? `${title} (${changeRoom.current + 1}/${selectedRoomUpdate.length})` : title}
            visible={showUpdateForm}
            onOk={handleOk}
            okText={clickModal === '' ? 'Chọn' : "Quay lại"}
            cancelText='Hủy'
            onCancel={handleCancel}
            destroyOnClose={true}
            confirmLoading={loading}
        >
            {clickModal === '' && <Space direction='vertical' size='large' style={{ width: '100%' }}>
                <Button size='large' block type='primary' onClick={() => onClickSelectUpdate('motel')}>Chỉnh sửa thông tin nhà trọ</Button>
                <Button size='large' block type='primary' onClick={() => onClickSelectUpdate('room')}>Chỉnh sửa thông tin phòng trọ</Button>
            </Space>}

            {clickModal === 'motel' &&
                <UpdateMotelModal
                    selectedMotelUpdate={selectedMotelUpdate}
                    handleUploadThumbnail={handleUploadThumbnail}
                    handleUploadImages={handleUploadImages}
                    handleUpdateMotel={handleUpdateMotel}
                />
            }

            {clickModal === 'room' &&
                <UpdateRoomModal
                    key={changeRoom.data._id}
                    changeRoom={changeRoom}
                    nextRoomUpdate={nextRoomUpdate}
                    prevRoomUpdate={prevRoomUpdate}
                    handleUpdateRoom={handleUpdateRoom}
                />
            }
        </Modal>
    )
}
