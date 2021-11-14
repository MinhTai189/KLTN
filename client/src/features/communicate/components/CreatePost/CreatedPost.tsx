import { useAppDispatch, useAppSelector } from "app/hooks"
import { selectStatusCreateModal } from "features/communicate/showCreateModalSlice"
import { schoolActions } from "features/school/schoolSlice"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { ModalFindMotel } from "./FindMotel/ModalFindMotel"
import { ModalFindRoommate } from "./FindRommate/ModalFindRoommate"
import { ModalSelectTypePost } from "./ModalSelectTypePost"

export const CreatedPost = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const isOpenSelecteTypePost = useAppSelector(selectStatusCreateModal)

    const [typeModalOpen, setTypeModalOpen] = useState(0)

    useEffect(() => {
        dispatch(schoolActions.getSchool())
    }, [])

    useEffect(() => {
        if (typeModalOpen === 3)
            history.push('/create-post/review')
    }, [typeModalOpen])

    return (
        <>
            <ModalFindMotel open={typeModalOpen === 1} onCancel={() => setTypeModalOpen(0)} />

            <ModalFindRoommate open={typeModalOpen === 2} onCancel={() => setTypeModalOpen(0)} />

            <ModalSelectTypePost
                open={isOpenSelecteTypePost}
                setTypeModalOpen={setTypeModalOpen}
            />
        </>
    )
}
