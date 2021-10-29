import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Theme, Tooltip } from "@material-ui/core"
import { DeleteOutline, Email, Facebook, Phone } from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import { makeStyles } from "@material-ui/styles"
import { Space, Typography } from "antd"
import schoolApi from "api/school"
import { AutoCompleteField, InputField } from "components/FormFields"
import { FileInputField } from "components/FormFields/FileInputField"
import { InputFieldIcon } from "components/FormFields/InputFieldIcon"
import { RadioBtnField } from "components/FormFields/RadioBtnField"
import { FieldOption, MotelOnly, School } from "models"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { checkSizeImg } from "utils"
import * as yup from 'yup'
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'

interface Props {
    updateData: MotelOnly
    onClickUpdateMotel: (data: MotelOnly) => void
    handleUploadThumbnail: (file: any) => void
    handleUploadImages: (files: any) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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
    imgField: {
        width: '100%',
        paddingTop: 4,
        paddingBottom: 4,
        margin: '8px 0',

        "& .MuiTypography-root": {
            color: theme.palette.text.secondary
        },
    },
    imgRow: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: 10,
        marginTop: 8
    },
    imgWrap: {
        width: '100%',
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
        maxHeight: 60,
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

export const EditMotelForm = ({ updateData, onClickUpdateMotel, handleUploadThumbnail, handleUploadImages }: Props) => {
    const classes = useStyles()
    const { handleSubmit, control, setError, formState: { errors }, setValue, getValues } = useForm({
        defaultValues: updateData,
        resolver: yupResolver(schema)
    })
    const [selectedSchool, setSelectedSchool] = useState<Array<School>>(updateData.school)

    const [optionsSchool, setOptionsSchool] = useState<Array<School>>([])
    const [status, setStatus] = useState(getValues('status'))

    const [selectedThumbnail, setSelectedThumbnail] = useState<any>(getValues('thumbnail'))
    const [selectedImages, setSelectedImages] = useState<any>(getValues('images'))

    const [errThumnail, setErrThumbnail] = useState('')
    const [errImages, setErrImages] = useState('')


    useEffect(() => {
        schoolApi.getAll()
            .then((res) => {
                setOptionsSchool(res.data)
            })
            .catch((err) => {
                toast.error(err.response?.data.message)
            })

        //convert status data motel into string
        const statusMotel = updateData.status ? 'yes' : 'no'
        setValue('status', statusMotel)

    }, [setValue, updateData.status])

    const handleSelectSchool = (e: any, value: any) => {
        value?.length > 0 && setError('school', { type: '' })
        setSelectedSchool(value)
        setValue('school', value)
    }

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === 'no')
            setValue('available', 0)
        setStatus(e.target.value === 'yes' ? true : false)
    }

    //handle thumbnail
    const handleChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
        if (!checkSizeImg(e.target.files)) {
            setErrThumbnail('Kích thước ảnh không được vượt quá 500KB')
        } else {
            setErrThumbnail('')

            setSelectedThumbnail(e.target.files ? e.target.files[0] : undefined)
            handleUploadThumbnail(e.target.files)
        }
    }

    const removeThumbnail = () => {
        setValue('thumbnail', '')
        setSelectedThumbnail(undefined)
    }

    //handle images
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

    const removeImages = (index: number) => {
        const imgFiltered = selectedImages.filter((_: any, num: number) => num !== index)

        setSelectedImages(imgFiltered)
        handleUploadImages(imgFiltered)
    }

    return (
        <form onSubmit={handleSubmit(onClickUpdateMotel)}>
            <Space direction='vertical' style={{ marginBottom: 8 }}>
                <Alert severity='info'>
                    Bạn có thể chỉnh sửa lại thông tin của nhà trọ trọ nếu như thông tin không chính xác.
                </Alert>

                <Alert severity='info'>
                    Toàn bộ thông tin sau khi chỉnh sửa của bạn sẽ được duyệt thông qua "Người quản trị trang web". Nếu thông tin của bạn được xác thực, Người quản trị trang web sẽ cập nhật lại thông tin hiện tại.
                </Alert>
            </Space>

            <InputField name='name' label='Tên nhà trọ' type='text' margin='dense' control={control} required />
            <InputField name='address' label='Địa chỉ' type='text' margin='dense' control={control} required />

            <AutoCompleteField label="Trường học lân cận" title='name' error={errors.school?.message} freeSolo value={selectedSchool} onChange={handleSelectSchool} size='small' multiple disabled={optionsSchool.length > 0 ? false : true} options={optionsSchool} />

            <InputField name='desc' label='Mô tả nhà trọ' type='text' multiline={true} rows={10} margin='dense' control={control} />

            <Box className={classes.wrap} my={1}>
                <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                    Thông tin liên hệ
                </Typography>

                <div style={{ borderLeft: '1px solid #999', paddingLeft: 8 }}>
                    <InputFieldIcon name='contact.phone' label='Điện thoại' type="text" marginOut='dense' marginIn='dense' control={control} placeholder='0123456789' icon={<Phone />} />
                    <InputFieldIcon name='contact.email' label='Email' type="email" marginOut='dense' marginIn='dense' control={control} placeholder='abc@gmail.com' icon={<Email />} />
                    <InputFieldIcon name='contact.facebook' label='Facebook' type="text" marginOut='dense' marginIn='dense' control={control} placeholder='Gán đường dẫn đến facebook của bạn' icon={<Facebook />} />
                    <InputFieldIcon name='contact.zalo' label='Zalo' placeholder='Số điện thoại zalo của bạn' type="text" marginOut='dense' marginIn='dense' control={control} icon={<Zalo />} />
                </div>
            </Box>

            <RadioBtnField name='status' label="Trạng thái" handleChange={handleChangeRadio} options={radioOptions} margin='dense' control={control} />

            {status && <InputField name='available' label='Số phòng trống' type='number' min={0} max={99} margin='dense' control={control} />}

            {selectedThumbnail
                ? <Box className={classes.imgField}>
                    <Typography className={classes.titleWrap}>
                        Ảnh giới thiệu
                    </Typography>

                    <Box className={classes.imgRow} style={{ gridTemplateColumns: '100%' }}>
                        <Box className={classes.imgWrap} style={{ height: 'auto', maxHeight: 200 }}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={removeThumbnail}>
                                <Tooltip title="Xóa">
                                    <DeleteOutline />
                                </Tooltip>
                            </Box>

                            <img
                                src={typeof selectedThumbnail === 'string' ? selectedThumbnail : URL.createObjectURL(selectedThumbnail)}
                                alt="thumbnail"
                            />
                        </Box>
                    </Box>
                </Box>
                : <FileInputField name='thumbnail' label="Ảnh giới thiệu" accept='.png, .jpg, .jpeg' error={errThumnail} onChange={handleChangeThumbnail} margin='dense' required />
            }

            <FileInputField name='images' label="Ảnh khác" accept='.png, .jpg, .jpeg' error={errImages} onChange={handleChangeImages} multiple={true} margin='dense' />
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
                                alt="Tìm nhà trọ sinh viên" />
                        </Box>
                    ))}
                </Box>
            }

            <Box mt={3}>
                <Button type='submit' color="primary" variant='outlined' fullWidth>
                    Cập nhật
                </Button>
            </Box>
        </form>
    )
}
