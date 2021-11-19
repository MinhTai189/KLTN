import { Avatar, Box, Breadcrumbs, Button, Divider, makeStyles, Theme, Typography } from "@material-ui/core"
import { SmsTwoTone } from "@material-ui/icons"
import { Pagination } from '@material-ui/lab'
import postApi from "api/post"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { selectCurrentUser } from "features/auth/authSlice"
import { TypingComment } from "features/comment/components"
import { postAction, selectFilterPost } from "features/posts/postSlice"
import { Post, User } from "models"
import { useEffect, useRef, useState } from "react"
import { Link } from 'react-router-dom'
import { toast } from "react-toastify"
import { checkLikePostComment } from "utils"
import { calculateCreatedTime } from "utils/calculateCreatedTime"
import { Comment } from "../../../../comment/components/Comment"
import { BtnAction } from "../Common/BtnAction"
import { MotelRecommendPost } from "../Recommended/MotelRecommendPost"
import { RelatedPost } from "../Recommended/RelatedPost"
import { Content } from "./Content"
import { ListTag } from "./ListTag"
import { PostRequirement } from './PostRequirement'
import { StaticAction } from "./StaticAction"

interface Props {
    postData: Post
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    title: {
        fontSize: '2em',
        fontWeight: 500,
        marginBlock: theme.spacing(3)
    },
    authorWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),

        '& .avatar': {
            marginRight: theme.spacing(1),
            border: `2px solid ${theme.palette.primary.main}`,
            cursor: 'pointer',
            width: '2.2em',
            height: '2.2em',
        },

        '& .name': {
            fontSize: '1.25em',
            cursor: 'pointer',
            color: theme.palette.primary.main,
            fontWeight: 500
        },

        '& .date-comment': {
            '& .text': {
                fontSize: '0.9em'
            }
        }
    },
    threadActions: {
        paddingBlock: theme.spacing(1),
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',

        '& .button-group': {
            '& .btn': {
                marginRight: 16,
                background: '#edeef2',
                paddingInline: theme.spacing(2),
                textTransform: 'initial'
            },
        },
    }
}))

export const PostView = ({ postData }: Props) => {
    const classes = useStyles()
    const inputRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

    const filter = useAppSelector(selectFilterPost)
    const currentUser: User = useAppSelector(selectCurrentUser)

    const [userCommentData, setUserCommentData] = useState('')
    const [likePost, setLikePost] = useState<{ isLike: boolean; type: number }>({
        isLike: false,
        type: -1,
    })

    useEffect(() => {
        if (currentUser) {
            const checkLikePost = checkLikePostComment(postData.likes, currentUser._id)
            if (checkLikePost)
                setLikePost({
                    isLike: true,
                    type: checkLikePost.type
                })
        }
    }, [currentUser])

    const handleLikePost = async (type: number, isClickBtn?: boolean) => {
        try {
            if (likePost.isLike === true && isClickBtn) {
                await postApi.unlike(postData._id)
                setLikePost({
                    isLike: false,
                    type: -1,
                })
            } else if (type !== likePost.type) {
                await postApi.like(postData._id, type)
                setLikePost({
                    isLike: true,
                    type
                })
            }

            dispatch(postAction.setFilter({ ...filter }))
        } catch (error: any) {
            toast.error(error.response.data.message
                || 'Đã xảy ra lỗi trong quá trình xử lý!')
        }
    }

    return (
        <Box className={classes.root}>
            <Box className='breadcrumb'>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/'>
                        Trang chủ
                    </Link>
                    <Link to='/'>
                        Danh sách chủ đề
                    </Link>
                    <Typography color="textPrimary">
                        {postData.subject.name}
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Typography
                variant='h1'
                className={classes.title}
            >
                {postData.title}
            </Typography>

            <Box className={classes.authorWrapper}>
                <Link to='/'>
                    <Avatar
                        className='avatar'
                        src={postData.owner.avatarUrl}
                    >
                        {postData.owner.name[0]}
                    </Avatar>
                </Link>

                <Box className='author-info'>
                    <Link to='/'>
                        <Typography
                            className='name'
                            variant='h3'
                        >
                            {postData.owner.name}
                        </Typography>
                    </Link>

                    <Box className="date-comment">
                        <Typography
                            className='text'
                            component='span'>
                            {`${calculateCreatedTime(postData.createdAt)}`}&nbsp;&#x22C5;&nbsp;
                            Bình luận: {postData.numComments}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            <Box my={1}>
                <ListTag listTag={postData.tags} />
            </Box>

            <Box my={3}>
                <Content
                    content={postData.content}
                    type={postData.type}
                />
            </Box>

            {postData.require && <Box my={3}>
                <PostRequirement require={postData.require} />
            </Box>}

            <StaticAction
                listLike={postData.likes}
                staticLike={postData.numLikes}
                quantityLike={postData.totalLikes}
                quantityComment={postData.numComments}
            />

            <Box
                className={classes.threadActions}
                mt={0.5}
                mb={4}
            >
                <Box className='button-group'>
                    <BtnAction
                        isLike={likePost.isLike}
                        type={likePost.type}
                        handleLike={handleLikePost}
                    />

                    <Button
                        className='btn'
                        startIcon={<SmsTwoTone />}
                        href="#comment"
                        onClick={() => { inputRef.current?.focus() }}
                    >
                        Bình luận
                    </Button>
                </Box>
            </Box>

            <Box my={4}>
                <RelatedPost />
            </Box>

            <Box my={4}>
                <MotelRecommendPost />
            </Box>

            <Box
                display='flex'
                justifyContent='flex-end'
                mt={8}
            >
                <Pagination
                    count={10}
                    size="small"
                    shape='rounded'
                    hideNextButton
                    hidePrevButton
                    color='primary'
                />
            </Box>

            <Box
                id='comment'
                mb={2}
            >
                <TypingComment
                    ref={inputRef}
                    data={userCommentData}
                    setData={setUserCommentData}
                />
            </Box>

            <Comment />

            <Box
                display='flex'
                justifyContent='flex-end'
                mt={8}
            >
                <Pagination
                    count={10}
                    size="small"
                    shape='rounded'
                    hideNextButton
                    hidePrevButton
                    color='primary'
                />
            </Box>

            <Box
                mb={2}
            >
                <TypingComment
                    ref={inputRef}
                    data={userCommentData}
                    setData={setUserCommentData}
                />
            </Box>

            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Box>
    )
}
