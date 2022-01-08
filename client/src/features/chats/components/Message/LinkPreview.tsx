import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {

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

const LinkPreview = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <a href="https://youtube.com">
                <img src="https://external.xx.fbcdn.net/safe_image.php?d=AQExrCwqb1B7HE9t&w=300&h=157&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FUgsB6fONvLc%2Fmaxresdefault.jpg&cfs=1&ext=emg0&_nc_oe=6f5b5&_nc_sid=06c271&ccb=3-5&gt=1&_nc_hash=AQFjp9L8UeMdFsjN" className="thumbnail" />

                <Box className='detail'>
                    <Typography className='title' variant='h5'>
                        Quá Ghê Và Đây Là Florentino
                    </Typography>

                    <Typography className="desc">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, dolore doloremque soluta provident, fuga unde eaque laborum impedit vero corrupti quam! Nobis aliquid laudantium accusantium deserunt quis hic consequatur animi?
                    </Typography>

                    <Typography className='domain'>
                        youtube.com
                    </Typography>
                </Box>
            </a>
        </Box>
    )
}

export default LinkPreview
