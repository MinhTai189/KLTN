import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import ImageGallery from "components/Common/ImageGallery"
import { useState } from "react"

interface Props {
    images: string[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        maxWidth: 350,
        gap: theme.spacing(0.5),
        marginBottom: theme.spacing(1),

        '& .img': {
            background: '#fff',
            width: '100%',
            aspectRatio: '1 / 1',
            cursor: 'pointer',

            '& img': {
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                transition: '300ms',
            },

            '&:hover img': {
                filter: 'brightness(60%)'
            },

            '&.span-2': {
                gridColumn: '2 / span 2',
                aspectRatio: 'unset',
                height: 135,
            },

            '&.span-3': {
                gridColumn: '1 / span 3',
                maxHeight: 170,
            },

            '&.no-ratio': {
                aspectRatio: 'unset',
                height: 135,
            }
        },
    }
}))

const Album = ({ images }: Props) => {
    const classes = useStyles()
    const [showGallery, setShowGallery] = useState(false)

    return (
        <>
            <Box className={classes.root}>
                {images.map((image, index, arr) => {
                    let classSpan = ''

                    if (arr.length % 3 === 2) {
                        if (index === arr.length - 1)
                            classSpan = 'span-2'
                        if (index === arr.length - 2)
                            classSpan = 'no-ratio'
                    }
                    if (arr.length % 3 === 1 && index === arr.length - 1)
                        classSpan = 'span-3'

                    return (
                        <span
                            key={index}
                            className={`img ${classSpan}`}
                            onClick={() => setShowGallery(true)}
                        >
                            <img
                                src={image}
                                loading="lazy"
                                alt='tim nha tro'
                            />
                        </span>
                    )
                })}
            </Box>

            <ImageGallery images={images} open={showGallery} onCancel={() => setShowGallery(false)} />
        </>
    )
}

export default Album
