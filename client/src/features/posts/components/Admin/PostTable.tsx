
interface Props {

}

export const PostTable = (props: Props) => {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            width: 60
        },
        {
            title: 'Tác giả',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Chủ đề',
            dataIndex: 'thread',
            key: 'thread',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Lượt thích',
            dataIndex: 'like',
            key: 'like',
        },
        {
            title: 'Lượt bình luận',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ]

    return (
        <h1>
            table
        </h1>
    )
}
