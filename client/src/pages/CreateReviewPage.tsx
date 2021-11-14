import { MainLayout } from 'components/Layouts'
import { CreateReview } from 'features/communicate/components'

interface Props {

}

export const CreateReviewPage = (props: Props) => {
    return (
        <MainLayout>
            <CreateReview />
        </MainLayout>
    )
}
