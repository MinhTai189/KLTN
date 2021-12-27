import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactElement } from 'react'

interface Props {
    children?: ReactElement
    avatar?: ReactElement
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '& > .avatar': {
            width: '2em',
            height: '2em',
            marginRight: theme.spacing(1.5),

            [theme.breakpoints.down('xs')]: {
                width: '1.75em',
                height: '1.75em',
                marginRight: theme.spacing(1),
            },
        },

        '& .left-col': {
            width: '100%',
        }
    }
}))

export const CommentLayout = ({ children, avatar }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root} >
            {avatar}

            <Box className="left-col">
                {children}
            </Box>
        </Box >
    )
}
