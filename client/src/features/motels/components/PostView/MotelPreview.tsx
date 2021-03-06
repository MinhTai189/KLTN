import { Box, Button, Divider, makeStyles, Paper, Theme, Typography } from "@material-ui/core"
import { LocalOffer, LocationOn, Star } from "@material-ui/icons"
import { Modal } from "components/Common"
import { Motel } from "models"
import { useState } from "react"
import Carousel from "react-elastic-carousel"
import { Link } from "react-router-dom"
import { getPriceMotel } from "utils/getPriceMotel"
import { PreviewImages } from ".."

interface Props {
    motelData: Motel
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),

        '& .details': {
            '& > .name': {
                fontSize: '1.2em',
                textTransform: 'uppercase',
                fontWeight: 600,

                [theme.breakpoints.down('xs')]: {
                    fontSize: '1em'
                },
            },

            '& .rows': {
                display: 'flex',
                alignItems: 'center',
                marginBottom: theme.spacing(1.5),

                [theme.breakpoints.down('xs')]: {
                    marginBottom: theme.spacing(1)
                },

                '& .icon': {
                    marginRight: theme.spacing(1),
                    display: 'grid',
                    placeItems: 'center',
                    background: theme.palette.primary.main,
                    padding: theme.spacing(0.5),
                    borderRadius: '50%',

                    '& .MuiSvgIcon-root': {
                        width: 12,
                        height: 12,
                        fill: '#fff',

                        [theme.breakpoints.down('xs')]: {
                            width: 10,
                            height: 10
                        },
                    }
                },

                '& .text': {
                    fontSize: '0.9em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.8em'
                    },
                }
            },
        },

        '& > .images': {
            marginTop: theme.spacing(4),

            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(2)
            },

            '& img': {
                width: '100%',
                height: 60,
                objectFit: 'cover',
                borderRadius: 5,
                cursor: 'pointer'
            },

            '& .rec-carousel': {
                position: 'relative',
            },

            '& .rec-slider-container': {
                margin: 0
            },

            '& .rec-arrow': {
                position: 'absolute',
                width: 20,
                height: 25,
                lineHeight: 'unset',
                fontSize: 15,
                background: 'rgba(0, 0, 0, 0.4)',
                minWidth: 'unset',
                borderRadius: 5,
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
        }
    },
}))

export const MotelPreview = ({ motelData }: Props) => {
    const classes = useStyles()
    const [showModalPreview, setShowModalReview] = useState(false)
    const [currentPreviewImg, setCurrentPreviewImg] = useState(0)

    const images = [...(motelData.images as string[]), (motelData.thumbnail as string)]

    const handlePrevPreview = () => {
        setCurrentPreviewImg(prev => {
            if (prev <= 0)
                return images.length - 1
            return prev - 1
        })
    }

    const handleNextPreview = () => {
        setCurrentPreviewImg(prev => {
            if (prev >= images.length - 1)
                return 0
            return prev + 1
        })
    }

    return (
        <>
            <Paper className={classes.root}>
                <Box className='details'>
                    <Typography
                        className='name'
                        variant='h5'
                    >
                        {motelData.name}
                    </Typography>

                    <Divider style={{ marginTop: 8, marginBottom: 16 }} />

                    <Box className='rows'>
                        <span className='icon'>
                            <LocationOn />
                        </span>

                        <Typography className='text'>
                            {motelData.address}
                        </Typography>
                    </Box>

                    <Box className='rows'>
                        <span className='icon'>
                            <LocalOffer />
                        </span>

                        <Typography className='text'>
                            {`${getPriceMotel(motelData.room)}/th??ng`}
                        </Typography>
                    </Box>

                    <Box className='rows'>
                        <span className='icon'>
                            <Star />
                        </span>

                        <Typography className='text'>
                            {`${motelData.mark ? motelData.mark.toFixed(2) : '--'}/5`}
                        </Typography>
                    </Box>
                </Box>

                <Box className='images'>
                    <Carousel
                        itemsToShow={3}
                        isRTL={false}
                        pagination={false}
                        itemPosition='START'
                        enableSwipe={false}
                        enableMouseSwipe={false}
                        itemPadding={[0, 4, 0, 4]}
                        showEmptySlots={true}
                    >
                        {images.map((image, index) => {
                            return (
                                <img
                                    key={index.toString()}
                                    src={image}
                                    alt="T??m nh?? tr??? sinh vi??n"
                                    onClick={() => {
                                        setShowModalReview(true)
                                    }}
                                />
                            )
                        })}
                    </Carousel>
                </Box>

                <Box mt={3} mb={1}>
                    <Button
                        variant='outlined'
                        color='primary'
                        fullWidth
                        style={{ textTransform: 'initial' }}
                    >
                        <Link to={`/motels/${motelData._id}`}>
                            Xem chi ti???t
                        </Link>
                    </Button>
                </Box>
            </Paper>

            <Modal
                open={showModalPreview}
                onCancel={() => setShowModalReview(false)}
            >
                <PreviewImages
                    images={images}
                    currentIndex={currentPreviewImg}
                    setCurrentIndex={setCurrentPreviewImg}
                    handleNextPreview={handleNextPreview}
                    handlePrevPreview={handlePrevPreview}
                    motelName={motelData.name}
                />
            </Modal>
        </>
    )
}
