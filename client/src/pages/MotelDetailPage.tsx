import { Grid } from '@material-ui/core'
import { Modal } from 'antd'
import { motelApi } from 'api/motel'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Header } from 'components/Common'
import { ModalConfirm } from 'components/Common/ModalConfirm'
import { AlbumMotel, EditMotelForm, InforMotelDetail, InforOnwerUp, InforRoomDetail } from 'features/motels/components'
import { motelActions, selectFilterMotel, selectLoadingMotel } from 'features/motels/motelSlice'
import { Slider } from 'features/rate/components'
import { EditFormRoom } from 'features/room/components'
import { Editor, Motel, MotelDetail, MotelOnly, Owner, Rate, Response, Room } from 'models'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

interface OwnerDetail extends Owner {
    createdAt: string
}

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

    const albumRef = useRef<HTMLElement>()
    const infoRef = useRef<HTMLElement>()
    const roomRef = useRef<HTMLElement>()

    useEffect(() => {
        //scroll page event
        window.addEventListener('scroll', () => {
            if (albumRef.current && infoRef.current && roomRef.current) {
                const windY = window.scrollY
                const albTop = albumRef.current.offsetTop
                const infoHeight = infoRef.current.clientHeight
                const roomTop = roomRef.current.offsetTop - 70

                if (windY + 58 >= albTop) {
                    const y = (windY * 1.02) - albTop + 58
                    const isScroll = windY + infoHeight < roomTop

                    if (isScroll)
                        infoRef.current.style.transform = `translateY(${y}px)`
                } else {
                    infoRef.current.style.transform = 'translateY(0)'
                }
            }
        })

        return () => {
            window.removeEventListener('scroll', () => { })
        }
    }, [])

    useEffect(() => {
        //get motel
        motelApi.getMotelById(id)
            .then((res: Response<Motel>) => {
                const { data } = res
                const { editor, owner, createdAt, room, rate, ...motel } = data

                const album: string[] = [(motel.thumbnail as string), ...(motel.images as string[])]

                const motelData = motel as MotelDetail

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
            handleUpdateRoom(dataUpdateRoom)
        }
    }

    const onCancel = () => {
        setOpenModalConfirm(false)
    }
    return (
        <>
            <Header isChangeNav={true} />

            <div className="container">
                <h2
                    style={{
                        width: '100%', textAlign: 'center',
                        textTransform: 'uppercase', margin: '120px 0 48px',
                        fontSize: 25
                    }}>
                    Thông tin chi tiết nhà trọ
                </h2>

                <Grid container spacing={2}>
                    <Grid item md={9}>
                        <div ref={albumRef as any}>
                            {dataMotel.album.length > 0 && <AlbumMotel images={dataMotel.album} />}
                        </div>

                        {dataMotel.motel && <InforMotelDetail dataMotel={dataMotel.motel} />}
                    </Grid>

                    <Grid item md={3}>
                        <div ref={infoRef as any}>
                            {dataMotel.owner && <InforOnwerUp editor={dataMotel.editor} owner={dataMotel.owner} setOpenModal={setOpenMotelModal} />}
                        </div>
                    </Grid>

                    <Grid item md={12}>
                        <div ref={roomRef as any}>
                            <InforRoomDetail room={dataMotel.room} setOpenRoomModal={setOpenRoomModal} handleSelectRoom={handleSelectRoom} />
                        </div>
                    </Grid>
                </Grid>

                <Slider listRate={dataMotel.rate} />
            </div>

            <Modal title='Chỉnh sửa phòng trọ' visible={openRoomModal} onCancel={handleCloseModal} footer={null}>
                {roomSelected && <EditFormRoom key={roomSelected._id} updateData={roomSelected} onClickUpdateRoom={onClickUpdateRoom} />}
            </Modal>

            <Modal title='Chỉnh sửa nhà trọ' visible={openMotelModal} onCancel={handleCloseModal} footer={null}>
                {dataMotel.motelUpdate && <EditMotelForm updateData={dataMotel.motelUpdate} onClickUpdateMotel={onClickUpdateMotel} handleUploadImages={handleUploadImages} handleUploadThumbnail={handleUploadThumbnail} />}
            </Modal>

            <ModalConfirm openModal={openModalConfirm} onCancel={onCancel} onOk={onOk} loading={loading} />
        </>
    )
}

export default MotelDetailPage
