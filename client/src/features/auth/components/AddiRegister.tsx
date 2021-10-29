import { yupResolver } from '@hookform/resolvers/yup'
import { Box, makeStyles } from '@material-ui/core'
import { PersonOutline } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import districtApi from 'api/district'
import schoolApi from 'api/school'
import { ButtonCustom } from 'components/Common/Button'
import { useProvince } from 'hooks'
import { District, FieldOption, ListResponse, Province, School } from 'models'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { mapOptions } from 'utils'
import * as yup from 'yup'
import { AutoCompleteField, InputField } from '../../../components/FormFields'
import { SelectField } from '../../../components/FormFields/SelectField'
import { AddiRegisterData } from '../models'
import Header from './Header'

interface Props {
    onSubmit: (data: AddiRegisterData) => void
    isLoginGG: boolean
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 600,
        padding: theme.spacing(3, 4),
        backgroundColor: '#fff',
        outline: `7px solid ${theme.palette.primary.main}`,
        zIndex: 10,
    },
}))

const schema = yup.object().shape({
    email: yup
        .string()
        .email('Hãy kiểm tra lại email'),
    province: yup
        .string()
        .required(),
    district: yup
        .string()
        .required(),
    school: yup
        .string()
        .required('Hãy chọn đủ Tỉnh, Quận/Huyện/TP và Trường')
})

interface RegisterFBGG {
    email: string;
    province: string;
    district: string;
    school: string
}

const initialRegisterFBGG = {
    email: '',
    province: '',
    district: '',
    school: ''
}

const AddiRegister = ({ onSubmit, isLoginGG }: Props) => {
    const classes = useStyles()
    const [province, setProvince] = useState<Province>();
    const { optionsProvince } = useProvince()

    const [district, setDistrict] = useState<District | string>('');
    const [optionsDistrict, setOptionsDistrict] = useState<Array<District>>([]);
    const [optionsSchool, setOptionsSchool] = useState<Array<FieldOption>>([]);

    const { control, handleSubmit, setValue } = useForm<RegisterFBGG>({
        defaultValues: initialRegisterFBGG,
        resolver: yupResolver(schema),
    })

    const handleProvinceSelected = async (e: any, value: Province) => {
        if (value?.codeName) {
            setProvince(value)
            setValue('province', value.codeName)

            setDistrict('')
            setValue('school', '')

            const response: ListResponse<District> = await districtApi.getByCodeProvince(value.codeName);
            setOptionsDistrict(response.data);
        }
    }

    const handleDistrictSelected = async (e: any, value: District) => {
        if (value?.codeName) {
            setDistrict(value)
            setValue('district', value.codeName)

            setValue('school', '')
            const response: ListResponse<School> = await schoolApi.getByProDis(province?.codeName as string, value.codeName)
            const options = mapOptions.school(response.data)

            setOptionsSchool(options);
        }
    }

    return (
        <Box className={classes.root}>
            <Header textBtn='Thông tin bổ sung' icon={<PersonOutline />} />

            <Box>
                <Alert severity="info">{`Bạn cần bổ sung thêm một số thông tin để hoàn tất quá trình đăng nhập bằng ${isLoginGG ? "Google" : "Facebook"}`}</Alert>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {!isLoginGG &&
                        <InputField type="email" name='email' label='Email' control={control} required={true} />}

                    <AutoCompleteField label="Tỉnh*" title='name' value={province} onChange={handleProvinceSelected} options={optionsProvince} disabled={optionsProvince.length === 0 ? true : false} />

                    <AutoCompleteField label="Quận/Huyện/TP*" title='name' value={district} onChange={handleDistrictSelected} options={optionsDistrict} disabled={optionsDistrict.length === 0 ? true : false} />

                    <SelectField label='Trường*' name='school' control={control} disabled={optionsSchool.length === 0 ? true : false} options={optionsSchool} mt={16} mb={8} />

                    <Box my={2}>
                        <ButtonCustom type='submit' sizeBtn='xlarge' fullWidth>
                            Đăng ký
                        </ButtonCustom>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default AddiRegister
