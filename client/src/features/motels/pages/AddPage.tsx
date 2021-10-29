import { useAppDispatch } from "app/hooks"
import { Motel } from "models"
import { useState } from "react"
import { AddForm } from "../components/Forms/AddForm"
import { motelActions } from "../motelSlice"

const AddPage = () => {
    const [formThumbnail, setFormThumbnail] = useState<any>()
    const [formImages, setFormImages] = useState<any>()
    const dispatch = useAppDispatch()

    const handleAddMotel = async (data: Motel) => {
        if (formThumbnail) {
            formThumbnail.append('folder', data.name)
        }

        if (formImages) {
            formImages.append('folder', data.name)
        }

        data = {
            ...data,
            status: data.status === 'yes' ? true : false,
            thumbnail: formThumbnail,
            images: formImages
        }

        dispatch(motelActions.addMotel(data))
    }

    const handleUploadThumbnail = (image: any) => {
        const formData = new FormData()
        formData.append('file', image[0])
        setFormThumbnail(formData)
    }

    const handleUploadImages = (images: any) => {
        const formData = new FormData()
        for (let i = 0; i < images.length; i++) {
            formData.append('file', images[i])
        }
        setFormImages(formData)
    }

    return (
        <AddForm handleAddMotel={handleAddMotel} handleUploadThumbnail={handleUploadThumbnail} handleUploadImages={handleUploadImages} />
    )
}

export default AddPage
