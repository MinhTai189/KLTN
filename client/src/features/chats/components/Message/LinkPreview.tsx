import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { PreviewLink } from "models"

interface Props {
    dataLink: PreviewLink
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderRadius: '0 0 10px 10px',
        overflow: 'hidden',

        '& img': {
            width: '100%',
            maxHeight: 200,
            objectFit: 'cover',
        },

        '& .detail': {
            padding: theme.spacing(1),
            background: '#d7d7d7',

            '& .title': {
                fontSize: '1.1rem',
                fontWeight: 500
            },

            '& .desc': {
                fontSize: '0.85rem',
                lineHeight: 1.3,
                color: theme.palette.text.secondary
            },

            '& .domain': {
                fontSize: '0.9rem'
            }
        }
    }
}))

const LinkPreview = ({ dataLink }: Props) => {
    const classes = useStyles()

    const { url, img, title, description, domain } = dataLink

    return (
        <Box className={classes.root}>
            <a href={url || '#'} target='_blank' rel="noreferrer">
                <img src={img} className="thumbnail" alt='' />

                <Box className='detail'>
                    <Typography className='title' variant='h5'>
                        {title}
                    </Typography>

                    <Typography className="desc">
                        {description}
                    </Typography>

                    <Typography className='domain'>
                        {domain}
                    </Typography>
                </Box>
            </a>
        </Box>
    )
}

export default LinkPreview
