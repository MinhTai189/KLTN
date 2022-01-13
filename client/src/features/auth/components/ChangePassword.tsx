import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import { Lock } from '@material-ui/icons'
import axiosClient from 'api/axiosClient'
import { ButtonCustom } from 'components/Common/Button'
import { InputPasswordField } from 'components/FormFields'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { ChangePassword as ChangePasswordModel } from '../models'
import Header from './Header'

const intialResetPasswordData: ChangePasswordModel = {
    oldPassword: '',
    password: '',
    confirmPassword: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        padding: theme.spacing(3, 4),
        backgroundColor: '#fff',
        outline: `7px solid ${theme.palette.primary.main}`,
        zIndex: 10,
    },
}))

const schema = yup.object().shape({
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
})

const ChangePassword = () => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)

    const history = useHistory()
    const { control, handleSubmit } = useForm<ChangePasswordModel>({
        defaultValues: intialResetPasswordData,
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: ChangePasswordModel) => {
        try {
            setLoading(true)

            await axiosClient.patch('/change-password', data)

            setLoading(false)
            toast.success("Đổi mật khẩu thành công, dùng mật khẩu mới đăng nhập lại!")
            history.push('/auth/login')
        }
        catch (err: any) {
            if (err.response?.data.message)
                toast.error(err.response.data.message)
            setLoading(false)
        }
    }

    return (
        <Box className={classes.root}>
            <Header textBtn='Đổi mật khẩu' icon={<Lock />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputPasswordField name='oldPassword' control={control} label='Mật khẩu cũ' labelWidth={90} required={true} />
                    <InputPasswordField name='password' control={control} label='Mật khẩu mới' labelWidth={100} required={true} />
                    <InputPasswordField name='confirmPassword' control={control} label='Xác nhận mật khẩu' labelWidth={140} required={true} />

                    <Box my={2}>
                        <ButtonCustom type='submit' fullWidth sizeBtn="xlarge" disabled={loading}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Xác nhận
                        </ButtonCustom>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ChangePassword
