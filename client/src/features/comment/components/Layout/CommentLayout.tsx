import { Box, Theme, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactElement } from 'react'
import { TotalAction } from '../../../posts/components/PostView/Common/TotalAction'

interface Props {
    children?: ReactElement
    subcomment?: ReactElement
    avatar?: ReactElement
    totalAction?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '& > .avatar': {
            width: '2em',
            height: '2em',
            marginRight: theme.spacing(1.5)
        },

        '& .left-col': {
            width: '100%',
        }
    }
}))

export const CommentLayout = ({
    children, totalAction = false, subcomment, avatar }: Props) => {
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
