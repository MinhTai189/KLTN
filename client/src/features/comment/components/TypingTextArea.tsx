import { Box, Button, makeStyles, Theme, Typography } from "@material-ui/core";
import { ReactComponent as Emoij } from 'assets/images/emoij.svg';
import { DetectClickOutsize } from "components/Common/DetectClickOutsize";
import Picker from 'emoji-picker-react';
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";


interface Props {
    showBtnSubmit?: boolean
    placeHolder?: string
    handleSubmit?: () => void
    ref: Ref<HTMLTextAreaElement>
}

interface TextAreaRef {
    getValue: () => string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: '#edeef2',
        padding: theme.spacing(2),
        width: '100%',
        borderRadius: 10,

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1.5),
        },

        '& textarea': {
            width: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            height: 40,
            background: 'transparent',
            lineHeight: 1.5,

            '&::-webkit-scrollbar': {
                width: 0
            },

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.775rem'
            },
        },

        '& .controls': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',

            [theme.breakpoints.down('xs')]: {
                alignItems: 'flex-end'
            },

            '& .counter': {
                fontSize: '1em',
                color: theme.palette.text.hint,

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.85em'
                },
            },

            "& .emoji-wrapper": {
                position: 'relative',
                zIndex: 19,
                height: '1.7em',

                '& svg': {
                    width: '1.7em',
                    height: '1.7em',
                    cursor: 'pointer',

                    [theme.breakpoints.down('xs')]: {
                        height: '1.5em',
                        width: '1.5em',
                    },
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

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.7rem',
                    padding: theme.spacing(0.4, 0.8),
                    marginLeft: theme.spacing(1.5),
                },
            }
        }
    },
}))

export const TypingTextArea =
    forwardRef<TextAreaRef, Props>(({ showBtnSubmit = true,
        placeHolder = 'H??y vi???t m???t v??i b??nh lu???n...',
        handleSubmit
    }, ref) => {
        const classes = useStyles()
        const [showEmoji, setShowEmoji] = useState(false)
        const [value, setValue] = useState('')

        const areaRef = useRef<HTMLTextAreaElement>(null)

        useEffect(() => {
            return () => {
                setValue('')

                if (areaRef.current)
                    areaRef.current.value = ''
            }
        }, [])

        useImperativeHandle(ref, () => ({
            getValue: () => areaRef.current?.value || '',
            resetValue: () => {
                if (areaRef.current) {
                    areaRef.current.value = ''
                    areaRef.current.style.height = "40px";
                }
            }
        }))

        const handleGrowArea = () => {
            if (areaRef.current) {
                areaRef.current.style.height = "40px";
                areaRef.current.style.height = (areaRef.current.scrollHeight) + "px";
            }
        }

        const onEmojiClick = (e: any, emojiObject: any) => {
            const value = areaRef.current?.value

            if (areaRef.current) {
                areaRef.current.value = value + emojiObject.emoji
            }
        }

        return (
            <Box className={classes.root}>
                <textarea
                    placeholder={placeHolder}
                    ref={areaRef as any}
                    onChange={(e) => setValue(e.target.value)}
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

                        {showEmoji && <DetectClickOutsize cb={() => setTimeout(() => setShowEmoji(false), 100)}>
                            <span className='emoji-picker'>
                                <Picker onEmojiClick={onEmojiClick} native />
                            </span>
                        </DetectClickOutsize>}
                    </span>

                    {showBtnSubmit && <Button
                        className="btn-submit"
                        color='primary'
                        variant='contained'
                        size='small'
                        onClick={handleSubmit}
                    >
                        ????ng
                    </Button>}
                </Box>
            </Box>
        )
    })
