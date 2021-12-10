import { Box, Paper, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {
    children: any
    label: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& > .label': {
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: theme.spacing(1),
        },

        '& .wrapper': {
            padding: theme.spacing(0.5)
        }
    }
}))

const ApproveLayout = ({ children, label }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography
                className='label'
                variant='h3'
            >
                {label}
            </Typography>

            <Paper className='wrapper'>
                {children}
            </Paper>
        </Box>
    )
}

export default ApproveLayout
