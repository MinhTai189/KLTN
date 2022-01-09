import { Box, makeStyles, Theme } from '@material-ui/core'

interface Props {
    gif: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 'fit-content',
        height: 'fit-content',
        marginBottom: theme.spacing(1)
    }
}))

const GifPlayer = ({ gif }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <img className='gif' src={gif} alt="gif image" loading='lazy' />
        </Box>
    )
}

export default GifPlayer
