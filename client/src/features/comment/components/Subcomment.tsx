import { makeStyles, Avatar, Box, Theme } from '@material-ui/core'
import { useState, useRef } from 'react'
import { CommentLayout } from '.'
import { CommentBody } from './CommentBody'
import { TypingComment } from './TypingComment'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}))

export const Subcomment = (props: Props) => {
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
                        sizeAction='small'
                        positionAction='left'
                    />

                    {/* {typing && <TypingComment isRely ref={inputRef} />} */}
                </>
            </CommentLayout>
        </Box>
    )
}
