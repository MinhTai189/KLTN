import { Box, Button, IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import { Image, Send } from "@material-ui/icons";
import { useAppDispatch } from "app/hooks";
import { ReactComponent as Emoij } from 'assets/images/emoij.svg';
import { ReactComponent as Gif } from 'assets/images/gif-icon.svg';
import { DetectClickOutsize } from "components/Common/DetectClickOutsize";
import { TYPE_MESSAGE, VALIDATOR_IMAGE } from "constant/constant";
import Picker from 'emoji-picker-react';
import { chatActions } from "features/chats/chatSlice";
import { useUpload } from "hooks";
import { AddChatMessage } from "models";
import { ChangeEvent, KeyboardEventHandler, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { checkSizeOneImg } from "utils";
import GifSelector from './GifSelector';

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

const checkSelectedImages = (files: FileList) => {
    let haveLargeImg = 0
    const filteredFiles: File[] = []

    Array.from(files).forEach(file => {
        if (!checkSizeOneImg(file, 1000)) {
            haveLargeImg++
            return
        }

        filteredFiles.push(file)
    })

    return { filteredFiles, haveLargeImg }
}

const ChatInput = (props: Props) => {
    const classes = useStyles()
    const { upload } = useUpload()

    const { groupId } = useParams<{ groupId: string }>()
    const dispatch = useAppDispatch()

    const addImgInputRef = useRef<HTMLInputElement>(null)
    const areaRef = useRef<any>(null)

    const [showEmoji, setShowEmoji] = useState(false)
    const [showGifSelector, setShowGifSelector] = useState(false)
    const [inputContent, setInputContent] = useState('')

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

    const handleSelectedEmoji = (e: any, emojiObject: any) => {
        setInputContent(prev => `${prev} ${emojiObject.emoji}`)
    }

    const handleAddMessage = (body: object) => {
        dispatch(chatActions.addChatMessage({
            ...body,
            groupId
        } as AddChatMessage))
    }

    const handleTextLinkChatMessage = () => {
        if (!inputContent) return

        handleAddMessage({
            type: TYPE_MESSAGE.text,
            content: inputContent
        })

        setInputContent('')

        if (areaRef.current) {
            setTimeout(() => {
                areaRef.current.setAttribute('style', '');
                areaRef.current.value = "";
            }, 0)
        }
    }

    const triggerEnterInput = (e: any) => {
        const key = e.key

        if (key === 'Enter') {
            handleTextLinkChatMessage()
            e.preventDefault()
        }
    }

    const handleSelectImages = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const { filteredFiles, haveLargeImg } = checkSelectedImages(e.target.files)

        if (haveLargeImg) toast.info(`
            Ảnh bạn đã lựa chọn tồn tại ${haveLargeImg} ảnh có thước lớn hơn 1MB!
            Ảnh có kích thước lớn hơn 1MB sẽ tự động bị bỏ qua.
        `)

        try {
            const uploadData = await upload(filteredFiles, 'chat')

            handleAddMessage({
                type: TYPE_MESSAGE.image,
                urlImages: uploadData
            })
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    const handleSelectGif = (gif: string) => {
        handleAddMessage({
            type: TYPE_MESSAGE.gif,
            urlGif: gif
        })

        setShowGifSelector(false)
    }

    return (
        <Box className={classes.root}>
            <Box className="controls" component='span'>
                <Tooltip title='Chèn ảnh(1 ảnh kích thước tối đa 1MB, tối đa 10 ảnh)'>
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
                        <GifSelector onChange={handleSelectGif} />
                    </DetectClickOutsize>}
                </Box>
            </Box>

            <Box className="input" component='span'>
                <textarea
                    ref={areaRef as any}
                    className="textarea"
                    rows={1}
                    placeholder="Nhập tin nhắn vào đây..."
                    value={inputContent}
                    onChange={e => setInputContent(e.target.value)}
                    onInput={handleGrowArea}
                    onKeyPress={triggerEnterInput}
                />

                <span className='emoji-wrapper'>
                    <Emoij onClick={() => setShowEmoji(!showEmoji)} />

                    {showEmoji && <DetectClickOutsize cb={() => setTimeout(() => setShowEmoji(false), 100)}>
                        <span className='emoji-picker'>
                            <Picker onEmojiClick={handleSelectedEmoji} native />
                        </span>
                    </DetectClickOutsize>}
                </span>
            </Box>

            <IconButton
                className='btn-submit'
                color="primary"
                onClick={handleTextLinkChatMessage}
            >
                <Send fontSize="large" />
            </IconButton>

            <input
                style={{
                    position: 'fixed',
                    top: '-100em'
                }}
                ref={addImgInputRef as any}
                type="file"
                multiple
                title=""
                accept={VALIDATOR_IMAGE.accept}
                onChange={handleSelectImages}
            />
        </Box>
    )
}

export default ChatInput
