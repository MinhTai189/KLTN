import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import { motelApi } from 'api/motel'
import { Loading } from 'components/Common/Loading'
import { Motel } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
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

export const ModalFindRoommate = ({ open, onCancel }: Props) => {
    const classes = useStyles()

    const [listMotel, setListMotel] = useState<Array<Motel>>([])
    const [loading, setLoading] = useState(false)
    const [dataPost, setDataPost] = useState<DataPost>({
        title: '',
        tags: {
            input: '',
            suggest: []
        },
        motels: [],
        additional: {
            input: '',
            suggest: []
        },
        content: ''
    })

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
            title="Đăng tin Tìm bạn ở ghép"
            footer={null}
            width='100%'
            style={{ top: 30 }}
        >
            {!loading ? <CreatePostForm
                dataPost={dataPost}
                setDataPost={setDataPost}
                handleChangeContent={handleChangeContent}
                handleSubmit={handleSubmit}
                typePost='find-roommate'
                listMotel={listMotel}
            />
                : <Box className='loading'>
                    <Loading />
                </Box>
            }
        </Modal>
    )
}
