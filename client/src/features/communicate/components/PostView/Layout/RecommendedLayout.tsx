import { Box, makeStyles, Typography } from "@material-ui/core"
import { ReactElement } from "react"

interface Props {
    children: ReactElement
    title: string
}

const useStyles = makeStyles({
    root: {
        '& > .title': {
            fontSize: '1.2em',
            fontWeight: 500,
            marginBottom: 16
        },
    }
})

export const RecommendedLayout = ({ children, title }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography
                className='title'
                variant='h3'
            >
                {title}
            </Typography>

            <Box>
                {children}
            </Box>
        </Box>
    )
}
