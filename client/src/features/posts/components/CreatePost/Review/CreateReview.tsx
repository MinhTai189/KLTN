import { Box, Button, CircularProgress, makeStyles, Theme } from '@material-ui/core'
import { useAppSelector } from 'app/hooks'
import { BalloonCKEditor } from 'components/Common'
import { selectLoadingPost } from 'features/posts/postSlice'
import { selectDataMotel, selectLoadingMotel } from 'features/motels/motelSlice'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { checkCommaLastString, mapTrimStringArray } from 'utils'
import { AutocompleteMotel } from '../FindRommate/AutocompleteMotel'
import { DataPost, DataPostFinal } from '../models/create-post'
import { TagInput } from '../TagInput'

interface Props {
    handleCreateReview: (data: DataPostFinal) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(12),
        width: '100%',
        maxWidth: 800,
        margin: 'auto',

        '& .title-input': {
            width: '100%',
            resize: 'none',
            padding: theme.spacing(1),
            fontSize: '1.6rem',
            border: 'none',
            outline: 'none',
            borderLeft: '1.5px solid transparent',
            fontWeight: 500,

            '&:focus': {
                borderLeft: '1.5px solid',
            }
        },

        '& .tags-wrapper': {
            marginBlock: theme.spacing(1.5),

            '& > .label': {
                fontSize: '1rem',
                marginBottom: theme.spacing(0.7),
            }
        },

        '& .ck-content': {
            paddingLeft: 8,
            minHeight: 400,
            fontSize: 17,
            lineHeight: '25px',

            '& > ul, & > ol': {
                listStyleType: 'inherit',
                listStylePosition: 'inside',
                fontSize: 17,
                marginTop: 6,
                paddingLeft: 12
            },

            '& > ol': {
                listStyleType: 'decimal',
            }
        },
        '& .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused': {
            borderColor: 'transparent',
            boxShadow: 'none'
        }
    }
}))

export const CreateReview = ({ handleCreateReview }: Props) => {
    const classes = useStyles()
    const areaRef = useRef<HTMLAreaElement>(null)
    const loadingCreateReview = useAppSelector(selectLoadingPost)

    const listMotel = useAppSelector(selectDataMotel)
    const loading = useAppSelector(selectLoadingMotel)
    const [reviewData, setReviewData] = useState<DataPost>({
        title: '',
        tags: {
            input: '',
            suggest: [],
        },
        motel: undefined,
        content: ''
    })

    const handleGrowArea = () => {
        if (areaRef.current) {
            areaRef.current.style.height = "96px";
            areaRef.current.style.height = (areaRef.current.scrollHeight) + "px";
        }
    }

    const handleSubmit = () => {
        const { title, tags, motel, content } = reviewData
        let errMessage = 'Hãy bổ sung đầy đủ thông tin: '

        if (title.trim() === '')
            errMessage += 'Tiêu đề bài viết,'
        if (content === '')
            errMessage += 'Nội dung bài viết,'
        if (motel === undefined)
            errMessage += 'Chọn một nhà trọ bạn muốn đánh giá'

        if (errMessage !== 'Hãy bổ sung đầy đủ thông tin: ') {
            toast.error(errMessage)
            return
        }

        const submitData: any = {
            ...reviewData,
            title: title.trim(),
            tags: `${checkCommaLastString(tags.input)}${mapTrimStringArray(tags.suggest).join(',')}`,
            subjectId: '6173ba553c954151dcc8fdf9',
            motel: motel ? motel._id : ''
        }

        handleCreateReview(submitData)
    }

    return (
        <Box className={classes.root}>
            <textarea
                className='title-input'
                placeholder='Nhập tiêu đề vào đây...'
                ref={areaRef as any}
                onInput={handleGrowArea}
                value={reviewData.title}
                onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
            />

            <BalloonCKEditor
                value={reviewData.content}
                onChange={(data: string) => setReviewData(prev => ({ ...prev, content: data }))}
            />

            <Box className='tags-wrapper'>
                <label className='label'>
                    Chọn một nhà trọ bạn muốn đánh giá:
                </label>

                <AutocompleteMotel
                    listMotel={listMotel}
                    value={reviewData.motel}
                    onChange={(e, value) => setReviewData(prev => ({ ...prev, motel: value || undefined }))}
                    loading={loading}
                />
            </Box>

            <Box className='tags-wrapper'>
                <label className='label'>
                    Tag cho bài để người khác biết bài viết về gì (ngăn cách bằng dấu phẩy):
                </label>

                <TagInput
                    placeHolder='Nhập tag(VD: danhgianhatro,anninh)'
                    input={reviewData.tags.input}
                    setInput={(e) => setReviewData((prev: DataPost) => ({ ...prev, tags: { ...prev.tags, input: e.target.value } }))}
                    suggest={reviewData.tags.suggest}
                    setSuggest={(e) => setReviewData((prev: DataPost) => ({ ...prev, tags: { ...prev.tags, suggest: e.target.value } }))}
                    typePost='review'
                />
            </Box>

            <Button
                color='primary'
                variant='contained'
                fullWidth
                size='large'
                onClick={handleSubmit}
            >
                {loadingCreateReview && <><CircularProgress color='secondary' size={15} /> &nbsp;</>}
                Đăng
            </Button>
        </Box>
    )
}
