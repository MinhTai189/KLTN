import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}))

const GifSelector = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>

        </Box>
    )
}

export default GifSelector
