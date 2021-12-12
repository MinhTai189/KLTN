import { Box, makeStyles, Theme } from "@material-ui/core"
import { MainLayout } from "components/Layouts"
import AddPage from "features/admin/pages/AddPage"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(10)
    }
}))

const AddMotelPage = (props: Props) => {
    const classes = useStyles()

    return (
        <MainLayout>
            <Box className={classes.root}>
                <AddPage />
            </Box>
        </MainLayout>
    )
}

export default AddMotelPage
