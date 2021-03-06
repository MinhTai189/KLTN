import { Box, List, ListItem, ListItemText, makeStyles, Theme } from "@material-ui/core"
import { MoreHoriz } from "@material-ui/icons"
import commentApi from "api/comment"
import postApi from "api/post"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { ModalReport } from "components/Common"
import { DetectClickOutsize } from "components/Common/DetectClickOutsize"
import { selectCurrentUser } from "features/auth/authSlice"
import { commentAction, selectFilterComment } from "features/comment/commentSlice"
import { postAction, selectFilterPost } from "features/posts/postSlice"
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
    const filterPost = useAppSelector(selectFilterPost)
    const { _id } = data

    const currentUser: User | undefined = useAppSelector(selectCurrentUser)
    const [loading, setLoading] = useState(false)

    const [reportContent, setReportContent] = useState('')
    const [showList, setShowList] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleSubmitReport = async () => {
        if (reportContent.length > 100) {
            toast.error("N???i dung b??o c??o t???i ??a 100 k?? t???")
            return
        }

        try {
            setLoading(true)

            isPost ? await postApi.report(_id, reportContent)
                : await commentApi.report(_id, reportContent)

            toast.success('G???i b??o c??o th??nh c??ng!')

            setLoading(false)
            setReportContent('')
            setShowConfirmModal(false)
            setShowList(false)
        } catch (error) {
            toast.error('G???i b??o c??o th???t b???i!')
            setLoading(false)
        }
    }

    const handleSubmitCloseComment = async () => {
        if (!window.confirm('B???n c?? mu???n ????ng b??nh lu???n c???a b??i vi???t n??y kh??ng ?\nM???t khi ???? ????ng b???n s??? kh??ng c?? kh??? n??ng m??? l???i.'))
            return

        try {
            await postApi.update({
                block: true
            })

            toast.success('???? ????ng b??nh lu???n th??nh c??ng!')
            setShowList(false)
        } catch (error) {
            toast.error('????ng b??nh lu???n th???t b???i!')
        }
    }

    const handleSubmitCompletedPost = async () => {
        if (!window.confirm('Khi b???n ???? ho??n th??nh m???c ti??u c???a b??i vi???t, b???n c?? th??? chuy???n tr???ng th??i sang "Ho??n th??nh".\nB???n c?? mu???n ????nh d???u ???? ho??n th??nh kh??ng ?'))
            return

        try {
            await postApi.update({
                status: true
            })

            toast.success('Chuy???n tr???ng th??i b??i vi???t th??nh c??ng!')
            setShowList(false)
        } catch (error) {
            toast.error('Chuy???n tr???ng th??i b??i vi???t th???t b???i!')
        }
    }

    const handleSubmitRemove = async () => {
        if (!window.confirm('B???n c?? th???t s??? mu???n x??a kh??ng ?'))
            return

        try {
            isPost ? await postApi.remove(_id)
                : await commentApi.remove(_id)

            toast.success('X??a b??i vi???t th??nh c??ng!')
            !isPost && dispatch(commentAction.setFilter({ ...filterComment }))
            !isPost && dispatch(postAction.setFilter({ ...filterPost }))
            setShowList(false)

            isPost && history.push('/posts')
        } catch (error) {
            toast.error('X??a b??i vi???t th???t b???i!')
        }
    }

    return (
        <>
            <Box className={classes.root}>
                <MoreHoriz
                    className='icon'
                    onClick={() => setShowList(!showList)}
                />

                {showList && <DetectClickOutsize cb={() => setTimeout(() => setShowList(false), 100)}>
                    <List
                        className='list-tool'
                        component="ul"
                        ref={listRef}
                    >
                        <ListItem
                            className='tool'
                            button
                            component="li"
                            onClick={() => setShowConfirmModal(true)}
                        >
                            <ListItemText primary="B??o x???u" />
                        </ListItem>

                        {currentUser && currentUser.isAdmin && <ListItem
                            className='tool'
                            button
                            component="li"
                            onClick={handleSubmitRemove}
                        >
                            <ListItemText primary="X??a" />
                        </ListItem>}


                        {// @ts-ignore
                            isOwner && isPost && !data?.block && <ListItem
                                className='tool'
                                button
                                component="li"
                                onClick={handleSubmitCloseComment}
                            >
                                <ListItemText primary="????ng b??nh lu???n" />
                            </ListItem>}


                        {// @ts-ignore
                            isOwner && isPost && !data?.status && <ListItem
                                className='tool'
                                button
                                component="li"
                                onClick={handleSubmitCompletedPost}
                            >
                                <ListItemText primary="???? ho??n th??nh" />
                            </ListItem>}
                    </List>
                </DetectClickOutsize>}
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
