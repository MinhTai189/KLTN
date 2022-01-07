import { Box, makeStyles, Theme } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeContent: 'center',
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 200,

        '& .loading': {
            position: 'relative',
            width: 80,
            height: 80,
            outline: `5px solid ${theme.palette.primary.main}`,
            overflow: 'hidden',
            animation: '$spin 3s ease infinite',

            '&::after': {
                content: '""',
                position: 'absolute',
                top: 2,
                left: 2,
                width: '95%',
                height: '95%',
                backgroundColor: theme.palette.primary.light,
                transformOrigin: 'center bottom',
                transform: 'scaleY(1)',
                animation: '$fill 3s linear infinite',
            }
        },
    },
    "@keyframes spin": {
        '50%, 100%': {
            transform: 'rotate(360deg)'
        },
    },
    '@keyframes fill': {
        '25%, 50%': {
            transform: 'scaleY(0)'
        },
        '100%': {
            transform: 'scaleY(1)'
        }
    }
}))

const GlobalLoading = () => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className="loading">

            </Box>
        </Box>
    )
}

export default GlobalLoading
