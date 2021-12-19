import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { selectOpenCreatedPostModal } from 'features/posts/openCreatePostModalSlice'
import { selectLoadingSchool } from 'features/school/schoolSlice'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { checkCommaLastString, mapTrimStringArray } from 'utils'
import { checkTags } from 'utils/check-valid/checkTag'
import { CreatePostForm } from '../CreatePostForm'
import { DataPost, DataPostFinal } from '../models/create-post'

interface Props {
    open: boolean
    onCancel: () => void
    handleSubmitCreatedPost: (data: DataPostFinal) => void
}

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 1000,

        '& .loading': {
            width: '100%',
            height: 200,
            display: 'grid',
            placeItems: 'center'
        }
    }
}))

const initialDataPost: DataPost = {
    title: '',
    tags: {
        input: '',
        suggest: []
    },
    schools: [],
    price: 0,
    additional: {
        input: '',
        suggest: []
    },
    content: ''
}

export const ModalFindMotel = ({ open, onCancel, handleSubmitCreatedPost }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingSchool)
    const contentRef = useRef<any>()

    const showModalCreatePost = useAppSelector(selectOpenCreatedPostModal)
    const [errSchools, setErrSchool] = useState('')
    const [dataPost, setDataPost] = useState<DataPost>(initialDataPost)

    useEffect(() => {
        if (showModalCreatePost === 0) {
            setDataPost(initialDataPost)
            contentRef.current && contentRef.current.resetValue()
        }
    }, [showModalCreatePost])

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (dataPost.schools && dataPost.schools.length <= 0) {
            setErrSchool('Hãy chọn một trường bạn muốn tìm nhà trọ gần đó')
            return;
        }

        if (!checkTags(dataPost.tags.input.split(','))) {
            toast.error('Tag không hợp lệ!. Tag phải là ký tự không dấu và không được chứa khoảng cách.')
            return
        }

        const newDataPost: DataPostFinal = {
            ...dataPost,
            additional: `${checkCommaLastString(dataPost.additional?.input || '')}${mapTrimStringArray(dataPost.additional?.suggest || []).join(',')}`,
            tags: `${checkCommaLastString(dataPost.tags.input)}${mapTrimStringArray(dataPost.tags.suggest).join(',')}`,
            price: dataPost.price ? +dataPost.price : 0,
            motel: undefined,
            subjectId: '6173ba553c954151dcc8fdf7',
            content: contentRef.current?.getValue() ?? ''
        }

        handleSubmitCreatedPost(newDataPost)
    }

    return (
        <Modal
            className={classes.root}
            visible={open}
            onCancel={onCancel}
            title="Đăng tin Tìm nhà trọ"
            footer={null}
            width='100%'
            style={{ top: 30 }}
        >
            {!loading ? <CreatePostForm
                dataPost={dataPost}
                setDataPost={setDataPost}
                handleSubmit={handleSubmit}
                typePost='find-motel'
                errSchools={errSchools}
                ref={contentRef}
            />
                : <Box className='loading'>
                    <Loading />
                </Box>
            }
        </Modal>
    )
}
