import { Box, Divider, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import ListOnline from "./ListOnline"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1.5),
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',

        '& *::-webkit-scrollbar': {
            width: 6,
            background: 'transparent',
        },

        '& .title': {
            fontSize: '1.1rem',
            fontWeight: 500,
            marginBottom: theme.spacing(0.5)
        },

        '& .container-wrapper': {
            width: '100%',
            height: '100%'
        }
    }
}))

const OnlineSection = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography className='title' variant='h5'>
                Danh sách thành viên đang trực tuyến
            </Typography>

            <Divider />

            <Box className="container-wrapper">
                <ListOnline />
            </Box>
        </Box>
    )
}

export default OnlineSection
