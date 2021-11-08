import { Box, Button, makeStyles, Theme, Typography, Avatar } from "@material-ui/core";
import { ReactComponent as Emoij } from 'assets/images/emoij.svg';
import Picker from 'emoji-picker-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CommentLayout } from '../Layout/CommentLayout';

interface Props {
    isRely?: boolean
}

interface Areatext {
    focus: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .user-rely': {
            fontSize: '0.8em',
            marginBottom: 4,
            color: theme.palette.text.secondary
        },

        '& .post-rely': {
            background: '#edeef2',
            padding: theme.spacing(2),
            width: '100%',
            borderRadius: 10,

            '& textarea': {
                width: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                height: 40,
                background: 'transparent',

                '&::-webkit-scrollbar': {
                    width: 0
                }
            },

            '& .controls': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',

                '& .counter': {
                    fontSize: '1em',
                    color: theme.palette.text.hint,
                },

                "& .emoji-wrapper": {
                    position: 'relative',
                    zIndex: 19,
                    height: '1.7em',

                    '& .cover': {
                        position: 'fixed',
                        background: 'transparent',
                        inset: 0
                    },

                    '& svg': {
                        width: '1.7em',
                        height: '1.7em',
                        marginRight: theme.spacing(2.5),
                        cursor: 'pointer'
                    },

                    '& .emoji-picker': {
                        position: 'absolute',
                        bottom: '130%',
                        right: 0
                    }
                },

                '& .MuiButton-root': {
                    textTransform: 'capitalize',
                    padding: theme.spacing(0.5, 3)
                }
            }
        },
    }
}))

export const TypingComment = forwardRef<Areatext, Props>(({ isRely = false }, ref) => {
    const classes = useStyles()
    const areaRef = useRef<HTMLElement>(null)
    const timeout = useRef(0)

    const [value, setValue] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)

    useImperativeHandle(ref, () => ({
        focus: () => {
            timeout.current = window.setTimeout(() => {
                areaRef.current?.focus()
            }, 0)
        }
    }))

    useEffect(() => {
        return window.clearTimeout(timeout.current)
    }, [])

    const handleGrowArea = () => {
        if (areaRef.current) {
            areaRef.current.style.height = "40px";
            areaRef.current.style.height = (areaRef.current.scrollHeight) + "px";
        }
    }

    const onEmojiClick = (e: any, emojiObject: any) => {
        setValue(prev => prev + emojiObject.emoji)
    }

    return (
        <Box
            id='comment'
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

                    <Box className='post-rely'>
                        <textarea
                            placeholder='Hãy viết một vài bình luận...'
                            ref={areaRef as any}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onInput={handleGrowArea}
                        />

                        <Box
                            className='controls'
                            mt={1}
                        >
                            <Typography
                                className='counter'
                                component='small'
                                style={{ color: value.length > 1000 ? '#f44336' : '#00000061' }}
                            >
                                {`${value.length}/1000`}
                            </Typography>

                            <span style={{ flex: 1 }}></span>

                            <span className='emoji-wrapper'>
                                <Emoij onClick={() => setShowEmoji(!showEmoji)} />

                                {showEmoji && <div className="cover" onClick={() => setShowEmoji(false)}></div>}

                                {showEmoji && <span className='emoji-picker'>
                                    <Picker onEmojiClick={onEmojiClick} native />
                                </span>}
                            </span>

                            <Button
                                color='primary'
                                variant='contained'
                                size='small'
                            >
                                Đăng
                            </Button>
                        </Box>
                    </Box>
                </>
            </CommentLayout>
        </Box>
    )
})
