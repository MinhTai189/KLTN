import { Box, CircularProgress, Theme, Tooltip } from "@material-ui/core"
import { Favorite, FavoriteBorder } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Modal } from "components/Common"
import { authActions, selectCurrentUser, selectLoading } from "features/auth/authSlice"
import { useCallback, useEffect, useState } from "react"
import Carousel from 'react-elastic-carousel'
import { useParams } from "react-router"
import { toast } from "react-toastify"
import { PreviewImages } from ".."

interface Props {
    images: string[]
    motelName: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
    },
    mainImg: {
        width: '100%',
        height: 400,
        position: 'relative',
        background: '#fff',
        boxShadow: theme.shadows[5],
        overflow: 'hidden',
        cursor: 'pointer',

        [theme.breakpoints.down('md')]: {
            boxShadow: theme.shadows[2],
        },

        "&:hover": {
            "& .favorite": {
                opacity: 1
            },
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
    },
    listImg: {
        marginTop: 8,
        boxShadow: theme.shadows[5],
        padding: '4px 0',

        [theme.breakpoints.down('md')]: {
            boxShadow: theme.shadows[2],
        },

        '& .rec-carousel': {
            position: 'relative',
        },

        '& .rec-slider-container': {
            margin: 0
        },

        '& .rec-arrow': {
            position: 'absolute',
            width: 25,
            height: 40,
            lineHeight: 'unset',
            fontSize: 17,
            background: 'rgba(0, 0, 0, 0.4)',
            minWidth: 'unset',
            borderRadius: 0,
            border: "none",
            outline: 'none',
            boxShadow: 'none',
            color: '#fff',

            '&:disabled': {
                cursor: 'pointer'
            },

            '&:hover:enabled': {
                background: 'rgba(0, 0, 0, 0.4)',
            },

            '&.rec-arrow-right': {
                right: 0
            },

            '&.rec-arrow-left': {
                left: 0,
                zIndex: 5
            }
        },

        "& img": {
            width: '100%',
            height: 80,
            objectFit: 'cover',
            transition: '300ms all',
            flexShrink: 0,
            cursor: 'pointer',
            "&.active, &:hover": {
                border: `3px solid ${theme.palette.primary.main}`,
            },

        }
    },
}))

const carouselBreakPoints = [
    { width: 1, itemsToShow: 3 },
    { width: 425, itemsToShow: 4 },
    { width: 900, itemsToShow: 3 },
]

export const AlbumMotel = ({ images, motelName }: Props) => {
    const classes = useStyles()
    const { id } = useParams<{ id: string }>()

    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectLoading)

    const [currentImg, setCurrentImg] = useState(0)
    const [currentPreviewImg, serCurrentPreviewImg] = useState(0)

    const [isLike, setIsLike] = useState(false)
    const [openPreviewModal, setOpenPreviewModal] = useState(false)

    const checkFavoriteMotel = useCallback(() => {
        if (!currentUser?.favorite) return false

        return !!currentUser.favorite && currentUser.favorite.includes(id as string)
    },
        [currentUser, id])

    useEffect(() => {
        currentUser && setIsLike(checkFavoriteMotel())
    }, [currentUser, checkFavoriteMotel])

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

    const hanldeCancelPreviewModal = () => {
        setOpenPreviewModal(false)
    }

    const handlePrevPreview = () => {
        serCurrentPreviewImg(prev => {
            if (prev <= 0)
                return images.length - 1
            return prev - 1
        })
    }

    const handleNextPreview = () => {
        serCurrentPreviewImg(prev => {
            if (prev >= images.length - 1)
                return 0
            return prev + 1
        })
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

                <img
                    src={images[currentImg]}
                    alt="Tìm nhà trọ sinh viên"
                    onClick={() => setOpenPreviewModal(true)}
                />
            </Box>

            <div className={classes.listImg}>
                <Carousel
                    itemsToShow={4}
                    isRTL={false}
                    pagination={false}
                    itemPosition='START'
                    enableSwipe={false}
                    enableMouseSwipe={false}
                    itemPadding={[0, 4, 0, 4]}
                    showEmptySlots={true}
                    breakPoints={carouselBreakPoints}
                >
                    {images.map((image, index) => {
                        const active = index === currentImg ? 'active' : ''

                        return (
                            <img
                                key={index.toString()}
                                className={active}
                                src={image}
                                alt="Tìm nhà trọ sinh viên"
                                onMouseOver={() => { setCurrentImg(index); serCurrentPreviewImg(index) }}
                                onClick={() => setOpenPreviewModal(true)}
                            />
                        )
                    })}
                </Carousel>
            </div>

            <Modal open={openPreviewModal} onCancel={hanldeCancelPreviewModal} >
                <PreviewImages
                    images={images}
                    currentIndex={currentPreviewImg}
                    setCurrentIndex={serCurrentPreviewImg}
                    motelName={motelName}
                    handleNextPreview={handleNextPreview}
                    handlePrevPreview={handlePrevPreview}
                />
            </Modal>
        </Box>
    )
}
