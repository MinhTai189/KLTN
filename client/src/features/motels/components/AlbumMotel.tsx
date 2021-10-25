import { Box, CircularProgress, Grid, Theme, Tooltip, Typography } from "@material-ui/core"
import { Favorite, FavoriteBorder, NavigateBefore, NavigateNext } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Modal } from "components/Common"
import { authActions, selectCurrentUser, selectLoading } from "features/auth/authSlice"
import { useCallback, useEffect, useState } from "react"
import Carousel from 'react-elastic-carousel'
import { useParams } from "react-router"
import { toast } from "react-toastify"

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
    imgPreviewBox: {
        width: '90vw',
        maxWidth: 850
    },
    imgPreview: {
        width: '100%',
        height: 0,
        paddingBottom: '100%',
        position: 'relative',

        '& img': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },

        '& .btn': {
            width: '8%',
            height: '15%',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',

            '& .MuiSvgIcon-root': {
                width: '2.5em',
                height: '2.5em',
                fill: '#fff'
            },

            '&.btn-right': {
                right: 0
            }
        }
    },
    previewLeftCol: {
        padding: theme.spacing(2, 0, 0, 1.5),

        '& .name': {
            fontSize: '1.8em',
            marginBottom: theme.spacing(1.5),
            paddingBottom: theme.spacing(0.7),
            position: 'relative',

            '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '5em',
                height: 1,
                background: theme.palette.secondary.main
            }
        },

        '& .listImgs': {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridGap: 7,

            '& .img': {
                width: '100%',
                paddingBottom: '100%',
                height: 0,
                position: 'relative',
                border: '3px solid transparent',

                '& img': {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: '100ms',

                    "&:hover": {
                        filter: 'brightness(130%)'
                    }
                },

                '&.active': {
                    border: `3px solid ${theme.palette.primary.main}`,
                }
            }
        }
    }
}))

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
                    itemsToShow={5}
                    isRTL={false}
                    pagination={false}
                    itemPosition='START'
                    enableSwipe={false}
                    enableMouseSwipe={false}
                    itemPadding={[0, 4, 0, 4]}
                    showEmptySlots={true}
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
                <Box className={classes.imgPreviewBox}>
                    <Grid container>
                        <Grid item sm={12} md={8}>
                            <Box className={classes.imgPreview}>
                                <img src={images[currentPreviewImg]} alt='motel image' />

                                <span
                                    className="btn btn-left"
                                    onClick={handlePrevPreview}
                                >
                                    <NavigateBefore />
                                </span>

                                <span
                                    className="btn btn-right"
                                    onClick={handleNextPreview}
                                >
                                    <NavigateNext />
                                </span>
                            </Box>
                        </Grid>

                        <Grid item sm={12} md={4}>
                            <Box className={classes.previewLeftCol}>
                                <Typography className='name' variant='h2'>
                                    {motelName}
                                </Typography>

                                <div className="listImgs">
                                    {images.map((img, index) => {
                                        const active = index === currentPreviewImg ? 'active' : ''

                                        return (
                                            <div
                                                key={index}
                                                className={`img ${active}`}
                                                onClick={() => serCurrentPreviewImg(index)}
                                            >
                                                <img src={img} alt='motel image' />
                                            </div>
                                        )
                                    })}
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Box>
    )
}
