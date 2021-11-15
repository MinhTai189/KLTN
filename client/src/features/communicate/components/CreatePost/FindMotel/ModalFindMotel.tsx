import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { selectLoadingSchool } from 'features/school/schoolSlice'
import { ChangeEvent, useState } from 'react'
import { mapTrimStringArray } from 'utils'
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

export const ModalFindMotel = ({ open, onCancel, handleSubmitCreatedPost }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingSchool)

    const [errSchools, setErrSchool] = useState('')
    const [dataPost, setDataPost] = useState<DataPost>({
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
    })

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (dataPost.schools && dataPost.schools.length <= 0) {
            setErrSchool('Hãy chọn một trường bạn muốn tìm nhà trọ gần đó')
            return;
        }

        const newDataPost: DataPostFinal = {
            ...dataPost,
            additional: `${dataPost.additional.input}${mapTrimStringArray(dataPost.additional.suggest).join(',')}`,
            tags: `${dataPost.tags.input}${mapTrimStringArray(dataPost.tags.suggest).join(',')}`,
            price: dataPost.price ? +dataPost.price : 0,
            motel: undefined,
            subjectId: '6173ba553c954151dcc8fdf7'
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
            />
                : <Box className='loading'>
                    <Loading />
                </Box>
            }
        </Modal>
    )
}
