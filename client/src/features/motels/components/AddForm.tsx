import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, CircularProgress, Container, Link, Theme, Typography } from '@material-ui/core'
import { Email, Facebook, Phone } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import schoolApi from 'api/school'
import { useAppSelector } from 'app/hooks'
import { AutoCompleteField, CheckboxGroup, InputField } from 'components/FormFields'
import { FileInputField } from 'components/FormFields/FileInputField'
import { InputFieldIcon } from 'components/FormFields/InputFieldIcon'
import { RadioBtnField } from 'components/FormFields/RadioBtnField'
import { FieldOption, Motel } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { checkSizeImg } from 'utils'
import * as yup from 'yup'
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
import { selectLoadingMotel } from '../motelSlice'

interface Props {
    handleAddMotel: (data: any) => void;
    handleUploadThumbnail: (image: any) => void;
    handleUploadImages: (images: any) => void
}

const initialMotel: Motel = {
    name: '',
    images: [],
    address: '',
    thumbnail: '',
    room: [{
        area: {
            width: 0,
            length: 0,
        },
        optional: [],
        remain: 0,
        price: 0,
        total: 0
    }],
    desc: '',
    contact: {
        phone: '',
        zalo: '',
        facebook: '',
        email: ''
    },
    status: 'yes',
    available: 0,
    school: [],
}

const radioOptions: Array<FieldOption> = [
    {
        label: 'Còn trống',
        value: 'yes'
    },
    {
        label: 'Hết phòng',
        value: 'no'
    }
]

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

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
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
    imgsWrap: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: theme.spacing(1),

        "& > div": {
            overflow: 'hidden',
            maxHeight: 200,
            outline: '1px solid #000',
        }
    }
}))

const schema = yup.object().shape({
    name: yup
        .string()
        .strict()
        .trim('Tên không được chứa khoảng trắng ở đầu và cuối')
        .max(50, 'Tối đa 70 ký tự')
        .required('Hãy thêm tên nhà trọ'),
    address: yup
        .string()
        .strict()
        .trim('Địa chỉ không được chứa khoảng trắng ở đầu và cuối')
        .max(50, 'Tối đa 150 ký tự')
        .required('Hãy thêm địa chỉ'),
    desc: yup
        .string()
        .required('Hãy viết một ít mô tả về nhà trọ của bạn. Giúp cho mọi người tìm kiếm nhà trọ chính xác hơn')
        .strict()
        .trim('Mô tả không được chứa khoảng trắng ở đầu và cuối'),
    contact: yup
        .object()
        .shape({
            phone: yup
                .string()
                .strict()
                .trim('Địa chỉ không được chứa khoảng trắng ở đầu và cuối'),
            email: yup
                .string()
                .email('Email không hợp lệ'),
            zalo: yup
                .string()
                .strict()
                .trim('Địa chỉ không được chứa khoảng trắng ở đầu và cuối'),
            facebook: yup
                .string()
                .strict()
                .trim('Địa chỉ không được chứa khoảng trắng ở đầu và cuối')
        }),
    room: yup
        .array()
        .of(
            yup
                .object()
                .shape({
                    area: yup
                        .object()
                        .shape({
                            width: yup
                                .number()
                                .min(1, 'Chiều rộng tối thiểu 1 mét')
                                .max(99, 'Chiều rộng tối đa là 99 mét'),
                            length: yup
                                .number()
                                .min(1, 'Chiều dài tối thiểu 1 mét')
                                .max(99, 'Chiều dài tối đa là 99 mét')
                        }),
                    total: yup
                        .number()
                        .min(1, 'Số phòng tối thiểu là 1 phòng')
                        .max(99, 'Số phòng tối đa là 99 phòng'),
                    remain: yup
                        .number()
                        .max(99, 'Số phòng tối đa là 99 phòng')
                        .test('check-remain-room', 'Số phòng trống không được lớn hơn tổng số phòng', function (value: any) {
                            return this.parent.total >= value
                        }),
                    price: yup
                        .number()
                        .min(10000, 'Số tiền tối thiểu là 10.000 đồng')
                        .max(99000000, 'Số tiền tối đa là 99.000.000 đồng'),
                })),
    school: yup
        .array()
        .min(1, 'Hãy cung cấp trường học xung quanh khu vực nhà trọ')
})

export const AddForm = ({ handleAddMotel, handleUploadImages, handleUploadThumbnail }: Props) => {
    const classes = useStyles()

    const loading = useAppSelector(selectLoadingMotel)
    const { control, handleSubmit, setValue, formState: { errors }, setError } = useForm<Motel>({
        defaultValues: initialMotel,
        resolver: yupResolver(schema),
    })
    const { fields, append } = useFieldArray({
        control,
        name: 'room'
    })

    const [status, setStatus] = useState('yes')
    const [optionsSchool, setOptionsSchool] = useState<Array<any>>([])
    const [selectedSchool, setSelectedSchool] = useState<Array<any>>([])

    const [selectedImages, setSelectedImages] = useState<any>()
    const [errThumnail, setErrThumbnail] = useState('')
    const [errImages, setErrImages] = useState('')

    useEffect(() => {
        schoolApi.getAll()
            .then((res) => {
                setOptionsSchool(res.data)
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }, [])

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === 'no')
            setValue('available', 0)
        setStatus(e.target.value)
    }

    const handleChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
        if (!checkSizeImg(e.target.files)) {
            setErrThumbnail('Kích thước ảnh không được vượt quá 500KB')
        } else {
            setErrThumbnail('')
            handleUploadThumbnail(e.target.files)
        }
    }

    const handleChangeImages = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (files && files.length !== 0) {
            if (files?.length > 8) {
                setErrImages('Chỉ được chọn tối đã 8 ảnh')
            } else if (!checkSizeImg(files)) {
                setErrImages('Kích thước mỗi ảnh không được vượt quá 500KB')
            } else {
                setSelectedImages(files)
                setErrImages('')
                handleUploadImages(files)
            }
        } else {
            setSelectedImages([])
        }
    }

    const handleSelectSchool = (e: any, value: any) => {
        value?.length > 0 && setError('school', { type: '' })
        setSelectedSchool(value)
        setValue('school', value)
    }

    const appendClick = () => {
        append({
            area: {
                width: 0,
                length: 0,
            },
            optional: [],
            remain: 0,
            price: 0,
            total: 0
        })
    }

    return (
        <Container maxWidth='md'>
            <Box className={classes.root}>
                <Typography variant='h3'>
                    Thêm nhà trọ
                </Typography>

                <form onSubmit={handleSubmit(handleAddMotel)}>
                    <Box className={classes.wrap} mt={3}>
                        <Typography className={classes.titleWrap}>
                            Thông tin nhà trọ
                        </Typography>

                        <Alert severity="info">Cảm ơn bạn đã hỗ trợ chúng tôi có thêm thông tin về nhà trọ. Thông tin của bạn cung cấp sẽ giúp cho các bạn sinh viên có thể dễ dàng tìm được nhà trọ cho mình. Và hãy đảm bảm những thông tin bạn cung cấp là chính xác.</Alert>

                        <Box>
                            <InputField name='name' label='Tên nhà trọ' type='text' control={control} required />
                            <InputField name='address' label='Địa chỉ' type='text' control={control} required />

                            <AutoCompleteField label="Trường học lân cận" title='name' error={errors.school?.message} freeSolo value={selectedSchool} onChange={handleSelectSchool} multiple disabled={optionsSchool.length > 0 ? false : true} options={optionsSchool} />

                            <InputField name='desc' label='Mô tả nhà trọ' type='text' multiline={true} rows={4} control={control} />

                            <Box className={classes.wrap} mt={3}>
                                <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                                    Thông tin liên hệ
                                </Typography>

                                <Alert severity="info">Hãy thêm ít nhất một thông tin liên hệ. Giúp cho việc tra cứu thông tin chính xác hơn</Alert>

                                <Box>
                                    <InputFieldIcon name='contact.phone' label='Điện thoại' type="text" control={control} placeholder='0123456789' icon={<Phone />} />
                                    <InputFieldIcon name='contact.email' label='Email' type="email" control={control} placeholder='abc@gmail.com' icon={<Email />} />
                                    <InputFieldIcon name='contact.facebook' label='Facebook' type="text" control={control} placeholder='Gán đường dẫn đến facebook của bạn' icon={<Facebook />} />
                                    <InputFieldIcon name='contact.zalo' label='Zalo' placeholder='Số điện thoại zalo của bạn' type="text" control={control} icon={<Zalo />} />
                                </Box>
                            </Box>

                            <RadioBtnField name='status' label="Trạng thái" handleChange={handleChangeRadio} options={radioOptions} control={control} />

                            {status === 'yes' && <InputField name='available' label='Số phòng trống' type='number' min={0} max={99} control={control} />}

                            <FileInputField name='thumbnail' label="Ảnh giới thiệu" accept='.png, .jpg, .jpeg' error={errThumnail} onChange={handleChangeThumbnail} required />

                            <FileInputField name='images' label="Ảnh khác" accept='.png, .jpg, .jpeg' error={errImages} onChange={handleChangeImages} multiple={true} />

                            <Box className={classes.imgsWrap}>
                                {selectedImages && [...selectedImages].map((img, index) => (
                                    <Box component='div'>
                                        <img key={index} src={URL.createObjectURL(img)} alt='tìm nhà trọ sinh viên' />
                                    </Box>
                                ))
                                }
                            </Box>
                        </Box>
                    </Box>

                    {fields.map((field, index) => (
                        <>
                            <Box className={classes.wrap} mt={3}>
                                <Typography className={classes.titleWrap}>
                                    {`Thông tin phòng trọ ${index + 1}`}
                                </Typography>

                                {index === 0 && <Alert severity="info">Nếu như nhà trọ của bạn có nhiều loại phòng trọ, bạn có thể nhấn vào nút "Thêm phòng trọ" phía dưới để bổ sung thêm thông tin</Alert>}

                                <Box>
                                    <Box className={classes.wrap} mt={3}>
                                        <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                                            {`Diện tích(m)`}
                                        </Typography>

                                        <Box>
                                            <InputField key={field.id} name={`room.${index}.area.length`} label='Chiều dài' type='number' min={0} max={99} control={control} required />
                                            <InputField key={field.id} name={`room.${index}.area.width`} label='Chiều rộng' type='number' min={0} max={99} control={control} required />
                                        </Box>
                                    </Box>

                                    <InputField key={field.id} name={`room.${index}.total`} label='Số lượng phòng' type='number' min={0} max={99} step={1} control={control} required />
                                    <InputField key={field.id} name={`room.${index}.remain`} label='Số lượng phòng trống' type='number' min={0} max={99} step={1} control={control} required />
                                    <InputField key={field.id} name={`room.${index}.price`} label='Giá thuê' type='number' min={0} max={99000000} step={10000} control={control} required />

                                    <CheckboxGroup key={field.id} label='Thông tin bổ sung' initialState={initialCheckbox} name={`room.${index}.optional`} control={control} options={checkboxOptions} />
                                </Box>
                            </Box>
                            <Box style={{ textAlign: 'right' }}>
                                <Link onClick={appendClick}>&#x2b; Thêm phòng trọ</Link>
                            </Box>
                        </>
                    ))}

                    <Box my={3}>
                        <Button variant='contained' size='large' color='primary' type='submit' fullWidth disabled={loading}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Xác nhận
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    )
}
