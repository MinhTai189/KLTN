import { useAppDispatch, useAppSelector } from "app/hooks"
import { createPostModalActions, selectOpenCreatedPostModal } from "features/posts/openCreatePostModalSlice"
import { postAction } from "features/posts/postSlice"
import { selectStatusCreateModal } from "features/posts/showCreateModalSlice"
import { schoolActions } from "features/school/schoolSlice"
import { useEffect } from "react"
import { ModalFindMotel } from "./FindMotel/ModalFindMotel"
import { ModalFindRoommate } from "./FindRommate/ModalFindRoommate"
import { ModalSelectTypePost } from "./ModalSelectTypePost"
import { DataPostFinal } from "./models/create-post"

export const CreatePost = () => {
    const dispatch = useAppDispatch()
    const typeModalOpen = useAppSelector(selectOpenCreatedPostModal)

    const isOpenSelecteTypePost = useAppSelector(selectStatusCreateModal)

    useEffect(() => {
        dispatch(schoolActions.getSchool())
    }, [dispatch])

    const handleSubmitCreatedPost = (data: DataPostFinal) => {
        dispatch(postAction.addPost(data))
    }

    const handleSelectModal = (type: number) => {
        dispatch(createPostModalActions.setShowModal(type))
    }

    return (
        <>
            <ModalFindMotel
                open={typeModalOpen === 1}
                onCancel={() => handleSelectModal(0)}
                handleSubmitCreatedPost={handleSubmitCreatedPost}
            />

            <ModalFindRoommate
                open={typeModalOpen === 2}
                onCancel={() => handleSelectModal(0)}
                handleSubmitCreatedPost={handleSubmitCreatedPost}
            />

            <ModalSelectTypePost
                open={isOpenSelecteTypePost}
                setTypeModalOpen={handleSelectModal}
            />
        </>
    )
}
