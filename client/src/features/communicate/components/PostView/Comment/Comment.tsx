import { Avatar, Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useRef, useState } from 'react'
import { CommentBody } from './CommentBody'
import { CommentLayout } from '../Layout/CommentLayout'
import { ListSubComment } from './ListSubComent'
import { TypingComment } from './TypingComment'

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}))

export const Comment = ({ }: Props) => {
    const classes = useStyles()
    const [typing, setTyping] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleRely = () => {
        setTyping(!typing)
        inputRef.current?.focus()
    }

    return (
        <Box
            className={classes.root}
            my={2}
        >
            <CommentLayout
                totalAction={true}
                avatar={<Avatar
                    className='avatar'
                // src={}
                >
                    U
                </Avatar>}
            >
                <>
                    <CommentBody
                        typing={typing}
                        handleRely={handleRely}
                    />

                    {typing && <TypingComment isRely ref={inputRef} />}

                    <ListSubComment />
                </>
            </CommentLayout>
        </Box>
    )
}
