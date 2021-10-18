import { Box, Button, makeStyles, Theme } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { Space, Typography } from "antd"
import { CheckboxGroup, InputField } from "components/FormFields"
import { FieldOption, Room } from "models"
import { useForm } from "react-hook-form"

interface Props {
    updateData: Room
    onClickUpdateRoom: (data: Room) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiFormLabel-root': {
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-block',
            marginBottom: theme.spacing(0.5),
            color: 'inherit'
        }
    },
    wrap: {
        marginBottom: theme.spacing(1.5)
    },
    titleWrap: {
        fontSize: 14,
        fontWeight: 600,
        display: 'inline-block',
        margin: 0
    },
}))

const checkboxOptions: Array<FieldOption> = [
    {
        label: 'Wifi',
        value: 'wifi'
    },
    {
        label: 'Máy lạnh',
        value: 'ml'
    },
    {
        label: 'Gác',
        value: 'gac'
    },
    {
        label: 'Nhà xe',
        value: 'nx'
    },
    {
        label: 'Camera',
        value: 'camera'
    },
    {
        label: 'Quạt',
        value: 'quat'
    },
    {
        label: 'Trên lầu',
        value: 'tl'
    },
    {
        label: 'Giường',
        value: 'giuong'
    },
    {
        label: 'Giường tầng',
        value: 'gt'
    },
    {
        label: 'Chung chủ',
        value: 'cc'
    },
    {
        label: 'Dụng cụ vệ sinh',
        value: 'dcvs'
    }
]

const initialCheckbox: any = {
    wifi: false,
    ml: false,
    gac: false,
    nx: false,
    camera: false,
    quat: false,
    tl: false,
    giuong: false,
    gt: false,
    cc: false,
    dcvs: false
}

export const EditFormRoom = ({ updateData, onClickUpdateRoom }: Props) => {
    const classes = useStyles()
    const { handleSubmit, control } = useForm({
        defaultValues: updateData
    })

    const checkbox = { ...initialCheckbox, ...updateData.optional }

    return (
        <form className={classes.root} onSubmit={handleSubmit(onClickUpdateRoom)}>
            <Space direction='vertical' style={{ marginBottom: 8 }}>
                <Alert severity='info'>
                    Bạn có thể chỉnh sửa lại thông tin của phòng trọ nếu như thông tin không chính xác.
                </Alert>

                <Alert severity='info'>
                    Toàn bộ thông tin sau khi chỉnh sửa của bạn sẽ được duyệt thông qua "Người quản trị trang web". Nếu thông tin của bạn được xác thực, Người quản trị trang web sẽ cập nhật lại thông tin hiện tại.
                </Alert>
            </Space>

            <Box className={classes.wrap}>
                <Typography className={classes.titleWrap}>
                    {`Diện tích(m)`}
                </Typography>

                <Box style={{ borderLeft: '1px solid #999', paddingLeft: 8 }}>
                    <InputField name='area.length' label='Chiều dài' type='number' min={0} max={99} margin='dense' control={control} required />
                    <InputField name='area.width' label='Chiều rộng' type='number' min={0} max={99} margin='dense' control={control} required />
                </Box>
            </Box>

            <InputField name='total' label='Số lượng phòng' type='number' min={0} max={99} step={1} margin='dense' control={control} required />
            <InputField name='remain' label='Số lượng phòng trống' type='number' min={0} step={1} max={99} margin='dense' control={control} required />
            <InputField name='price' label='Giá thuê' type='number' min={0} max={99000000} step={10000} margin='dense' control={control} required />

            <Box my={1.5}>
                <CheckboxGroup label='Thông tin bổ sung' size='small' initialState={checkbox} name='optional' control={control} options={checkboxOptions} />
            </Box>

            <Box mt={2}>
                <Button type='submit' color="primary" variant='outlined' fullWidth>
                    Cập nhật
                </Button>
            </Box>
        </form>
    )
}
