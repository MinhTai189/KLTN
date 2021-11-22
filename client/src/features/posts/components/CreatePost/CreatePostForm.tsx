import { Box, Button, CircularProgress, TextField, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useAppSelector } from "app/hooks"
import { TypingTextArea } from "features/comment/components"
import { selectLoadingPost } from "features/posts/postSlice"
import { Motel } from "models"
import { ChangeEvent } from "react"
import { DataPost } from "./models/create-post"
import { Requirements } from "./Requirements"
import { TagInput } from "./TagInput"

interface Props {
    dataPost: DataPost
    setDataPost: (state: any) => void
    handleSubmit: (e: ChangeEvent<HTMLFormElement>) => void
    typePost: 'find-motel' | 'find-roommate'
    listMotel?: Motel[]
    errSchools?: string
    errMotel?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .input-label': {
            fontSize: '0.85rem',
            fontWeight: 500
        },

        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000',
            borderWidth: 1
        },

        '& .main-container': {
            display: 'flex',
            gap: 15,

            '& .left-col': {
                flex: 1,
            },

            '& .right-col': {
                flex: 1,
            }
        },

        '& .content-wrapper': {
            '& > .MuiBox-root': {
                borderRadius: 4,
                background: '#fff',
                border: `1px solid rgba(0, 0, 0, 0.23)`,
                fontSize: '1rem',

                "&:hover": {
                    borderColor: '#000'
                }
            }
        }
    }
}))

export const CreatePostForm = ({ dataPost, setDataPost, handleSubmit, typePost, listMotel, errSchools, errMotel }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingPost)

    return (
        <form
            className={classes.root}
            onSubmit={handleSubmit}
        >
            <Box className='main-container'>
                <div className="left-col">
                    <Box mb={2}>
                        <label className='input-label'>Tiêu đề*</label>

                        <TextField
                            className='name-post'
                            id='name-post'
                            name='title'
                            placeholder='Nhập tiêu đề bài viết'
                            fullWidth
                            size='small'
                            variant='outlined'
                            value={dataPost.title}
                            onChange={(e) => setDataPost((prev: DataPost) => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </Box>

                    <Box my={2}>
                        <label className='input-label'>Tag cho bài để người khác biết bài viết về gì (ngăn cách bằng dấu phẩy)</label>

                        <TagInput
                            placeHolder='Nhập tag(VD: anninh,yentinh)'
                            input={dataPost.tags.input}
                            setInput={(e) => setDataPost((prev: DataPost) => ({ ...prev, tags: { ...prev.tags, input: e.target.value } }))}
                            suggest={dataPost.tags.suggest}
                            setSuggest={(e) => setDataPost((prev: DataPost) => ({ ...prev, tags: { ...prev.tags, suggest: e.target.value } }))}
                            typePost={typePost}
                        />
                    </Box>
                </div>

                <div className="right-col">
                    <Requirements
                        dataPost={dataPost}
                        setDataPost={setDataPost}
                        typePost={typePost}
                        listMotel={listMotel}
                        errSchools={errSchools}
                        errMotel={errMotel}
                    />
                </div>
            </Box>

            <Box className='content-wrapper' mb={2}>
                <label className='input-label'>Nội dung</label>

                {/* <TypingTextArea
                    showBtnSubmit={false}
                    placeHolder='Hãy viết nội dung bạn muốn đăng...'
                    value={dataPost.content}
                    setValue={(value: string) => setDataPost((prev: DataPost) => ({ ...prev, content: value }))}
                /> */}
            </Box>

            <Box my={3}>
                <Button fullWidth type='submit' variant='contained' color='primary' size='large'>
                    {loading && <><CircularProgress color='secondary' size={15} /> &nbsp;</>}
                    Đăng
                </Button>
            </Box>
        </form>
    )
}
