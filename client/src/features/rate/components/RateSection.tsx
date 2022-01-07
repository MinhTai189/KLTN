import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Modal } from "antd"
import rateApi from "api/rate"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { ModalReport } from "components/Common"
import { ModalConfirm } from "components/Common/ModalConfirm"
import { selectCurrentUser } from "features/auth/authSlice"
import { motelActions, selectFilterMotel } from "features/motels/motelSlice"
import { Rate } from "models"
import { useState } from "react"
import { useParams } from "react-router"
import { toast } from "react-toastify"
import { RateBox, RateForm } from "."

interface Props {
    motelName: string
    rateList: Rate[]
    motelId: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: 120,

        [theme.breakpoints.down('xs')]: {
            marginBlock: 50,
        },
    },
    title: {
        width: '100%',
        marginBottom: theme.spacing(1),
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 25
    }
}))

export const RateSection = ({ motelName, rateList, motelId }: Props) => {
    const classes = useStyles()

    const { id } = useParams<{ id: string }>()

    const currentUser = useAppSelector(selectCurrentUser)
    const filter = useAppSelector(selectFilterMotel)
    const dispatch = useAppDispatch()

    const [openRateModal, setOpenRateModal] = useState(false)
    const [rateFormValue, setRateFormValue] = useState(0)
    const [contentFormValue, setContentFormValue] = useState('')

    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openReportModal, setOpenReportModal] = useState(false)

    const [contentReport, setContentReport] = useState('')
    const [idRateReport, setIdRateReport] = useState('')

    const handleCancelModal = () => {
        setOpenRateModal(false)
    }

    const handleOpenRateForm = () => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để có thể sử dụng chức năng này!')
            return
        }

        setOpenRateModal(true)
    }

    const handleRateSubmit = () => {
        if (rateFormValue === 0) {
            toast.error('Vui lòng chọn số điểm mà bạn muốn đánh giá nhà trọ!')
            return;
        }
        if (contentFormValue.trim().length === 0) {
            toast.error('Vui lòng nhập đánh giá!')
            return;
        }
        if (contentFormValue.trim().length > 100) {
            toast.error('Đánh giá tối đa 100 ký tự!')
            return;
        }

        setOpenConfirmModal(true)
    }

    const handlePostRate = async () => {
        try {
            setLoading(true)

            await rateApi.addRate({
                star: rateFormValue,
                content: contentFormValue.trim(),
                motelId,
            })

            toast.success('Đã thực hiện đánh giá thành công! Hãy chờ "Người quản trị web" xác thực đánh giá của bạn')

            setLoading(false)
            setOpenRateModal(false)
            setOpenConfirmModal(false)

            dispatch(motelActions.setFilter({ ...filter }))
        } catch (err: any) {
            toast.error(err.response.data.message)
            setLoading(false)
            setOpenConfirmModal(false)
        }
    }

    const hanldeReport = (idRate: string) => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để có thể sử dụng chức năng này!')
            return
        }

        setIdRateReport(idRate)
        setOpenReportModal(true)
    }

    const hanldeSubmitReport = async () => {
        if (contentReport.trim().length === 0) {
            toast.error('Vui lòng nhập đánh giá!')
            return;
        }
        if (contentReport.length > 100) {
            toast.error('Đánh giá tối đa 100 ký tự!')
            return;
        }

        try {
            setLoading(true)

            await rateApi.reportRate({
                rateId: idRateReport,
                motelId: id,
                content: contentReport.trim()
            })

            setLoading(false)
            setOpenReportModal(false)

            toast.success('Đã thực hiện tố cáo thành công!')
        } catch (error: any) {
            setLoading(false)
            setOpenReportModal(false)

            toast.error(error.response.data.message)
        }
    }

    return (
        <Box className={classes.root} component='section'>
            <h2 className={classes.title}>
                Đánh giá
            </h2>

            <RateBox
                handleOpenRateForm={handleOpenRateForm}
                rateList={rateList}
                handleReport={hanldeReport}
            />

            <Modal title={`Đánh giá ${motelName}`.toUpperCase()} visible={openRateModal} footer={null} onCancel={handleCancelModal}>
                <RateForm
                    setRateFormValue={setRateFormValue}
                    setContentFormValue={setContentFormValue}
                    contentFormValue={contentFormValue}
                    rateFormValue={rateFormValue}
                    handleRateSubmit={handleRateSubmit}
                />
            </Modal>

            <ModalConfirm openModal={openConfirmModal} onCancel={() => setOpenConfirmModal(false)} onOk={handlePostRate} loading={loading} />

            <ModalReport
                valueReport={contentReport}
                onChange={setContentReport}
                openModal={openReportModal}
                onCancel={() => setOpenReportModal(false)}
                onOk={hanldeSubmitReport}
                loading={loading}
            />
        </Box>
    )
}
