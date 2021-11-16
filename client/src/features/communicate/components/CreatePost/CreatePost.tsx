import { useAppDispatch, useAppSelector } from "app/hooks"
import { postAction } from "features/communicate/postSlice"
import { selectStatusCreateModal } from "features/communicate/showCreateModalSlice"
import { schoolActions } from "features/school/schoolSlice"
import { useEffect, useState } from "react"
import { ModalFindMotel } from "./FindMotel/ModalFindMotel"
import { ModalFindRoommate } from "./FindRommate/ModalFindRoommate"
import { ModalSelectTypePost } from "./ModalSelectTypePost"
import { DataPostFinal } from "./models/create-post"

export const CreatePost = () => {
    const dispatch = useAppDispatch()

    const isOpenSelecteTypePost = useAppSelector(selectStatusCreateModal)
    const [typeModalOpen, setTypeModalOpen] = useState(0)

    useEffect(() => {
        dispatch(schoolActions.getSchool())
    }, [])

    const handleSubmitCreatedPost = (data: DataPostFinal) => {
        dispatch(postAction.addPost(data))
    }

    return (
        <>
            <ModalFindMotel
                open={typeModalOpen === 1}
                onCancel={() => setTypeModalOpen(0)}
                handleSubmitCreatedPost={handleSubmitCreatedPost}
            />

            <ModalFindRoommate
                open={typeModalOpen === 2}
                onCancel={() => setTypeModalOpen(0)}
                handleSubmitCreatedPost={handleSubmitCreatedPost}
            />

            <ModalSelectTypePost
                open={isOpenSelecteTypePost}
                setTypeModalOpen={setTypeModalOpen}
            />
        </>
    )
}
