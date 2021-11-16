import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core";
import { forwardRef } from "react";
import { CommentLayout } from '../Layout/CommentLayout';
import { TypingTextArea } from "./TypingTextArea";

interface Props {
    isRely?: boolean
    ref: any
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .user-rely': {
            fontSize: '0.8em',
            marginBottom: 4,
            color: theme.palette.text.secondary
        },
    }
}))

export const TypingComment = forwardRef<any, Props>(({ isRely = false }, ref) => {
    const classes = useStyles()

    return (
        <Box
            className={classes.root}
            mt={2}
            mb={3}
        >
            <CommentLayout avatar={<Avatar
                className='avatar'
            // src={}
            >
                U
            </Avatar>}
            >
                <>
                    {isRely && <Typography className='user-rely'>
                        Bạn đang trả lời Tran Minh Tai ...
                    </Typography>}

                    {/* <TypingTextArea 
                    ref={ref}
                    /> */}
                </>
            </CommentLayout>
        </Box>
    )
})
