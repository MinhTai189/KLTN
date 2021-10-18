import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Filter, MotelDataTable, MotelOnly, Room } from "models"
import { useEffect, useState } from "react"
import { MotelTable, Operation, UpdateForm } from "../components"
import { motelActions, selectFilterMotel, selectLoadingMotel, selectMotelSplited } from "../motelSlice"

const MotelListPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterMotel)
    const loading = useAppSelector(selectLoadingMotel)

    const dataMotelSplited = useAppSelector(selectMotelSplited)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [selectedMotelUpdate, setSelectMotelUpdate] = useState<MotelOnly>()

    const [selectedRoomUpdate, setSelectRoomUpdate] = useState<Array<Room>>()
    const [formThumbnail, setFormThumbnail] = useState<FormData>()
    const [formImages, setFormImages] = useState<{ old: string[]; new: FormData | undefined } | undefined>(undefined)

    useEffect(() => {
        dispatch(motelActions.getMotel(filter))
    }, [dispatch, filter])

    const handleSearch = (filter: Filter) => {
        dispatch(motelActions.searchWithDebounce(filter))
    }

    const handleFilter = (e: any, key: string) => {
        let newFilter = {}

        if (key === '_sort') {
            if (e) {
                const [_sort, _order] = e.split('.')

                newFilter = {
                    ...filter,
                    _sort,
                    _order
                }
            } else {
                newFilter = {
                    ...filter,
                    _sort: e,
                    _order: e
                }
            }
        }

        if (key === '_status') {
            newFilter = {
                ...filter,
                [key]: e
            }
        }

        dispatch(motelActions.setFilter(newFilter))
    }

    const handleClearFilter = () => {
        dispatch(motelActions.setFilter({
            _page: 1,
            _limit: 15,
        }))
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
        setShowUpdateForm(false)
    }

    const handleUpdateRoom = (data: Room) => {
        const motelOfRoom = dataMotelSplited.find(item => item.motel.listRoomId.includes(data._id))

        motelOfRoom && dispatch(motelActions.updateRoom({ ...data, motelId: motelOfRoom.motel._id }))
    }

    const handleRemove = (record: MotelDataTable) => {
        dispatch(motelActions.removeMotel(record.key))
    }

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

    const onClickEditMotel = (record: MotelDataTable) => {
        const dataMotelUpdate = dataMotelSplited.find(motel => motel.motel._id === record.key)

        if (dataMotelUpdate) {
            setSelectMotelUpdate(dataMotelUpdate.motel)
            setSelectRoomUpdate({ ...dataMotelUpdate.room, idMotel: dataMotelUpdate.motel._id } as any)
            setShowUpdateForm(true)
        }
    }

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    <Operation
                        handleSearch={handleSearch}
                        handleFilter={handleFilter}
                        handleClearFilter={handleClearFilter}
                    />
                </Box>


                <MotelTable
                    // setUserUpdating={setUserUpdating}
                    onClickEditMotel={onClickEditMotel}
                    handleRemove={handleRemove}
                />
            </Box>

            {selectedMotelUpdate && selectedRoomUpdate && <UpdateForm
                key={selectedMotelUpdate._id}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                selectedMotelUpdate={selectedMotelUpdate}
                selectedRoomUpdate={selectedRoomUpdate}
                handleUploadThumbnail={handleUploadThumbnail}
                handleUploadImages={handleUploadImages}
                handleUpdateMotel={handleUpdateMotel}
                handleUpdateRoom={handleUpdateRoom}
            />}
        </Box>
    )
}

export default MotelListPage
