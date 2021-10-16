import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import OK from 'assets/images/ok-illutration.jpg'

interface Props {
    openModal: boolean
    onOk: () => void
    onCancel: () => void
    loading?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& img': {
            width: '32%'
        },

        '& p': {
            fontSize: 14,
            textAlign: 'center',
            marginBottm: 8,
            lineHeight: 1.3
        },

        '& small': {
            fontSize: 13
        }
    }
}))

export const ModalConfirm = ({ openModal, onOk, onCancel, loading = false }: Props) => {
    const classes = useStyles()

    return (
        <Modal title='Xác nhận cập nhật thông tin' visible={openModal} onCancel={onCancel} onOk={onOk} confirmLoading={loading} cancelText='Hủy' okText='Xác nhận'>
            <Box className={classes.wrapper}>
                <img src={OK} alt='ok illutration' />

                <h3>Cảm ơn bạn đã cung cấp thông tin cho chúng tôi!!!</h3>

                <p>Thông tin bạn cung cấp có thể hữu ích với những bạn sinh viên có nhu cầu tìm nhà trọ.</p>

                <p>Hãy đảm bảo rằng thông tin bạn cung cấp là chính xác!</p>

                <small>Nhấn vào nút <b>"Xác nhận"</b> bên dưới để thực hiện yêu cầu cập nhật thông tin.</small>
            </Box>
        </Modal>
    )
}
