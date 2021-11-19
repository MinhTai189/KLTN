import { Box, Grid, Theme, Typography } from "@material-ui/core"
import { NavigateBefore, NavigateNext } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"

interface Props {
    images: string[]
    motelName: string
    currentIndex: number
    setCurrentIndex: (state: number) => void
    handlePrevPreview: () => void
    handleNextPreview: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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

export const PreviewImages = ({ images, motelName, currentIndex, setCurrentIndex, handleNextPreview, handlePrevPreview }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item sm={12} md={8}>
                    <Box className={classes.imgPreview}>
                        <img src={images[currentIndex]} alt='motel image' />

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
                                const active = index === currentIndex ? 'active' : ''

                                return (
                                    <div
                                        key={index}
                                        className={`img ${active}`}
                                        onClick={() => setCurrentIndex(index)}
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
    )
}
