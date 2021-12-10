import { Box, makeStyles, Theme } from "@material-ui/core"
import { ApproveMotelSection } from "features/approves/components"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))

const ApprovePage = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <ApproveMotelSection />
        </Box>
    )
}

export default ApprovePage
