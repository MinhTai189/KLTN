import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { selectLoadingSchool } from 'features/school/schoolSlice'
import { ChangeEvent, useState } from 'react'
import { CreatePostForm } from '../CreatePostForm'
import { DataPost } from '../models/create-post'

interface Props {
    open: boolean
    onCancel: () => void
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

export const ModalFindMotel = ({ open, onCancel }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingSchool)

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

    const handleChangeContent = (value: string) => {
        setDataPost(prev => ({ ...prev, content: value }))
    }

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(dataPost)
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
                handleChangeContent={handleChangeContent}
                handleSubmit={handleSubmit}
                typePost='find-motel'
            />
                : <Box className='loading'>
                    <Loading />
                </Box>
            }
        </Modal>
    )
}
