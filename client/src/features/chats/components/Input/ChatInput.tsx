import { Box, Button, IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import { Image, Send } from "@material-ui/icons";
import { ReactComponent as Emoij } from 'assets/images/emoij.svg';
import { ReactComponent as Gif } from 'assets/images/gif-icon.svg';
import { DetectClickOutsize } from "components/Common/DetectClickOutsize";
import { VALIDATOR_IMAGE } from "constant/constant";
import Picker from 'emoji-picker-react';
import { useRef, useState } from "react";
import GifSelector from './GifSelector'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1, 0),
        borderTop: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',

        '& .controls': {
            padding: theme.spacing(0, 0.7, 1.5),
            alignSelf: 'flex-end',

            '& .control': {
                minWidth: 'unset',

                '& svg': {
                    height: 22,
                }
            },

            '& .gif-wrapper': {
                position: 'relative'
            }
        },

        '& .input': {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${theme.palette.primary.dark}`,
            background: '#c4d9e9',
            height: 'fit-content',
            padding: theme.spacing(1, 1.5),
            borderRadius: 5,
            gap: theme.spacing(1),

            '& .textarea': {
                flex: 1,
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1rem',
                height: 26,
                maxHeight: 202,
            },

            '& .emoji-wrapper': {
                position: 'relative',
                width: 22,
                height: 22,
                alignSelf: 'flex-end',


                '& svg': {
                    width: 22,
                    height: 22,
                    cursor: 'pointer',
                    zIndex: 10
                },

                '& .emoji-picker': {
                    position: 'absolute',
                    bottom: '130%',
                    right: 0
                }
            }
        }
    }
}))

const ChatInput = (props: Props) => {
    const classes = useStyles()
    const [showEmoji, setShowEmoji] = useState(false)
    const [showGifSelector, setShowGifSelector] = useState(false)

    const addImgInputRef = useRef<HTMLInputElement>(null)
    const areaRef = useRef<HTMLAreaElement>(null)

    const handleGrowArea = () => {
        if (areaRef.current) {
            areaRef.current.style.height = '26px'
            areaRef.current.style.height = (areaRef.current.scrollHeight) + "px";
        }
    }

    const handleOpenFileInput = () => {
        if (addImgInputRef.current)
            addImgInputRef.current.click()
    }

    return (
        <Box className={classes.root}>
            <Box className="controls" component='span'>
                <Tooltip title='Chèn ảnh'>
                    <Button className='control' onClick={handleOpenFileInput}>
                        <Image color='primary' />
                    </Button>
                </Tooltip>

                <Box className="gif-wrapper" component='span'>
                    <Tooltip title='Chèn ảnh GIF'>
                        <Button
                            className='control'
                            onClick={() => setShowGifSelector(true)}
                        >
                            <Gif />
                        </Button>
                    </Tooltip>

                    {showGifSelector && <DetectClickOutsize cb={() => setTimeout(() => setShowGifSelector(false), 100)}>
                        <GifSelector />
                    </DetectClickOutsize>}
                </Box>
            </Box>

            <Box className="input" component='span'>
                <textarea
                    ref={areaRef as any}
                    className="textarea"
                    rows={1}
                    placeholder="Nhập tin nhắn vào đây..."
                    onInput={handleGrowArea}
                />

                <span className='emoji-wrapper'>
                    <Emoij onClick={() => setShowEmoji(!showEmoji)} />

                    {showEmoji && <DetectClickOutsize cb={() => setTimeout(() => setShowEmoji(false), 100)}>
                        <span className='emoji-picker'>
                            <Picker onEmojiClick={() => { }} native />
                        </span>
                    </DetectClickOutsize>}
                </span>
            </Box>

            <IconButton className='btn-submit' color="primary">
                <Send fontSize="large" />
            </IconButton>

            <input
                style={{
                    position: 'fixed',
                    top: '-100em'
                }}
                ref={addImgInputRef as any}
                type="file"
                title=""
                accept={VALIDATOR_IMAGE.accept}
            />
        </Box>
    )
}

export default ChatInput
