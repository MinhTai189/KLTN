import { Box, Grid, Theme, Tooltip, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {
    labelLeft: string
    contentLeft: string
    titleContentLeft?: string
    labelRight?: string
    contentRight?: string
    titleContentRight?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: theme.spacing(1.2),

        '& .row-content': {
            fontSize: '0.9rem'
        }
    }
}))

const AddRowContent = ({ labelLeft, contentLeft, titleContentLeft, labelRight, contentRight, titleContentRight }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item sm={6}>
                    <Tooltip title={titleContentLeft ?? ''} arrow>
                        <Typography className="row-content" >
                            {labelLeft}:&#xa0;&#xa0;&#xa0;{contentLeft}
                        </Typography>
                    </Tooltip>
                </Grid>

                {labelRight && <Grid item sm={6}>
                    <Tooltip title={titleContentRight ?? ''} arrow>
                        <Typography className="row-content">
                            {labelRight}:&#xa0;&#xa0;&#xa0;{contentRight}
                        </Typography>
                    </Tooltip>
                </Grid>}
            </Grid>
        </Box>
    )
}

export default AddRowContent
