import { Box, Theme, Button } from '@material-ui/core'
import { DeleteOutline, Email, Facebook, Phone } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Tooltip, Typography } from 'antd'
import { AutoCompleteField, InputField } from 'components/FormFields'
import { FileInputField } from 'components/FormFields/FileInputField'
import { InputFieldIcon } from 'components/FormFields/InputFieldIcon'
import { RadioBtnField } from 'components/FormFields/RadioBtnField'
import { ReactComponent as Zalo } from '../../../assets/images/zalo.svg'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FieldOption, MotelOnly, School } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
import { checkSizeImg } from 'utils'
import { toast } from 'react-toastify'
import schoolApi from 'api/school'


interface Props {
    selectedMotelUpdate: MotelOnly;
    handleUploadThumbnail: (file: any) => void;
    handleUploadImages: (files: any) => void;
    handleUpdateMotel: (data: MotelOnly) => void
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
    imgField: {
        width: '100%',
        paddingTop: 4,

        "& .MuiTypography-root": {
            color: theme.palette.text.secondary
        },
    },
    imgRow: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
    },
    imgWrap: {
        width: '24%',
        height: 100,
        position: 'relative',
        overflow: 'hidden',
        outline: `1px solid ${theme.palette.text.secondary}`,

        "&:not(:last-child)": {
            marginRight: 'calc(4% / 3)'
        },

        '& img': {
            width: "100%",
            height: '100%',
            objectFit: 'cover'
        },

        "&:hover .img-remove": {
            transform: 'translateY(0)',
        },
    },
    imgRemove: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        minHeight: 37,
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#48a9a69e',
        cursor: 'pointer',
        transform: 'translateY(100%)',
        transition: `0.5s ${theme.transitions.easing.easeIn}`,

        "& .MuiSvgIcon-root": {
            fill: theme.palette.text.secondary
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
    school: yup
        .array()
        .min(1, 'Hãy cung cấp trường học xung quanh khu vực nhà trọ')
})

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

export const UpdateMotelModal = ({
    selectedMotelUpdate,
    handleUploadThumbnail,
    handleUploadImages,
    handleUpdateMotel }: Props) => {
    const classes = useStyles()
    const { handleSubmit, control, setError, formState: { errors }, setValue, getValues } = useForm({
        defaultValues: selectedMotelUpdate,
        resolver: yupResolver(schema)
    })

    const [status, setStatus] = useState(getValues('status'))
    const [selectedThumbnail, setSelectedThumbnail] = useState<any>(getValues('thumbnail'))
    const [selectedImages, setSelectedImages] = useState<any>(getValues('images'))

    const [errThumnail, setErrThumbnail] = useState('')
    const [errImages, setErrImages] = useState('')

    const [optionsSchool, setOptionsSchool] = useState<Array<School>>([])
    const [selectedSchool, setSelectedSchool] = useState<Array<string>>([])

    useEffect(() => {
        schoolApi.getAll()
            .then((res) => {
                setOptionsSchool(res.data)
            })
            .catch((err) => {
                toast.error(err.response?.data.message)
            })

        setSelectedSchool(selectedMotelUpdate.school)
        console.log('initial', selectedThumbnail)
    }, [])

    const handleSelectSchool = (e: any, value: any) => {
        value?.length > 0 && setError('school', { type: '' })
        setSelectedSchool(value)
        setValue('school', value)
    }

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

            setSelectedThumbnail(e.target.files ? e.target.files[0] : undefined)
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
                let temp = [];
                for (let i = 0; i < files.length; i++)
                    temp.push(files[i])

                setSelectedImages([...temp, ...selectedImages])
                setErrImages('')
                handleUploadImages([...temp, ...selectedImages])
            }
        } else {
            setSelectedImages([])
        }
    }

    const removeThumbnail = () => {
        setValue('thumbnail', '')
        setSelectedThumbnail(undefined)
    }

    const removeImages = (index: number) => {
        const imgFiltered = selectedImages.filter((_: any, num: number) => num !== index)

        setSelectedImages(imgFiltered)
        handleUploadImages(imgFiltered)
    }

    return (
        <form onSubmit={handleSubmit(handleUpdateMotel)}>
            <InputField name='name' label='Tên nhà trọ' type='text' control={control} required />
            <InputField name='address' label='Địa chỉ' type='text' control={control} required />

            <AutoCompleteField label="Trường học lân cận" title='name' error={errors.school?.message} freeSolo value={selectedSchool} onChange={handleSelectSchool} multiple disabled={optionsSchool.length > 0 ? false : true} options={optionsSchool} />

            <InputField name='desc' label='Mô tả nhà trọ' type='text' multiline={true} rows={4} control={control} />

            <Box className={classes.wrap} mt={3}>
                <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                    Thông tin liên hệ
                </Typography>

                <Box>
                    <InputFieldIcon name='contact.phone' label='Điện thoại' type="text" control={control} placeholder='0123456789' icon={<Phone />} />
                    <InputFieldIcon name='contact.email' label='Email' type="email" control={control} placeholder='abc@gmail.com' icon={<Email />} />
                    <InputFieldIcon name='contact.facebook' label='Facebook' type="text" control={control} placeholder='Gán đường dẫn đến facebook của bạn' icon={<Facebook />} />
                    <InputFieldIcon name='contact.zalo' label='Zalo' placeholder='Số điện thoại zalo của bạn' type="text" control={control} icon={<Zalo />} />
                </Box>
            </Box>

            <RadioBtnField name='status' label="Trạng thái" handleChange={handleChangeRadio} options={radioOptions} control={control} />

            {status === 'yes' && <InputField name='available' label='Số phòng trống' type='number' min={0} max={99} control={control} />}

            {selectedThumbnail
                ? <Box className={classes.imgField}>
                    <Typography>Ảnh giới thiệu</Typography>

                    <Box className={classes.imgRow}>
                        <Box className={classes.imgWrap}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={removeThumbnail}>
                                <Tooltip title="Xóa">
                                    <DeleteOutline />
                                </Tooltip>
                            </Box>

                            <img
                                src={typeof selectedThumbnail === 'string' ? selectedThumbnail : URL.createObjectURL(selectedThumbnail)}
                                alt="thumbnail" />
                        </Box>
                    </Box>
                </Box>
                : <FileInputField name='thumbnail' label="Ảnh giới thiệu" accept='.png, .jpg, .jpeg' error={errThumnail} onChange={handleChangeThumbnail} required />
            }

            <FileInputField name='images' label="Ảnh khác" accept='.png, .jpg, .jpeg' error={errImages} onChange={handleChangeImages} multiple={true} />
            {selectedImages?.length > 0 &&
                <Box className={classes.imgRow}>
                    {selectedImages.map((image: any, index: number) => (
                        <Box className={classes.imgWrap} key={index}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={() => removeImages(index)}>
                                <Tooltip title="Xóa">
                                    <DeleteOutline />
                                </Tooltip>
                            </Box>

                            <img
                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                alt="image" />
                        </Box>
                    ))}
                </Box>
            }

            <Box my={3}>
                <Button fullWidth type='submit' variant='contained' color='primary' size='large'>Cập nhật</Button>
            </Box>
        </form>
    )
}
