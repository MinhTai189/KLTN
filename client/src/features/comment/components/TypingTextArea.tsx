import { Box, Button, makeStyles, Theme, Typography } from "@material-ui/core";
import { ReactComponent as Emoij } from 'assets/images/emoij.svg';
import Picker from 'emoji-picker-react';
import { ChangeEvent, useEffect, useRef, useState } from "react";


interface Props {
    showBtnSubmit?: boolean
    placeHolder?: string
    value: string
    setValue: (state: string) => void
    isComment?: boolean
    handleTypingData: (isComment: boolean) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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
                padding: theme.spacing(0.5, 3),
                marginLeft: theme.spacing(2.5),
            }
        }
    },
}))

export const TypingTextArea =
    ({ showBtnSubmit = true,
        placeHolder = 'Hãy viết một vài bình luận...',
        value,
        setValue,
        isComment = false,
        handleTypingData
    }: Props) => {
        const classes = useStyles()
        const [showEmoji, setShowEmoji] = useState(false)
        const areaRef = useRef<HTMLElement>(null)

        const timeout = useRef(0)

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
            setValue(value + emojiObject.emoji)
        }

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            setValue(e.target.value)
        }

        return (
            <Box className={classes.root}>
                <textarea
                    placeholder={placeHolder}
                    ref={areaRef as any}
                    value={value}
                    onChange={handleChange}
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

                    {showBtnSubmit && <Button
                        color='primary'
                        variant='contained'
                        size='small'
                        onClick={() => handleTypingData(isComment)}
                    >
                        Đăng
                    </Button>}
                </Box>
            </Box>
        )
    }
