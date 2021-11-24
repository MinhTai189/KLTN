import { Box, Theme, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import commentApi from 'api/comment'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectCurrentUser } from 'features/auth/authSlice'
import { BtnAction, ListTool, ModalStaticAction } from 'features/posts/components'
import { TotalAction } from 'features/posts/components/PostView/Common/TotalAction'
import { Comment, ReplingComment, User } from 'models'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkLikePostComment } from 'utils'
import { calculateCreatedTime } from 'utils/calculateCreatedTime'
import { commentAction, selectFilterComment } from '../commentSlice'
import { CommentContext } from '../contexts/CommentContext'

interface Props {
    positionAction?: 'left' | 'right'
    sizeAction?: 'small' | 'large'
    comment: Comment | ReplingComment
    repliedUser?: User
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    body: {
        background: '#edeef2',
        padding: theme.spacing(2),
        width: '100%',
        borderRadius: 10,
        position: 'relative',

        '& .total-action-wrapper': {
            position: 'absolute',
            bottom: -8,
            padding: theme.spacing(0.2, 0.5),
            background: '#fff',
            borderRadius: 10,
            boxShadow: theme.shadows[3]
        }
    },
    infoCmtContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,

        '& .left': {
            display: 'flex',
            alignItems: 'center',

            '& .author-name': {
                fontSize: '0.85em',
                marginRight: 8,

                '& a': {
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    transition: '300ms',

                    '&:hover': {
                        color: theme.palette.secondary.main
                    }
                }
            },

            '& .author-rank': {
                fontSize: '0.6em',
                marginRight: 8,
                background: '#cecece',
                padding: theme.spacing(0.2, 0.5),
                borderRadius: 5
            },

            '& .timestamp': {
                fontSize: '0.8em',
                color: theme.palette.text.secondary
            }
        }
    },
    content: {
        fontSize: '1em',

        '& .hash-tag': {
            color: theme.palette.primary.main,
            cursor: 'pointer',
            marginRight: theme.spacing(1),
            transition: '300ms',

            '&:hover': {
                color: theme.palette.primary.dark
            }
        }
    },
    controls: {
        marginTop: 4,

        '& .dot': {
            width: 5,
            height: 5,
            position: 'relative',
            marginInline: 8,

            '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 5,
                height: 5,
                background: '#f1f1f1',
                borderRadius: 50
            }
        },

        '& .MuiButton-root': {
            padding: theme.spacing(0.2, 0),
            minWidth: 40,
            color: theme.palette.text.primary,

            '& .MuiButton-label': {
                textTransform: 'capitalize',
                fontWeight: 400,
                fontSize: '0.8em'
            }
        }
    }
}))

export const CommentBody = ({ positionAction = 'right', sizeAction = 'large', comment, repliedUser }: Props) => {
    const classes = useStyles()
    const currentUser: User = useAppSelector(selectCurrentUser)
    const filter = useAppSelector(selectFilterComment)

    const dispatch = useAppDispatch()
    const [showModalStatic, setShowModalStatic] = useState(false)

    const { _id, owner: { name, rank, _id: userId }, createdAt, content, totalLikes, numLikes, likes } = comment

    const [likeComment, setLikeComment] = useState<{ isLike: boolean; type: number }>({
        isLike: false,
        type: -1,
    })

    useEffect(() => {
        if (currentUser) {
            const checkLikePost = checkLikePostComment(likes, currentUser._id)
            if (checkLikePost)
                setLikeComment({
                    isLike: true,
                    type: checkLikePost.type
                })
        }
    }, [currentUser])

    const handleLikeComment = async (type: number, isClickBtn?: boolean) => {
        try {
            if (likeComment.isLike === true && isClickBtn) {
                await commentApi.unlike(_id)
                setLikeComment({
                    isLike: false,
                    type: -1,
                })
            } else if (type !== likeComment.type) {
                await commentApi.like(_id, type)
                setLikeComment({
                    isLike: true,
                    type
                })
            }

            dispatch(commentAction.setFilter({ ...filter }))
        } catch (error: any) {
            toast.error(error.response.data.message
                || 'Đã xảy ra lỗi trong quá trình xử lý!')
        }
    }

    return (
        <CommentContext.Consumer>
            {value => (
                <Box className={classes.root}>
                    <Box className={classes.body}>
                        <Box className={classes.infoCmtContainer}>
                            <Box className="left">
                                <Typography
                                    variant='h6'
                                    className='author-name'
                                >
                                    <Link to='/'>
                                        {name}
                                    </Link>
                                </Typography>

                                <Typography className='author-rank'>
                                    {rank}
                                </Typography>

                                <Typography
                                    component='small'
                                    className='timestamp'
                                >
                                    {calculateCreatedTime(createdAt)}
                                </Typography>
                            </Box>

                            <ListTool />
                        </Box>

                        <Typography className={classes.content}>
                            {repliedUser && <span className="hash-tag">
                                <Link to='/'>
                                    {`@${repliedUser.name}`}
                                </Link>
                            </span>}
                            {content}
                        </Typography>

                        {totalLikes > 0 && <Box
                            className='total-action-wrapper'
                            onClick={() => setShowModalStatic(true)}
                        >
                            <TotalAction
                                size='small'
                                quantityLike={totalLikes}
                                staticLike={numLikes}
                            />
                        </Box>}
                    </Box>

                    {currentUser && currentUser._id !== userId && <Box
                        className={classes.controls}
                        display='flex'
                        justifyContent='flex-end'
                        alignItems='center'
                    >
                        <BtnAction
                            positionAction={positionAction}
                            sizeAction={sizeAction}
                            isLike={likeComment.isLike}
                            type={likeComment.type}
                            handleLike={handleLikeComment}
                            hiddenIcon
                        />

                        <span className='dot'></span>

                        <Button
                            size='small'
                            style={{ background: value.typing.id === _id ? '#edeef2' : '' }}
                            onClick={() => value.handleRely(_id, name)}
                        >
                            {value.typing.id === _id ? 'Hủy' : 'Trả lời'}
                        </Button>
                    </Box>}

                    {currentUser && <ModalStaticAction
                        open={showModalStatic}
                        onCancel={() => { setShowModalStatic(false) }}
                        listLike={likes}
                        totalQuantity={totalLikes}
                        staticLike={numLikes}
                    />}
                </Box>
            )}
        </CommentContext.Consumer>
    )
}
