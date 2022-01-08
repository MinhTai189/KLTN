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
            <ul className="list-gif">
                {new Array(10).fill(1).map((_, index) => (
                    <li className="gif">
                        <img src="https://res.cloudinary.com/dpregsdt9/image/upload/v1641037503/gif/giphy_4_dbwroe.webp" alt="gif image" />
                    </li>
                ))}
            </ul>
        </Box>
    )
}

export default GifSelector
