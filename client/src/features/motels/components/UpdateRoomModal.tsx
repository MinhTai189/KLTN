import { Box, Button, Link, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { CheckboxGroup, InputField } from 'components/FormFields'
import { FieldOption, Room } from 'models'
import { useForm } from 'react-hook-form'

interface ChangeRoom {
    current: number;
    end: boolean;
    start: boolean;
    data: Room;
}

interface Props {
    changeRoom: ChangeRoom;
    nextRoomUpdate: () => void;
    prevRoomUpdate: () => void;
    handleUpdateRoom: (data: Room) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    wrap: {
        border: '1px solid',
        padding: theme.spacing(1.5),
        position: 'relative',
        borderRadius: 5
    },
    titleWrap: {
        position: 'absolute',
        left: 6,
        top: -14,
        fontSize: 18,
        display: 'inline-block',
        background: '#fff',
        paddingLeft: 4,
        paddingRight: 4
    },
    nav: {
        width: '100%',
        position: 'relative',

        '& .btnPrev': {
            position: 'absolute',
            left: 0
        },

        '& .btnNext': {
            position: 'absolute',
            right: 0
        },
    }
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

export const UpdateRoomModal = ({ changeRoom, nextRoomUpdate, prevRoomUpdate, handleUpdateRoom }: Props) => {
    const classes = useStyles()
    const { handleSubmit, control, formState: { isDirty } } = useForm({
        defaultValues: changeRoom.data
    })

    const checkbox = { ...initialCheckbox, ...changeRoom.data.optional }

    const onClickPrevNext = (type: string) => {
        if (isDirty === true) {
            if (!window.confirm('Bạn chưa lưu dữ liệu đã thay đổi!')) {
                if (type === 'prev') {
                    prevRoomUpdate()
                } else {
                    nextRoomUpdate()
                }
            }
        }
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(handleUpdateRoom)}>
                <Box className={classes.wrap}>
                    <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                        {`Diện tích(m)`}
                    </Typography>

                    <Box>
                        <InputField name='area.length' label='Chiều dài' type='number' min={0} max={99} control={control} required />
                        <InputField name='area.width' label='Chiều rộng' type='number' min={0} max={99} control={control} required />
                    </Box>
                </Box>

                <InputField name='total' label='Số lượng phòng' type='number' min={0} max={99} step={1} control={control} required />
                <InputField name='remain' label='Số lượng phòng trống' type='number' min={0} step={1} max={99} control={control} required />
                <InputField name='price' label='Giá thuê' type='number' min={0} max={99000000} step={10000} control={control} required />

                <CheckboxGroup label='Thông tin bổ sung' initialState={checkbox} name='optional' control={control} options={checkboxOptions} />

                <Box my={3}>
                    <Button fullWidth type='submit' variant='contained' color='primary' size='large'>Cập nhật</Button>
                </Box>
            </form>

            <Box className={classes.nav}>
                {!changeRoom.start && <Link className='btnPrev' onClick={() => onClickPrevNext('prev')}>&lt; Phòng trọ trước đó</Link>}

                {!changeRoom.end && <Link className='btnNext' onClick={() => onClickPrevNext('next')}>Phòng trọ tiếp theo &gt;</Link>}
            </Box>
        </Box>
    )
}
