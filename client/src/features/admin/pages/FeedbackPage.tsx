import { Box, makeStyles, Theme } from "@material-ui/core"
import FeedbackTable from "../components/Feedback/FeedbackTable"

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}))

const FeedbackPage = () => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <FeedbackTable />
        </Box>
    )
}

export default FeedbackPage
