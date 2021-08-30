import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, makeStyles } from '@material-ui/core'
import { Lock } from '@material-ui/icons'
import axiosClient from 'api/axiosClent'
import { InputPasswordField } from 'components/FormFields'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'
import { ResetPasswordData } from '../models'
import Header from './Header'

const intialResetPasswordData: ResetPasswordData = {
    password: '',
    confirmPassword: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        padding: theme.spacing(2, 4),
        backgroundColor: '#fff'
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

interface Token {
    token: string
}

const ResetPassword = () => {
    const classes = useStyles()
    const { token } = useParams<Token>()
    const { control, handleSubmit } = useForm<ResetPasswordData>({
        defaultValues: intialResetPasswordData,
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: ResetPasswordData) => {
        try {
            await axiosClient.post('/reset-password', {
                password: data.password,
                token
            })
        }
        catch (err) {
            console.log('reset password', err.message);
        }
    }

    return (
        <Box className={classes.root}>
            <Header textBtn='Đổi mật khẩu' icon={<Lock />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputPasswordField name='password' control={control} label='Mật khẩu' labelWidth={70} required={true} />
                    <InputPasswordField name='confirmPassword' control={control} label='Xác nhận mật khẩu' labelWidth={140} required={true} />

                    <Box my={2}>
                        <Button type='submit' variant='contained' fullWidth color='primary' size="large">
                            Xác nhận
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ResetPassword
