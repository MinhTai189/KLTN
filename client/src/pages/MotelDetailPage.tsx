import { Box, Grid } from '@material-ui/core'
import { Modal } from 'antd'
import { motelApi } from 'api/motel'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { ModalConfirm } from 'components/Common/ModalConfirm'
import { MainLayout } from 'components/Layouts/MainLayout'
import { AlbumMotel, EditMotelForm, InforMotelDetail } from 'features/motels/components'
import { FindMotelReviewSection } from 'features/motels/components/MotelDetail/FindMotelReviewSection'
import { motelActions, selectFilterMotel, selectLoadingMotel } from 'features/motels/motelSlice'
import { postAction } from 'features/posts/postSlice'
import { RateSection } from 'features/rate/components'
import { EditFormRoom } from 'features/room/components'
import { Editor, Motel, MotelDetail, MotelOnly, OwnerDetail, Rate, Response, Room } from 'models'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface DataMotel {
    album: string[]
    room: Room[]
    motel: MotelDetail | undefined
    editor: Editor[]
    owner: OwnerDetail | undefined
    rate: Rate[]
    motelUpdate: MotelOnly | undefined
}

const MotelDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const [dataMotel, setDataMotel] = useState<DataMotel>({
        album: [],
        motel: undefined,
        motelUpdate: undefined,
        room: [],
        editor: [],
        owner: undefined,
        rate: []
    })

    const loading = useAppSelector(selectLoadingMotel)
    const filter = useAppSelector(selectFilterMotel)
    const dispatch = useAppDispatch()

    const [openMotelModal, setOpenMotelModal] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const [openRoomModal, setOpenRoomModal] = useState(false)
    const [roomSelected, setRoomSelected] = useState<Room>()

    const [dataUpdateMotel, setDataUpdateMotel] = useState<MotelOnly>()
    const [dataUpdateRoom, setDataUpdateRoom] = useState<Room>()

    const [formThumbnail, setFormThumbnail] = useState<FormData>()
    const [formImages, setFormImages] = useState<{ old: string[]; new: FormData | undefined } | undefined>(undefined)

    useEffect(() => {
        //get motel
        motelApi.getMotelById(id)
            .then((res: Response<Motel>) => {
                const { data } = res
                const { editor, owner, createdAt, room, rate, ...motel } = data

                const album: string[] = [(motel.thumbnail as string), ...(motel.images as string[])]

                const motelData = { ...motel, amountRate: rate?.length } as MotelDetail

                const { mark, optional, vote, ...motelUpdate } = motel

                setDataMotel((prev: typeof dataMotel) => {
                    return {
                        ...prev,
                        motel: motelData,
                        motelUpdate,
                        album,
                        room,
                        editor: (editor as Editor[]),
                        owner: { ...owner, createdAt: (createdAt as string) } as OwnerDetail,
                        rate: (rate as Rate[]),
                    }
                })
            })
            .catch((err: any) => console.log('Get Motel failed', err))
    }, [filter, id])

    useEffect(() => {
        if (loading === false) {
            setOpenModalConfirm(false)
            setOpenMotelModal(false)
            setOpenRoomModal(false)
        }
    }, [loading])

    useEffect(() => {
        dispatch(postAction.get({}))
    }, [dispatch])

    const handleCloseModal = () => {
        setOpenMotelModal(false)
        setOpenRoomModal(false)
    }

    const handleSelectRoom = (id: string) => {
        setRoomSelected(old => {
            const result = dataMotel.room.find(room => room._id === id)

            return result
        })
    }

    //update data motel
    const onClickUpdateMotel = (data: MotelOnly) => {
        setDataUpdateMotel({ ...data, invalid: true })

        setOpenModalConfirm(true)
    }

    const handleUpdateMotel = (data: MotelOnly) => {
        //upload thumbnail
        if (formThumbnail) {
            formThumbnail.append('folder', data._id as string)
        }

        //upload images
        if (formImages && formImages.new) {
            formImages.new.append('folder', data._id as string)
        }

        data = {
            ...data,
            status: typeof data.status !== 'boolean' ? data.status === 'yes' ? true : false : data.status,
            thumbnail: formThumbnail ? formThumbnail : data.thumbnail,
            images: formImages ? formImages : data.images
        }

        dispatch(motelActions.updateMotel(data))
    }

    //update data room
    const onClickUpdateRoom = (data: Room) => {
        setDataUpdateRoom({ ...data, invalid: true, motelId: id })

        setOpenModalConfirm(true)
    }

    const handleUpdateRoom = (data: Room) => {
        dispatch(motelActions.updateRoom({ ...data, motelId: id }))
    }

    //handle upload images motel
    const handleUploadThumbnail = (files: any) => {
        const formData = new FormData()
        formData.append('file', files[0])
        setFormThumbnail(formData)
    }

    const handleUploadImages = (files: Array<File | string>) => {
        const filesSplit: { old: string[], new: File[] } = files.reduce((arr: any, file: any) => {
            if (typeof (file) === 'string')
                arr.old.push(file)
            else arr.new.push(file)
            return arr
        }, { old: [], new: [] })
        let isRead = false

        const form = new FormData()

        if (filesSplit.new.length > 0) {
            isRead = true
            filesSplit.new.forEach(file => {
                form.append('files', file)
            })
        }

        setFormImages({ ...filesSplit, new: isRead ? form : undefined })
    }

    //handle confirm modal
    const onOk = () => {
        if (openMotelModal && dataUpdateMotel) {
            handleUpdateMotel(dataUpdateMotel)
        }

        if (openRoomModal && dataUpdateRoom) {
            handleUpdateRoom({ ...dataUpdateRoom, motelId: id })
        }
    }

    const onCancel = () => {
        setOpenModalConfirm(false)
    }
    return (
        <>
            <MainLayout>
                <Box
                    className="container"
                    mt={12}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4}>
                            {dataMotel.album.length > 0 &&
                                <AlbumMotel
                                    images={dataMotel.album}
                                    motelName={dataMotel.motel?.name || ''}
                                />}

                            <FindMotelReviewSection />
                        </Grid>

                        <Grid item xs={12} lg={8}>
                            {dataMotel.motel &&
                                <InforMotelDetail
                                    dataMotel={dataMotel.motel}
                                    room={dataMotel.room}
                                    setOpenMotelModal={setOpenMotelModal}
                                    setOpenRoomModal={setOpenRoomModal}
                                    handleSelectRoom={handleSelectRoom}
                                    editor={dataMotel.editor}
                                    owner={dataMotel.owner}
                                />}
                        </Grid>
                    </Grid>

                    {dataMotel.motel &&
                        <RateSection
                            motelId={dataMotel.motel._id as string}
                            motelName={dataMotel.motel.name}
                            rateList={dataMotel.rate}
                        />
                    }

                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </Box>
            </MainLayout>

            <Modal title='Ch???nh s???a ph??ng tr???' visible={openRoomModal} onCancel={handleCloseModal} footer={null}>
                {roomSelected && <EditFormRoom key={roomSelected._id} updateData={roomSelected} onClickUpdateRoom={onClickUpdateRoom} />}
            </Modal>

            <Modal title='Ch???nh s???a nh?? tr???' visible={openMotelModal} onCancel={handleCloseModal} footer={null}>
                {dataMotel.motelUpdate && <EditMotelForm updateData={dataMotel.motelUpdate} onClickUpdateMotel={onClickUpdateMotel} handleUploadImages={handleUploadImages} handleUploadThumbnail={handleUploadThumbnail} />}
            </Modal>

            <ModalConfirm openModal={openModalConfirm} onCancel={onCancel} onOk={onOk} loading={loading} />
        </>
    )
}

export default MotelDetailPage