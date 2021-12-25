import { ListRecommended } from 'features/motels/components/Recommended/ListRecommended'
import { Motel } from 'models'
import { RecommendedLayout } from '../Layout/RecommendedLayout'

interface Props {
    listMotel: Motel[]
}

export const MotelRecommendPost = ({ listMotel }: Props) => {
    return (
        <RecommendedLayout title='Nhà trọ gợi ý'>
            <ListRecommended listMotel={listMotel} />
        </RecommendedLayout>
    )
}
