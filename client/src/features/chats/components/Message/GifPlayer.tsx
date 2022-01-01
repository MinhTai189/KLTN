import { Box, makeStyles, Theme } from '@material-ui/core'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 'fit-content',
        height: 'fit-content',
    }
}))

const GifPlayer = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <img className='gif' src="https://media3.giphy.com/media/peQSglDPSoUfhFcqeR/200.webp" alt="gif image" />
        </Box>
    )
}

export default GifPlayer
