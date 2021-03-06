import { Avatar, Box, Breadcrumbs, Button, Divider, makeStyles, Theme, Typography } from "@material-ui/core"
import { SmsTwoTone } from "@material-ui/icons"
import postApi from "api/post"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { UserTooltip } from "components/Common"
import { selectCurrentUser } from "features/auth/authSlice"
import { postAction, selectFilterPost } from "features/posts/postSlice"
import { Post, User } from "models"
import { memo, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { toast } from "react-toastify"
import { checkLikePostComment } from "utils"
import { calculateCreatedTime } from "utils/convert-date/calculateCreatedTime"
import { BtnAction } from "../Common/BtnAction"
import { Content } from "./Content"
import { ListTag } from "./ListTag"
import { PostRequirement } from './PostRequirement'
import { StaticAction } from "./StaticAction"

interface Props {
    postData: Post
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .breadcrumb .MuiTypography-root': {
            [theme.breakpoints.down('xs')]: {
                fontSize: '0.775rem'
            }
        }
    },
    title: {
        fontSize: '2em',
        fontWeight: 500,
        marginBlock: theme.spacing(3),

        [theme.breakpoints.down('xs')]: {
            fontSize: '1.7em',
            marginBlock: theme.spacing(2),
        }
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

            [theme.breakpoints.down('xs')]: {
                width: '2em',
                height: '2em',
            }
        },

        '& .name': {
            fontSize: '1.25em',
            cursor: 'pointer',
            color: theme.palette.primary.main,
            fontWeight: 500,

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.15em'
            }
        },

        '& .date-comment': {
            '& .text': {
                fontSize: '0.9em',

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.8em'
                }
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

export const PostViewSection = memo(({ postData }: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const [sizeAction, setSizeAction] = useState<'large' | 'small'>('large')

    const filter = useAppSelector(selectFilterPost)
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)
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
    }, [currentUser, postData])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 425)
                setSizeAction('small')
            else setSizeAction('large')
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
                || '???? x???y ra l???i trong qu?? tr??nh x??? l??!')
        }
    }

    return (
        <Box className={classes.root} component='section'>
            <Box className='breadcrumb'>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/'>
                        Trang ch???
                    </Link>
                    <Link to='/posts'>
                        Danh s??ch b??i vi???t
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
                <UserTooltip data={postData.owner}>
                    <Link to={`/profile/${postData.owner._id}`}>
                        <Avatar
                            className='avatar'
                            src={postData.owner.avatarUrl}
                        >
                            {postData.owner.name[0]}
                        </Avatar>
                    </Link>
                </UserTooltip>

                <Box className='author-info'>
                    <Link to={`/profile/${postData.owner._id}`}>
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
                            B??nh lu???n: {postData.numComments}
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

            {currentUser && <StaticAction
                postData={postData}
                isOwner={currentUser._id === postData.owner._id}
            />}

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
                        sizeAction={sizeAction}
                    />

                    <Button
                        className='btn'
                        startIcon={<SmsTwoTone />}
                        href="#comment"
                    >
                        B??nh lu???n
                    </Button>
                </Box>
            </Box>
        </Box>
    )
})
