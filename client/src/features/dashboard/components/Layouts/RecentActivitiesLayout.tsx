import { Box, Paper, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {
    children: any
    label: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1),
        boxShadow: theme.shadows[3],

        '& > .title': {
            fontSize: '1.1rem',
            fontWeight: 300,
            marginBottom: theme.spacing(1),
        },

        '& .body': {
            padding: theme.spacing(0, 1)
        }
    }
}))

const RecentActivitiesLayout = ({ children, label }: Props) => {
    const classes = useStyles()

    return (
        <Paper className={classes.root}>
            <Typography className='title'>
                {label}
            </Typography>

            <Box className="body">
                {children}
            </Box>
        </Paper>
    )
}

export default RecentActivitiesLayout
