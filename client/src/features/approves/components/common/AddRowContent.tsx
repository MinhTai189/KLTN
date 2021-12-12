import { Box, Grid, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: theme.spacing(1.2),

        '& .row-content': {
            fontSize: '0.9rem'
        }
    }
}))

const AddRowContent = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item sm={6}>
                    <Typography className="row-content">
                        Tiêu đề:&#xa0;&#xa0;&#xa0;This is a title
                    </Typography>
                </Grid>

                <Grid item sm={6}>
                    <Typography className="row-content">
                        Giá:&#xa0;&#xa0;&#xa0;800k/tháng
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddRowContent
