import { useAppDispatch } from 'app/hooks'
import { MainLayout } from 'components/Layouts'
import { CreateReview } from 'features/communicate/components'
import { DataPostFinal } from 'features/communicate/components/CreatePost/models/create-post'
import { postAction } from 'features/communicate/postSlice'
import { motelActions } from 'features/motels/motelSlice'
import { useEffect } from 'react'

interface Props {

}

export const CreateReviewPage = (props: Props) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(motelActions.getMotel({}))
    }, [])

    const handleCreateReview = (data: Omit<DataPostFinal, 'additional'>) => {
        dispatch(postAction.addPost(data as any))
    }

    return (
        <MainLayout>
            <CreateReview handleCreateReview={handleCreateReview} />
        </MainLayout>
    )
}
