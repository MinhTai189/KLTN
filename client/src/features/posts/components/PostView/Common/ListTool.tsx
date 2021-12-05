import { Box, List, ListItem, ListItemText, makeStyles, Theme } from "@material-ui/core"
import { MoreHoriz } from "@material-ui/icons"
import commentApi from "api/comment"
import postApi from "api/post"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { ModalReport } from "components/Common"
import { selectCurrentUser } from "features/auth/authSlice"
import { commentAction, selectFilterComment } from "features/comment/commentSlice"
import { useDetectClickOutside } from "hooks"
import { Comment, Post, ReplingComment, User } from "models"
import { useRef, useState } from "react"
import { useHistory } from "react-router"
import { toast } from "react-toastify"

interface Props {
    data: Post | Comment | ReplingComment
    isPost: boolean
    isOwner: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        width: 20,
        height: 20,

        '& .icon': {
            fill: theme.palette.text.secondary,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
        },

        '& .list-tool': {
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            boxShadow: theme.shadows[3],
            width: 135,
            zIndex: 100,
            borderRadius: 5,
            opacity: 0,
            transform: 'scale(0)',
            transition: '200ms',

            '&.active': {
                opacity: 1,
                transform: 'scale(1)',
            },

            '& .MuiTypography-root': {
                fontSize: '1em'
            }
        }
    }
}))

export const ListTool = ({ isPost, isOwner, data }: Props) => {
    const classes = useStyles()
    const history = useHistory()
    const listRef = useRef<any>()

    const dispatch = useAppDispatch()
    const filterComment = useAppSelector(selectFilterComment)
    const { _id } = data

    const currentUser: User = useAppSelector(selectCurrentUser)
    const [loading, setLoading] = useState(false)

    const [reportContent, setReportContent] = useState('')
    const [showList, setShowList] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useDetectClickOutside(listRef, () => setShowList(false))

    const handleSubmitReport = async () => {
        if (reportContent.length > 100) {
            toast.error("Nội dung báo cáo tối đa 100 ký tự")
            return
        }

        try {
            setLoading(true)

            isPost ? await postApi.report(_id, reportContent)
                : await commentApi.report(_id, reportContent)

            toast.success('Gửi báo cáo thành công!')

            setLoading(false)
            setReportContent('')
            setShowConfirmModal(false)
            setShowList(false)
        } catch (error) {
            toast.error('Gửi báo cáo thất bại!')
            setLoading(false)
        }
    }

    const handleSubmitCloseComment = async () => {
        if (!window.confirm('Bạn có muốn đóng bình luận của bài viết này không ?\nMột khi đã đóng bạn sẽ không có khả năng mở lại.'))
            return

        try {
            await postApi.update({
                block: true
            })

            toast.success('Đã đóng bình luận thành công!')
            setShowList(false)
        } catch (error) {
            toast.error('Đóng bình luận thất bại!')
        }
    }

    const handleSubmitCompletedPost = async () => {
        if (!window.confirm('Khi bạn đã hoàn thành mục tiêu của bài viết, bạn có thể chuyển trạng thái sang "Hoàn thành".\nBạn có muốn đánh dấu đã hoàn thành không ?'))
            return

        try {
            await postApi.update({
                status: true
            })

            toast.success('Chuyển trạng thái bài viết thành công!')
            setShowList(false)
        } catch (error) {
            toast.error('Chuyển trạng thái bài viết thất bại!')
        }
    }

    const handleSubmitRemove = async () => {
        if (!window.confirm('Bạn có thật sự muốn xóa không ?'))
            return

        try {
            isPost ? await postApi.remove(_id)
                : await commentApi.remove(_id)

            toast.success('Xóa bài viết thành công!')
            !isPost && dispatch(commentAction.setFilter({ ...filterComment }))
            setShowList(false)

            isPost && history.push('/posts')
        } catch (error) {
            toast.error('Xóa bài viết thất bại!')
        }
    }

    return (
        <>
            <Box className={classes.root}>
                <MoreHoriz
                    className='icon'
                    onClick={() => setTimeout(() => setShowList(!showList), 100)}
                />

                <List
                    className={`list-tool ${showList ? 'active' : ''}`}
                    component="ul"
                    ref={listRef}
                >
                    <ListItem
                        className='tool'
                        button
                        component="li"
                        onClick={() => setShowConfirmModal(true)}
                    >
                        <ListItemText primary="Báo xấu" />
                    </ListItem>

                    {currentUser && currentUser.isAdmin && <ListItem
                        className='tool'
                        button
                        component="li"
                        onClick={handleSubmitRemove}
                    >
                        <ListItemText primary="Xóa" />
                    </ListItem>}


                    {// @ts-ignore
                        isOwner && isPost && !data?.block && <ListItem
                            className='tool'
                            button
                            component="li"
                            onClick={handleSubmitCloseComment}
                        >
                            <ListItemText primary="Đóng bình luận" />
                        </ListItem>}


                    {// @ts-ignore
                        isOwner && isPost && !data?.status && <ListItem
                            className='tool'
                            button
                            component="li"
                            onClick={handleSubmitCompletedPost}
                        >
                            <ListItemText primary="Đã hoàn thành" />
                        </ListItem>}
                </List>
            </Box>

            <ModalReport
                openModal={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onOk={handleSubmitReport}
                valueReport={reportContent}
                onChange={setReportContent}
                loading={loading}
            />
        </>
    )
}
