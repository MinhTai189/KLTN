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
        .trim('T??n kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i')
        .max(50, 'T???i ??a 70 k?? t???')
        .required('H??y th??m t??n nh?? tr???'),
    address: yup
        .string()
        .strict()
        .trim('?????a ch??? kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i')
        .max(50, 'T???i ??a 150 k?? t???')
        .required('H??y th??m ?????a ch???'),
    desc: yup
        .string()
        .required('H??y vi???t m???t ??t m?? t??? v??? nh?? tr??? c???a b???n. Gi??p cho m???i ng?????i t??m ki???m nh?? tr??? ch??nh x??c h??n')
        .strict()
        .trim('M?? t??? kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i'),
    contact: yup
        .object()
        .shape({
            phone: yup
                .string()
                .strict()
                .trim('?????a ch??? kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i'),
            email: yup
                .string()
                .email('Email kh??ng h???p l???'),
            zalo: yup
                .string()
                .strict()
                .trim('?????a ch??? kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i'),
            facebook: yup
                .string()
                .strict()
                .trim('?????a ch??? kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i')
        }),
    school: yup
        .array()
        .min(1, 'H??y cung c???p tr?????ng h???c xung quanh khu v???c nh?? tr???'),
    status: yup
        .string()
        .required(),
    available: yup
        .number(),
})

const radioOptions: Array<FieldOption> = [
    {
        label: 'C??n tr???ng',
        value: 'yes'
    },
    {
        label: 'H???t ph??ng',
        value: 'no'
    }
]

type FormState = Omit<MotelOnly, 'invalid'>

export const EditMotelForm = ({ updateData, onClickUpdateMotel, handleUploadThumbnail, handleUploadImages }: Props) => {
    const classes = useStyles()

    const { handleSubmit, control, setError, formState: { errors }, setValue, getValues } = useForm<FormState>({
        defaultValues: {
            _id: updateData._id,
            name: updateData.name,
            address: updateData.address,
            desc: updateData.desc,
            contact: updateData.contact,
            school: updateData.school,
            status: updateData.status,
            available: updateData.available,
            thumbnail: updateData.thumbnail,
            images: updateData.images
        },
        resolver: yupResolver(schema)
    })
    const [selectedSchool, setSelectedSchool] = useState<Array<School>>(updateData.school)

    const [optionsSchool, setOptionsSchool] = useState<Array<School>>([])
    const [status, setStatus] = useState(getValues('status'))

    const [selectedThumbnail, setSelectedThumbnail] = useState<any>(updateData.thumbnail)
    const [selectedImages, setSelectedImages] = useState<any>(updateData.images)

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
            setErrThumbnail('K??ch th?????c ???nh kh??ng ???????c v?????t qu?? 500KB')
        } else {
            setErrThumbnail('')

            setSelectedThumbnail(e.target.files ? e.target.files[0] : undefined)
            handleUploadThumbnail(e.target.files)
        }
    }

    const removeThumbnail = () => {
        setSelectedThumbnail(undefined)
    }

    //handle images
    const handleChangeImages = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (files && files.length !== 0) {
            if (files?.length > 8) {
                setErrImages('Ch??? ???????c ch???n t???i ???? 8 ???nh')
            } else if (!checkSizeImg(files)) {
                setErrImages('K??ch th?????c m???i ???nh kh??ng ???????c v?????t qu?? 500KB')
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
                    B???n c?? th??? ch???nh s???a l???i th??ng tin c???a nh?? tr??? tr??? n???u nh?? th??ng tin kh??ng ch??nh x??c.
                </Alert>

                <Alert severity='info'>
                    To??n b??? th??ng tin sau khi ch???nh s???a c???a b???n s??? ???????c duy???t th??ng qua "Ng?????i qu???n tr??? trang web". N???u th??ng tin c???a b???n ???????c x??c th???c, Ng?????i qu???n tr??? trang web s??? c???p nh???t l???i th??ng tin hi???n t???i.
                </Alert>
            </Space>

            <InputField name='name' label='T??n nh?? tr???' type='text' margin='dense' control={control} required />
            <InputField name='address' label='?????a ch???' type='text' margin='dense' control={control} required />

            <AutoCompleteField label="Tr?????ng h???c l??n c???n" title='name' error={errors.school?.message} freeSolo value={selectedSchool} onChange={handleSelectSchool} size='small' multiple disabled={optionsSchool.length > 0 ? false : true} options={optionsSchool} />

            <InputField name='desc' label='M?? t??? nh?? tr???' type='text' multiline={true} rows={10} margin='dense' control={control} />

            <Box className={classes.wrap} my={1}>
                <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                    Th??ng tin li??n h???
                </Typography>

                <div style={{ borderLeft: '1px solid #999', paddingLeft: 8 }}>
                    <InputFieldIcon name='contact.phone' label='??i???n tho???i' type="text" marginOut='dense' marginIn='dense' control={control} placeholder='0123456789' icon={<Phone />} />
                    <InputFieldIcon name='contact.email' label='Email' type="email" marginOut='dense' marginIn='dense' control={control} placeholder='abc@gmail.com' icon={<Email />} />
                    <InputFieldIcon name='contact.facebook' label='Facebook' type="text" marginOut='dense' marginIn='dense' control={control} placeholder='G??n ???????ng d???n ?????n facebook c???a b???n' icon={<Facebook />} />
                    <InputFieldIcon name='contact.zalo' label='Zalo' placeholder='S??? ??i???n tho???i zalo c???a b???n' type="text" marginOut='dense' marginIn='dense' control={control} icon={<Zalo />} />
                </div>
            </Box>

            <RadioBtnField name='status' label="Tr???ng th??i" handleChange={handleChangeRadio} options={radioOptions} margin='dense' control={control} />

            {status && <InputField name='available' label='S??? ph??ng tr???ng' type='number' min={0} max={99} margin='dense' control={control} />}

            {selectedThumbnail
                ? <Box className={classes.imgField}>
                    <Typography className={classes.titleWrap}>
                        ???nh gi???i thi???u
                    </Typography>

                    <Box className={classes.imgRow} style={{ gridTemplateColumns: '100%' }}>
                        <Box className={classes.imgWrap} style={{ height: 'auto', maxHeight: 200 }}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={removeThumbnail}>
                                <Tooltip title="X??a">
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
                : <FileInputField name='thumbnail' label="???nh gi???i thi???u" accept='.png, .jpg, .jpeg' error={errThumnail} onChange={handleChangeThumbnail} margin='dense' required />
            }

            <FileInputField name='images' label="???nh kh??c" accept='.png, .jpg, .jpeg' error={errImages} onChange={handleChangeImages} multiple={true} margin='dense' />
            {selectedImages?.length > 0 &&
                <Box className={classes.imgRow}>
                    {selectedImages.map((image: any, index: number) => (
                        <Box className={classes.imgWrap} key={index}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={() => removeImages(index)}>
                                <Tooltip title="X??a">
                                    <DeleteOutline />
                                </Tooltip>
                            </Box>

                            <img
                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                alt="T??m nh?? tr??? sinh vi??n" />
                        </Box>
                    ))}
                </Box>
            }

            <Box mt={3}>
                <Button type='submit' color="primary" variant='outlined' fullWidth>
                    C???p nh???t
                </Button>
            </Box>
        </form>
    )
}
