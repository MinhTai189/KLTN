import { Box, Theme, Button } from '@material-ui/core'
import { DeleteOutline, Email, Facebook, Phone } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Tooltip, Typography } from 'antd'
import { AutoCompleteField, InputField } from 'components/FormFields'
import { FileInputField } from 'components/FormFields/FileInputField'
import { InputFieldIcon } from 'components/FormFields/InputFieldIcon'
import { RadioBtnField } from 'components/FormFields/RadioBtnField'
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
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
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: 10
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
        .min(1, 'H??y cung c???p tr?????ng h???c xung quanh khu v???c nh?? tr???')
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
    const [selectedSchool, setSelectedSchool] = useState<Array<School>>(selectedMotelUpdate.school)

    useEffect(() => {
        schoolApi.getAll()
            .then((res) => {
                setOptionsSchool(res.data)
            })
            .catch((err) => {
                toast.error(err.response?.data.message)
            })
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
            setErrThumbnail('K??ch th?????c ???nh kh??ng ???????c v?????t qu?? 500KB')
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
            <InputField name='name' label='T??n nh?? tr???' type='text' control={control} required />
            <InputField name='address' label='?????a ch???' type='text' control={control} required />

            <AutoCompleteField label="Tr?????ng h???c l??n c???n" title='name' error={errors.school?.message} freeSolo value={selectedSchool} onChange={handleSelectSchool} multiple disabled={optionsSchool.length > 0 ? false : true} options={optionsSchool} />

            <InputField name='desc' label='M?? t??? nh?? tr???' type='text' multiline={true} rows={10} control={control} />

            <Box className={classes.wrap} mt={3}>
                <Typography className={classes.titleWrap} style={{ fontSize: 16 }}>
                    Th??ng tin li??n h???
                </Typography>

                <Box>
                    <InputFieldIcon name='contact.phone' label='??i???n tho???i' type="text" control={control} placeholder='0123456789' icon={<Phone />} />
                    <InputFieldIcon name='contact.email' label='Email' type="email" control={control} placeholder='abc@gmail.com' icon={<Email />} />
                    <InputFieldIcon name='contact.facebook' label='Facebook' type="text" control={control} placeholder='G??n ???????ng d???n ?????n facebook c???a b???n' icon={<Facebook />} />
                    <InputFieldIcon name='contact.zalo' label='Zalo' placeholder='S??? ??i???n tho???i zalo c???a b???n' type="text" control={control} icon={<Zalo />} />
                </Box>
            </Box>

            <RadioBtnField name='status' label="Tr???ng th??i" handleChange={handleChangeRadio} options={radioOptions} control={control} />

            {status === 'yes' && <InputField name='available' label='S??? ph??ng tr???ng' type='number' min={0} max={99} control={control} />}

            {selectedThumbnail
                ? <Box className={classes.imgField}>
                    <Typography>???nh gi???i thi???u</Typography>

                    <Box className={classes.imgRow} style={{ gridTemplateColumns: '100%' }}>
                        <Box className={classes.imgWrap} style={{ height: 'auto', maxHeight: 200 }}>
                            <Box className={`${classes.imgRemove} img-remove`} onClick={removeThumbnail}>
                                <Tooltip title="X??a">
                                    <DeleteOutline />
                                </Tooltip>
                            </Box>

                            <img
                                src={typeof selectedThumbnail === 'string' ? selectedThumbnail : URL.createObjectURL(selectedThumbnail)}
                                alt="thumbnail" />
                        </Box>
                    </Box>
                </Box>
                : <FileInputField name='thumbnail' label="???nh gi???i thi???u" accept='.png, .jpg, .jpeg' error={errThumnail} onChange={handleChangeThumbnail} required />
            }

            <FileInputField name='images' label="???nh kh??c" accept='.png, .jpg, .jpeg' error={errImages} onChange={handleChangeImages} multiple={true} />
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

            <Box my={3}>
                <Button fullWidth type='submit' variant='contained' color='primary' size='large'>C???p nh???t</Button>
            </Box>
        </form>
    )
}
