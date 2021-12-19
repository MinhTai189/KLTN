import { Box } from '@material-ui/core'
import { RateApprove } from 'models'
import AddRowContent from '../common/AddRowContent'

interface Props {
    rate: RateApprove
}

const AddBodyRate = ({ rate }: Props) => {
    const content = rate.content.length > 250 ? `${rate.content.slice(0, 250)}...` : rate.content
    const tooltipContent = rate.content.length > 250 ? rate.content : ''

    return (
        <Box>
            <AddRowContent
                labelLeft='Nhà trọ'
                contentLeft={rate.motel.name}
                linkContentLeft={`/motels/${rate.motel._id}`}
                labelRight='Số điểm'
                contentRight={`${rate.star} sao`}
            />

            <AddRowContent
                labelLeft='Nội dung'
                contentLeft={content}
                titleContentLeft={tooltipContent}
            />
        </Box>
    )
}

export default AddBodyRate
