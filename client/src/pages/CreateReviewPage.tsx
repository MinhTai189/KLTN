import { useAppDispatch } from 'app/hooks'
import { MainLayout } from 'components/Layouts'
import { motelActions } from 'features/motels/motelSlice'
import { CreateReview } from 'features/posts/components/CreatePost/Review/CreateReview'
import { useEffect } from 'react'

const CreateReviewPage = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(motelActions.getMotel({}))
    }, [])

    return (
        <MainLayout>
            <CreateReview />
        </MainLayout>
    )
}

export default CreateReviewPage
