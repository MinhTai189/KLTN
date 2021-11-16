import { ListRecommended } from 'features/motels/components/Recommended/ListRecommended'
import { RecommendedLayout } from '../Layout/RecommendedLayout'

interface Props {

}

export const MotelRecommendPost = (props: Props) => {
    return (
        <RecommendedLayout title='Nhà trọ gợi ý'>
            <ListRecommended />
        </RecommendedLayout>
    )
}
