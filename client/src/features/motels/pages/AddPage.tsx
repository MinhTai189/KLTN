import axiosClient from "api/axiosClient"
import { Motel, Response } from "models"
import { useState } from "react"
import { toast } from "react-toastify"
import { AddForm } from "../components/AddForm"

const AddPage = () => {
    const [formThumbnail, setFormThumbnail] = useState<any>()
    const [formImages, setFormImages] = useState<any>()

    const handleAddMotel = async (data: Motel) => {
        data = {
            ...data,
            status: data.status === 'yes' ? true : false
        }

        try {
            //upload thumbnail image to server
            if (formThumbnail) {
                formThumbnail.append('folder', `motel/${data.name}`)
                const response: Response<any> = await axiosClient.post('/uploads', formThumbnail, { headers: { "Content-type": "multipart/form-data" } })
                data.thumbnail = response.data
            }

            //upload another images to server
            if (formImages) {
                formImages.append('folder', `motel/${data.name}`)
                const response: Response<any> = await axiosClient.post('/uploads', formImages, { headers: { "Content-type": "multipart/form-data" } })
                data.images = response.data
            }

            console.log(data);
        } catch (err: any) {
            toast.error(err.response.data.message)
        }
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
