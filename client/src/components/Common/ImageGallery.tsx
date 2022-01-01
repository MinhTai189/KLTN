import { makeStyles } from '@material-ui/core';
import { Modal } from 'antd';
import Gallery from 'react-image-gallery';

interface Props {
    open: boolean
    onCancel: () => void
}

const images = [
    {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];

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

const ImageGallery = ({ open, onCancel }: Props) => {
    const classes = useStyles()

    return (
        <Modal
            className={classes.root}
            visible={open}
            onCancel={onCancel}
            footer={null}
            width={1000}
            destroyOnClose
        >
            <Gallery items={images} lazyLoad />
        </Modal>
    )
}

export default ImageGallery
