import { Box, Button, CircularProgress, makeStyles, Theme, Typography } from '@material-ui/core'
import { useAppSelector } from 'app/hooks'
import { BalloonCKEditor } from 'components/Common'
import { selectLoadingPost } from 'features/posts/postSlice'
import { selectDataMotel, selectLoadingMotel } from 'features/motels/motelSlice'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { checkCommaLastString, mapTrimStringArray } from 'utils'
import { AutocompleteMotel } from '../FindRommate/AutocompleteMotel'
import { DataPost, DataPostFinal } from '../models/create-post'
import { TagInput } from '../TagInput'
import { checkTags } from 'utils/check-valid/checkTag'
import SmallScreen from 'assets/images/small-screen.jpg'
import postApi from 'api/post'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(12),
        width: '100%',
        maxWidth: 800,
        margin: 'auto',

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(0, 6),
        },

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
    },
    msgInfor: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: theme.spacing(1),

        '& > img': {
            width: '65%'
        },

        '& .text': {
            textAlign: 'center',
            marginBottom: theme.spacing(2),
            fontSize: '0.9rem'
        }
    }
}))

const initialDataPost: DataPost = {
    title: '',
    tags: {
        input: '',
        suggest: [],
    },
    motel: undefined,
    content: ''
}

export const CreateReview = () => {
    const classes = useStyles()
    const history = useHistory()

    const areaRef = useRef<HTMLAreaElement>(null)
    const loadingCreateReview = useAppSelector(selectLoadingPost)
    const [isHidden, setIsHidden] = useState(false)

    const listMotel = useAppSelector(selectDataMotel)
    const loading = useAppSelector(selectLoadingMotel)
    const [reviewData, setReviewData] = useState<DataPost>(initialDataPost)

    useEffect(() => {
        const detectSmallScreen = () => {
            if (window.innerWidth < 600) {
                setIsHidden(true)
                return
            }

            setIsHidden(false)
        }

        detectSmallScreen()

        window.addEventListener('resize', detectSmallScreen)

        return () => {
            window.removeEventListener('resize', detectSmallScreen)
        }
    }, [])

    const handleGrowArea = () => {
        if (areaRef.current) {
            areaRef.current.style.height = "96px";
            areaRef.current.style.height = (areaRef.current.scrollHeight) + "px";
        }
    }

    const handleSubmit = () => {
        const { title, tags, motel, content } = reviewData
        let errMessage = 'H??y b??? sung ?????y ????? th??ng tin: '

        if (title.trim() === '')
            errMessage += 'Ti??u ????? b??i vi???t,'
        if (content === '')
            errMessage += 'N???i dung b??i vi???t,'
        if (motel === undefined)
            errMessage += 'Ch???n m???t nh?? tr??? b???n mu???n ????nh gi??'

        if (errMessage !== 'H??y b??? sung ?????y ????? th??ng tin: ') {
            toast.error(errMessage)
            return
        }

        if (!checkTags(tags.input.split(','))) {
            toast.error('Tag kh??ng h???p l???!. Tag ph???i l?? k?? t??? kh??ng d???u v?? kh??ng ???????c ch???a kho???ng c??ch.')
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

    const handleCreateReview = async (data: Omit<DataPostFinal, 'additional'>) => {
        try {
            await postApi.add(data as any)

            toast.success('???? ????ng b??i vi???t th??nh c??ng. H??y ch??? "Qu???n tr??? web" duy???t!!!')
            setReviewData(initialDataPost)
            history.push('/')
        } catch (error: any) {
            toast.error(error.response?.data.message)
        }
    }

    if (isHidden)
        return (
            <Box className={classes.msgInfor}>
                <img src={SmallScreen} alt='' />

                <Typography className='text'>
                    {'B???n ??ang s??? d???ng m??n h??nh c?? k??ch th?????c nh???(< 600px) n??n s??? kh??ng th??? th???c hi???n ch??? n??ng so???n th???o. H??y chuy???n sang m??n h??nh c?? k??ch th?????c l???n h??n!'}
                </Typography>

                <Button variant='contained' color='primary'>
                    Quay v???
                </Button>
            </Box>
        )

    return (
        <Box className={classes.root}>
            <textarea
                className='title-input'
                placeholder='Nh???p ti??u ????? v??o ????y...'
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
                    Ch???n m???t nh?? tr??? b???n mu???n ????nh gi??:
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
                    Tag cho b??i ????? ng?????i kh??c bi???t b??i vi???t v??? g?? (ng??n c??ch b???ng d???u ph???y):
                </label>

                <TagInput
                    placeHolder='Nh???p tag(VD: danhgianhatro,anninh)'
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
                ????ng
            </Button>
        </Box>
    )
}
