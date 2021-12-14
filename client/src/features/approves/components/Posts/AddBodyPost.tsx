import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import AddRowContent from '../common/AddRowContent'

interface Props {

}

const useStyles = makeStyles((them: Theme) => ({
    root: {}
}))

const AddBodyPost = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <AddRowContent />
            <AddRowContent />
            <AddRowContent />
        </Box>
    )
}

export default AddBodyPost
