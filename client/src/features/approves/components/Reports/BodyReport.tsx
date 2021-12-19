import { Box } from "@material-ui/core"
import { Report } from "models"
import AddRowContent from "../common/AddRowContent"

interface Props {
    data: Report
}

const BodyReport = ({ data }: Props) => {
    const seeMoreLinks = {
        rate: `/motels/${data.data?.motel?._id}`,
        post: `/posts/${data.data?._id}`,
        comment: `/posts/${data.data?.post}`,
    }

    const listLabel = {
        rate: 'Nội dung đánh giá',
        comment: 'Nội dung bình luận'
    }

    const content = data.type === 'rate' ?
        data.data.content : data.type === 'comment' ?
            data.data.content : undefined

    return (
        <Box>
            <AddRowContent
                labelLeft="Nội dung"
                contentLeft={data.content}
                labelRight="Thông tin"
                contentRight="Xem chi tiết"
                // @ts-ignore
                linkContentRight={seeMoreLinks[data.type]}
            />

            {data.type !== 'post' && <AddRowContent
                // @ts-ignore
                labelLeft={listLabel[data.type]}
                contentLeft={content}
            />}
        </Box>
    )
}

export default BodyReport
