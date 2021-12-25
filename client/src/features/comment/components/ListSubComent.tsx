import { Box, makeStyles, Theme, Typography } from "@material-ui/core"
import { ReplingComment } from "models"
import { memo } from "react"
import { Subcomment } from "./Subcomment"

interface Props {
    listReply: ReplingComment[]
    totalReply: number
    currentReply: number
    handleLoadMoreReply: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: 16,
        borderLeft: '1px solid #cecece',

        [theme.breakpoints.down('xs')]: {
            paddingLeft: 6
        },

        '& .load-more': {
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '0.7725em',
            transition: '300ms',

            '&:hover': {
                color: theme.palette.primary.main
            }
        }
    }
}))

export const ListSubComment = memo(({ listReply, totalReply, currentReply, handleLoadMoreReply }: Props) => {
    const classes = useStyles()

    const calcRemainReply = () => {
        if (totalReply / (5 * (currentReply + 1)) < 1)
            return totalReply % (5 * currentReply)

        return 5
    }

    return (
        <Box className={classes.root}>
            {5 * currentReply < totalReply && <Typography
                className='load-more'
                onClick={handleLoadMoreReply}
            >
                Xem thêm {calcRemainReply()} bình luận cũ hơn
            </Typography>}

            <ul>
                {listReply && listReply.map(reply => {
                    return (<li key={reply._id}>
                        <Subcomment replyData={reply} />
                    </li>)
                })}
            </ul>
        </Box>
    )
})
