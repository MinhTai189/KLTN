import { makeStyles } from '@material-ui/core';
import { Modal } from 'antd';
import Gallery from 'react-image-gallery';

interface Props {
    images: string[]
    open: boolean
    onCancel: () => void
}

const useStyles = makeStyles({
    root: {
        top: 20,

        '& .ant-modal-close-x': {
            display: 'grid',
            placeItems: 'center',
            fontSize: 23,
            width: 40,
            height: 40,
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderBottomLeftRadius: 5
        }
    }
})

const ImageGallery = ({ images, open, onCancel }: Props) => {
    const classes = useStyles()
    const listImage = images.map(image => ({
        original: image,
        thumbnail: image
    }))

    return (
        <Modal
            className={classes.root}
            visible={open}
            onCancel={onCancel}
            footer={null}
            width={1000}
            destroyOnClose
        >
            <Gallery items={listImage} lazyLoad />
        </Modal>
    )
}

export default ImageGallery
