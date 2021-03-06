import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, Grid, makeStyles, Theme } from "@material-ui/core"
import { Alert } from '@material-ui/lab'
import { CameraAlt } from "@material-ui/icons"
import districtApi from "api/district"
import schoolApi from "api/school"
import { useAppSelector } from 'app/hooks'
import { ButtonSubmit } from "components/Common"
import { AutoCompleteField, InputField } from "components/FormFields"
import { SelectField } from "components/FormFields/SelectField"
import { selectOptionsAutoCompProVince } from 'features/province/provinceSlice'
import { District, ListResponse, School, UpdateData } from "models"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { mapOptions } from 'utils'
import * as yup from 'yup'
import { checkSizeImg } from 'utils'
import { VALIDATOR_IMAGE } from 'constant/constant'

interface Props {
    loading: boolean
    updateUserData: UpdateData
    handleSubmitEdit: (data: UpdateData, avatar: File | undefined) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& .avatar-input': {
            width: 100,
            height: 100,
            borderRadius: 100,
            boxShadow: theme.shadows[2],
            overflow: 'hidden',
            border: '3px solid #fff',
            marginBottom: theme.spacing(3),
            position: 'relative',

            '&:hover': {
                '& .overlay': {
                    opacity: 1,
                }
            },

            '& > img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            },

            '& .overlay': {
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(0,0,0,0.45)',
                opacity: 0,
                transition: '300ms',

                '& > .MuiSvgIcon-root': {
                    fill: '#fff',
                    width: '2rem',
                    height: '2rem',
                }
            },

            '& > .file-input': {
                position: 'absolute',
                inset: 0,
                cursor: 'pointer',
                opacity: 0,
                visibility: 'visible'
            }
        }
    }
}))

const schema = yup.object().shape({
    name: yup
        .string()
        .trim('Kh??ng ???????c ch???a kho???ng tr???ng ??? ?????u v?? cu???i')
        .strict()
        .min(1, "T???i thi???u 1 k?? t???")
        .max(30, "T???i thi???u 30 k?? t???"),
    email: yup
        .string()
        .email('H??y ki???m tra l???i email'),
    province: yup
        .string()
        .required(),
    district: yup
        .string()
        .required(),
    school: yup
        .string()
        .required('H??y ch???n ????? T???nh, Qu???n/Huy???n/TP v?? Tr?????ng')
})

export const ModalBodyEdit = ({ loading, updateUserData, handleSubmitEdit }: Props) => {
    const classes = useStyles()
    const optionsProvince = useAppSelector(selectOptionsAutoCompProVince)
    const [showAvatarErr, setShowAvatarErr] = useState(false)

    const [optionsDistrict, setOptionsDistrict] = useState<any[]>([])
    const [optionsSchool, setOptionsSchool] = useState<any[]>([])

    const [selectedProvince, setSelectedProvince] = useState<any>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
    const [selectedAvatar, setSelectedAvatar] = useState<File | undefined>()

    const { handleSubmit, control, getValues, setValue, formState: { isDirty } } = useForm({
        defaultValues: updateUserData,
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        // get default value for province field
        if (optionsProvince.length > 0) {
            const option = optionsProvince.find((e: any) => e.value === updateUserData.province)
            setSelectedProvince(option || null)
        }
    }, [updateUserData, optionsProvince])

    useEffect(() => {
        districtApi.getByCodeProvince(updateUserData.province)
            .then(res => {
                const options = mapOptions.autoComp(res.data)
                setOptionsDistrict(options)
                setSelectedDistrict(options.find((x: any) => x.value === updateUserData.district) || null)
            })

        schoolApi.getByProDis(updateUserData.province, updateUserData.district)
            .then(res => {
                const options = mapOptions.school(res.data)
                setOptionsSchool(options)
                setValue('school', options.find((x: any) => x.value === updateUserData.school)?.value || '')
            })
    }, [updateUserData, setValue])

    const handleProvinceSelected = async (e: any, value: any) => {
        if (value) {
            setSelectedProvince(value)
            setValue('province', value.value)

            //reset district, school field when province filed is changed
            setSelectedDistrict('')
            setValue('school', '')

            const response: ListResponse<District> = await districtApi.getByCodeProvince(value.value);

            const options = mapOptions.autoComp(response.data)
            setOptionsDistrict(options);
        }
    }

    const handleDistrictSelected = async (e: any, value: any) => {
        if (value) {
            setSelectedDistrict(value)
            setValue('district', value.value)

            setValue('school', '')

            const response: ListResponse<School> = await schoolApi.getByProDis(getValues('province'), value.value)
            const options = mapOptions.school(response.data)

            setOptionsSchool(options);
        }
    }

    const handleSelectAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files) return

        const checkSize = checkSizeImg(files)
        setShowAvatarErr(!checkSize)

        if (!checkSize) return

        setSelectedAvatar(files[0])
    }

    const handleSubmitForm = (data: UpdateData) => {
        if (isDirty || selectedAvatar)
            handleSubmitEdit(data, selectedAvatar)
    }

    return (
        <Box
            className={classes.root}
            component='form'
            onSubmit={handleSubmit(handleSubmitForm)}
        >
            <Box className='avatar-input'>
                <img
                    src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : getValues('avatarUrl')!}
                    alt="avatar"
                />

                <Box className='overlay'>
                    <CameraAlt />
                </Box>

                <input type="file" className='file-input' accept={VALIDATOR_IMAGE.accept} onChange={handleSelectAvatar} />
            </Box>

            {showAvatarErr && <Alert severity='error'>
                K??ch th?????c ???nh ph???i nh??? h??n 500KB!
            </Alert>}

            <InputField type="text" control={control} name='name' label='H??? v?? t??n*' required sizeField='small' />

            <InputField type="email" control={control} name='email' disabled label='Email*' required sizeField='small' />

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    {optionsProvince.length > 0 &&
                        <AutoCompleteField label="T???nh*" title='label' value={selectedProvince} onChange={handleProvinceSelected} size='small' options={optionsProvince} />}
                </Grid>

                <Grid item sm={6}>
                    {optionsDistrict.length > 0 && <AutoCompleteField label="Qu???n/Huy???n/TP*" title='label' value={selectedDistrict} onChange={handleDistrictSelected} size='small' options={optionsDistrict} disabled={false} />}
                </Grid>
            </Grid>

            {optionsSchool && <SelectField label='Tr?????ng*' name='school' control={control} options={optionsSchool} mt={19} mb={8} size='small' />}

            <Box style={{ width: '100%' }} mt={2}>
                <ButtonSubmit
                    type='submit'
                    color='primary'
                    fullWidth
                    variant='contained'
                    disabled={loading}
                >
                    {loading && <><CircularProgress color='secondary' size={15} /> &nbsp;</>}
                    C???p nh???t
                </ButtonSubmit>
            </Box>
        </Box>
    )
}
