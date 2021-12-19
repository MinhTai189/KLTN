import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Post } from 'models'
import AddRowContent from '../common/AddRowContent'

interface Props {
    data: Post
}

const useStyles = makeStyles((them: Theme) => ({
    root: {}
}))

const AddBodyPost = ({ data }: Props) => {
    const classes = useStyles()

    const motelOrSchool = data.type === 1 ? data.require.schools.map(x => x.name).join(',') : data.motel?.name
    const additionals = data?.require?.additional
    const motelLink = data.type !== 1 ? `/motels/${data.motel._id}` : undefined

    let content = data.type === 3 ? 'Không thể hiển thị trực tiếp. Nhấn vào nút "Xem trước" phía trên để xem' : data.content
    content = content.length > 250 ? `${content.slice(0, 250)}...` : content

    return (
        <>
            <Box className={classes.root}>
                <AddRowContent
                    labelLeft='Tiêu đề'
                    contentLeft={data.title}
                    labelRight='Danh sách tag'
                    contentRight={data.tags.join(',')}
                    wordBreak='break-all'
                />

                <AddRowContent
                    labelLeft={data.type === 1 ? 'Trường lân cận' : 'Nhà trọ'}
                    contentLeft={motelOrSchool}
                    linkContentLeft={motelLink}
                    labelRight={data.type === 3 ? undefined : 'Một số yêu cầu'}
                    contentRight={additionals}
                />

                <AddRowContent
                    labelLeft='Nội dung'
                    contentLeft={content}
                    titleContentLeft={data.type !== 3 && data.content.length > 250 ? data.content : ''}
                />
            </Box>
        </>
    )
}

export default AddBodyPost
