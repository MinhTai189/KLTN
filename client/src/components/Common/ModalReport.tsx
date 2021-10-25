import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import Report from 'assets/images/report-illustration.jpg'

interface Props {
    openModal: boolean
    onOk: () => void
    onCancel: () => void
    loading?: boolean
    valueReport: string
    onChange: (state: any) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        "& .text-area": {
            width: '100%',
            height: 'fit-content',
            padding: theme.spacing(1),
            marginBlock: theme.spacing(1.5),
            display: 'grid',
            placeItems: 'center',
            background: '#fff',
            border: '1px solid #999',
            position: 'relative',

            '& textarea': {
                width: '100%',
                resize: 'none',
                outline: 'none',
                border: 'none',
                background: 'inherit',
            },

            '& small': {
                position: 'absolute',
                bottom: 2,
                right: 5,
                fontWeight: 600,
                color: '#666'
            }
        },

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

export const ModalReport = ({ openModal, onOk, onCancel, loading = false, valueReport, onChange }: Props) => {
    const classes = useStyles()

    return (
        <Modal title='Báo cáo nội dung không phù hợp' visible={openModal} onCancel={onCancel} onOk={onOk} confirmLoading={loading} cancelText='Hủy' okText='Xác nhận'>
            <Box className={classes.wrapper}>
                <img src={Report} alt='report illutration' />

                <h3>Cảm ơn bạn đã báo cáo những nội dung không phù hợp</h3>

                <div className="text-area">
                    <textarea value={valueReport} onChange={(e) => onChange(e.target.value)} name="report" rows={3} placeholder='Lý do bạn muốn báo cáo nội dung này...'></textarea>

                    <small style={{ color: valueReport.length > 100 ? '#f44336' : 'inherit' }}>{`${valueReport.length}/100`}</small>
                </div>

                <p>
                    Những nội dung có nội dung không đúng sự thật, nhạy cảm, không liên quan sẽ được "Người quản trị web" xem xét và thực hiện xử lý.
                </p>

                <small>Nhấn vào nút <b>"Xác nhận"</b> bên dưới để thực hiện báo cáo nội dung.</small>
            </Box>
        </Modal>
    )
}