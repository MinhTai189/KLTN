import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, Grid, makeStyles, Typography } from '@material-ui/core'
import { PersonOutline } from '@material-ui/icons'
import districtApi from 'api/district'
import schoolApi from 'api/school'
import { ButtonCustom } from 'components/Common/Button'
import { FileInputField } from 'components/FormFields/FileInputField'
import { PATTERN_USERNAME } from 'constant/constant'
import { useProvince } from 'hooks'
import { District, FieldOption, ListResponse, Province, School } from 'models'
import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { mapOptions } from 'utils'
import * as yup from 'yup'
import { AutoCompleteField, InputField, InputPasswordField } from '../../../components/FormFields'
import { SelectField } from '../../../components/FormFields/SelectField'
import { RegisterData } from '../models'
import Header from './Header'


interface Props {
    onSubmit: (data: RegisterData) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    errAvatar: string
}

const initialRegisterData: RegisterData = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    province: '',
    district: '',
    school: '',
    avatarUrl: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 800,
        padding: theme.spacing(3, 4),
        backgroundColor: '#fff',
        outline: `7px solid ${theme.palette.primary.main}`,
        zIndex: 10,
    },
    grid: {
        padding: theme.spacing(1),
    },
    wrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',

        "& a": {
            textDecoration: 'none',
            color: theme.palette.primary.main
        }
    },
    center: {
        marginLeft: '50%',
        transform: 'translateX(-50%)',
    },
}))

const schema = yup.object().shape({
    username: yup
        .string()
        .min(5, 'Tên tài khoản tối thiếu 5 ký tự')
        .max(15, 'Tên tài khoản tối đa 15 ký tự')
        .strict()
        .trim('Không được chứa khoảng trắng ở đầu và cuối')
        .lowercase('Tên tài khoản không được chứa ký tự in hoa')
        .test('space', 'Tên tài khoản phải là ký tự không dấu và không chứa khoảng trắng', (value) => {
            if (!value) return true;

            const parts = value.split(' ');
            return parts.length === 1 && PATTERN_USERNAME.test(value);
        }),
    password: yup
        .string()
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .max(15, "Mật khẩu tối đa 15 ký tự")
        .trim('Không được chứa khoảng trắng ở đầu và cuối')
        .strict(),
    confirmPassword: yup
        .string()
        .test('passwords-match', 'Mật khẩu xác thực không chính xác', function (value) {
            return this.parent.password === value
        }),
    email: yup
        .string()
        .email('Hãy kiểm tra lại email'),
    name: yup
        .string()
        .trim('Không được chứa khoảng trắng ở đầu và cuối')
        .strict()
        .min(1, "Tối thiểu 1 ký tự")
        .max(30, "Tối thiểu 30 ký tự"),
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

function FormRegister({ onSubmit, onChange, loading, errAvatar }: Props): ReactElement {
    const classes = useStyles()
    const [province, setProvince] = useState<Province>();
    const { optionsProvince } = useProvince()

    const [district, setDistrict] = useState<District | string>('');
    const [optionsDistrict, setOptionsDistrict] = useState<Array<District>>([]);
    const [optionsSchool, setOptionsSchool] = useState<Array<FieldOption>>([]);

    const { control, handleSubmit, setValue } = useForm<RegisterData>({
        defaultValues: initialRegisterData,
        resolver: yupResolver(schema),
    })

    const handleProvinceSelected = async (e: any, value: Province) => {
        if (value?.codeName) {
            setProvince(value)
            setValue('province', value.codeName)

            //reset district, school field when province filed is changed
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
            <Header textBtn='ĐĂNG KÝ' icon={<PersonOutline />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                    <Grid container spacing={2}>
                        <Grid item className={classes.grid} xs={12} md={5}>
                            <Typography variant='h6'>
                                Thông tin tài khoản
                            </Typography>

                            <Box>
                                <InputField type="text" control={control} name='username' label='Tài khoản*' required={true} />

                                <InputPasswordField name='password' control={control} label='Mật khẩu*' labelWidth={70} required={true} />
                                <InputPasswordField name='confirmPassword' control={control} label='Xác nhận mật khẩu*' labelWidth={140} required={true} />

                                <InputField type="email" control={control} name='email' label='Email' required={true} />
                            </Box>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={7}>
                            <Typography variant='h6'>
                                Thông tin cá nhân
                            </Typography>

                            <Box>
                                <InputField type="text" control={control} name='name' label='Họ và tên*' required={true} />

                                <Grid container justifyContent='space-between'>
                                    <Grid item xs={12} md={6}>
                                        <AutoCompleteField label="Tỉnh*" title='name' onChange={handleProvinceSelected} options={optionsProvince} disabled={optionsProvince.length === 0 ? true : false} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <AutoCompleteField label="Quận/Huyện/TP*" title='name' value={district} onChange={handleDistrictSelected} options={optionsDistrict} disabled={optionsDistrict.length === 0 ? true : false} />
                                    </Grid>
                                </Grid>

                                <SelectField label='Trường*' name='school' control={control} disabled={optionsSchool.length === 0 ? true : false} options={optionsSchool} mt={19} mb={8} />

                                <FileInputField name='avatarUrl' onChange={onChange} label='Ảnh đại diện' accept='.png, .jpg, .jpeg' error={errAvatar} />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <ButtonCustom type='submit' sizeBtn='xlarge' fullWidth disabled={loading || !!errAvatar}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Đăng ký
                        </ButtonCustom>
                    </Box>
                </form>

                <Box mt={3} className={classes.center}>
                    <Link to='/auth/login'>
                        <Typography color="primary" align="center">
                            Bạn đã có tài khoản? Đăng nhập
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}

export default FormRegister