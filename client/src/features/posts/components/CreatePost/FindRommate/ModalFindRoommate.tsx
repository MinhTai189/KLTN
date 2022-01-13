import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import { motelApi } from 'api/motel'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { selectOpenCreatedPostModal } from 'features/posts/openCreatePostModalSlice'
import { Motel } from 'models'
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
    motel: undefined,
    additional: {
        input: '',
        suggest: []
    },
    content: ''
}

export const ModalFindRoommate = ({ open, onCancel, handleSubmitCreatedPost }: Props) => {
    const classes = useStyles()
    const contentRef = useRef<any>()
    const showModalCreatePost = useAppSelector(selectOpenCreatedPostModal)

    const [errMotel, setErrMotel] = useState('')

    const [listMotel, setListMotel] = useState<Array<Motel>>([])
    const [loading, setLoading] = useState(false)
    const [dataPost, setDataPost] = useState<DataPost>(initialDataPost)

    useEffect(() => {
        setLoading(true)

        motelApi.getAll()
            .then(res => {
                setListMotel(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (showModalCreatePost === 0) {
            setDataPost(initialDataPost)
            contentRef.current && contentRef.current.resetValue()
        }
    }, [showModalCreatePost])

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!dataPost.motel) {
            setErrMotel('Hãy chọn một nhà trọ mà bạn muốn tìm bạn ở ghép')
            return
        }

        if (!checkTags(dataPost.tags.input.split(','))) {
            toast.error('Tag không hợp lệ!. Tag phải là ký tự không dấu và không được chứa khoảng cách.')
            return
        }

        const newDataPost: DataPostFinal = {
            ...dataPost,
            additional: `${checkCommaLastString(dataPost.additional?.input || '')}${mapTrimStringArray(dataPost.additional?.suggest || []).join(',')}`,
            tags: `${checkCommaLastString(dataPost.tags.input)}${mapTrimStringArray(dataPost.tags.suggest).join(',')}`,
            motel: dataPost?.motel._id,
            subjectId: '6173ba553c954151dcc8fdf8',
            content: contentRef.current?.getValue() ?? ''
        }

        handleSubmitCreatedPost(newDataPost)
    }

    return (
        <Modal
            className={classes.root}
            visible={open}
            onCancel={onCancel}
            title="Đăng tin Tìm bạn ở ghép"
            footer={null}
            width='100%'
            style={{ top: 30 }}
        >
            {!loading ? <CreatePostForm
                dataPost={dataPost}
                setDataPost={setDataPost}
                handleSubmit={handleSubmit}
                typePost='find-roommate'
                listMotel={listMotel}
                errMotel={errMotel}
                ref={contentRef}
            />
                : <Box className='loading'>
                    <Loading />
                </Box>
            }
        </Modal>
    )
}
