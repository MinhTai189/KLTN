import { useAppDispatch } from 'app/hooks'
import { MainLayout } from 'components/Layouts'
import { DataPostFinal } from 'features/posts/components/CreatePost/models/create-post'
import { postAction } from 'features/posts/postSlice'
import { motelActions } from 'features/motels/motelSlice'
import { useEffect } from 'react'
import { CreateReview } from 'features/posts/components/CreatePost/Review/CreateReview'

const CreateReviewPage = () => {
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

export default CreateReviewPage
