import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, makeStyles } from '@material-ui/core'
import { PersonOutline } from '@material-ui/icons'
import districtApi from 'api/district'
import provinceApi from 'api/province'
import schoolApi from 'api/school'
import { District, ListResponse, Province, School } from 'models'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { removeAccents, removeFirstElement } from 'utils'
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
        padding: theme.spacing(2, 4),
        backgroundColor: '#fff'
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

const changeNameProvince = (name: string) => {
    const split: string[] = name.split(' ');
    const newName: string[] = removeAccents(split[0].toLocaleLowerCase()) === 'tinh' ? removeFirstElement(split) : split;
    return newName.join(' ');
}

const mapProvinces = (provinces: Array<Province>) => {
    return provinces.map(province => ({
        ...province,
        name: changeNameProvince(province.name)
    }))
}

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
    const [province, setProvince] = useState('');
    const [optionsProvince, setOptionsProvince] = useState<Array<Province>>([]);

    const [district, setDistrict] = useState('');
    const [optionsDistrict, setOptionsDistrict] = useState<Array<District>>([]);
    const [optionsSchool, setOptionsSchool] = useState<Array<School>>([]);

    const { control, handleSubmit, setValue } = useForm<RegisterFBGG>({
        defaultValues: initialRegisterFBGG,
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        provinceApi.getAll()
            .then((response: ListResponse<Province>) => {
                const listProvince = mapProvinces(response.data)
                setOptionsProvince(listProvince)
            })
            .catch(err => console.log("Khong the lay du lieu provinces", err.message)
            );
    }, [])

    const handleProvinceSelected = async (e: any, value: Province) => {
        if (value?.codeName) {
            setProvince(value.codeName)
            setValue('province', value.codeName)

            const response: ListResponse<District> = await districtApi.getByCodeProvince(value.codeName);
            setOptionsDistrict(response.data);
        }
    }

    const handleDistrictSelected = async (e: any, value: District) => {
        if (value?.codeName) {
            setDistrict(value.codeName)
            setValue('district', value.codeName)

            const response: ListResponse<School> = await schoolApi.getByProDis(province, value.codeName)
            setOptionsSchool(response.data);
        }
    }

    return (
        <Box className={classes.root}>
            <Header textBtn='Thông tin bổ sung' icon={<PersonOutline />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!isLoginGG &&
                        <InputField type="email" name='email' label='Email' control={control} required={true} />}

                    <AutoCompleteField label="Tỉnh*" title='name' onChange={handleProvinceSelected} options={optionsProvince} disabled={optionsProvince.length === 0 ? true : false} />

                    <AutoCompleteField label="Quận/Huyện/TP*" title='name' onChange={handleDistrictSelected} options={optionsDistrict} disabled={optionsDistrict.length === 0 ? true : false} />

                    <SelectField label='Trường*' name='school' control={control} disabled={optionsSchool.length === 0 ? true : false} options={optionsSchool} />

                    <Box mt={2}>
                        <Button type='submit' variant='contained' color="primary" size='large' fullWidth>
                            Đăng ký
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default AddiRegister
