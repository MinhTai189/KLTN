import { Box, CircularProgress, Theme, Tooltip } from "@material-ui/core"
import { ArrowBack, ArrowForward, Favorite, FavoriteBorder } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { authActions, selectCurrentUser, selectLoading } from "features/auth/authSlice"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router"
import { toast } from "react-toastify"
import Carousel from 'react-elastic-carousel'

interface Props {
    images: string[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',

        "& .rec-slider-container": {
            margin: 0
        }
    },
    mainImg: {
        width: '100%',
        height: 400,
        position: 'relative',
        background: '#232323',
        border: '3px solid ' + theme.palette.primary.main,
        overflow: 'hidden',

        "&:hover": {
            "& .favorite": {
                opacity: 1
            },

            "& .btnNext, & .btnPrev": {
                opacity: 1,
                transform: 'translate(0, -50%)',
            }
        },

        "& .favorite": {
            position: 'absolute',
            top: -1,
            left: -1,
            height: 45,
            width: 45,
            background: '#48a9a6b8',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '0 0 100% 0',
            paddingBottom: 4,
            paddingRight: 4,
            opacity: 0,
            transition: '300ms all ease',

            "& .MuiSvgIcon-root": {
                fill: '#fff',
                cursor: 'pointer'
            }
        },

        "& img": {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },

        "& .btnNext, & .btnPrev": {
            position: 'absolute',
            top: '50%',
            opacity: 0,
            width: 30,
            height: 30,
            background: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            transition: '300ms all ease-in',

            "&:hover": {
                background: theme.palette.primary.main
            }
        },

        "& .btnNext": {
            right: 10,
            transform: 'translate(50px, -50%)',
        },

        "& .btnPrev": {
            left: 10,
            transform: 'translate(-50px, -50%)',
        },
    },
    listImg: {
        display: 'flex',
        marginTop: 8,
        overflowY: 'hidden',
        overflowX: 'scroll',

        "&::-webkit-scrollbar": {
            width: 0
        },

        "& img": {
            width: 150,
            height: 100,
            objectFit: 'cover',
            border: `3px solid ${theme.palette.primary.main}`,
            filter: 'brightness(40%)',
            transition: '300ms all',
            flexShrink: 0,

            "&:not(:last-child)": {
                marginRight: 8
            },

            "&.active, &:hover": {
                filter: 'brightness(100%)',
            }
        }
    }
}))

export const AlbumMotel = ({ images }: Props) => {
    const classes = useStyles()
    const { id } = useParams<{ id: string }>()

    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectLoading)

    const [currentImg, setCurrentImg] = useState(0)
    const [isLike, setIsLike] = useState(false)

    const checkFavoriteMotel = useCallback(() => {
        return !!currentUser.favorite && currentUser.favorite.includes(id as string)
    },
        [currentUser, id])

    useEffect(() => {
        currentUser && setIsLike(checkFavoriteMotel())
    }, [currentUser, checkFavoriteMotel])


    const nextImg = () => {
        setCurrentImg(old => {
            if (old === images.length - 1)
                return 0
            return old + 1
        })
    }

    const prevImg = () => {
        setCurrentImg(old => {
            if (old === 0)
                return images.length - 1
            return old - 1
        })
    }

    const handleFavoriteMotel = () => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để sử dụng chức năng này!')
            return;
        }

        if (isLike) {
            dispatch(authActions.unlikeMotel(id as string))
        } else {
            dispatch(authActions.likeMotel(id as string))
        }
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.mainImg}>
                <span className='favorite'>
                    {!loading ?
                        isLike
                            ? <Tooltip title='Xóa nhà trọ vào danh sách yêu thích'>
                                <span onClick={handleFavoriteMotel}>
                                    <Favorite />
                                </span>
                            </Tooltip>
                            : <Tooltip title='Thêm nhà trọ vào danh sách yêu thích'>
                                <span onClick={handleFavoriteMotel}>
                                    <FavoriteBorder />
                                </span>
                            </Tooltip>
                        : <CircularProgress color='secondary' size={15} />
                    }
                </span>

                <img src={images[currentImg]} alt="Tìm nhà trọ sinh viên" />

                <span className="btnNext" onClick={nextImg}>
                    <ArrowForward />
                </span>

                <span className="btnPrev" onClick={prevImg}>
                    <ArrowBack />
                </span>
            </Box>

            <div className={classes.listImg}>
                <Carousel itemsToShow={5} isRTL={false} itemPosition={'START'} showEmptySlots={true} showArrows={false} pagination={false}>
                    {images.map((image, index) => {
                        const active = index === currentImg ? 'active' : ''

                        return (
                            <img className={active} src={image} alt="Tìm nhà trọ sinh viên" onClick={() => setCurrentImg(index)} />
                        )
                    })}
                </Carousel>
            </div>
        </Box>
    )
}
