import { Box, Button, makeStyles } from '@material-ui/core'
import { Lock } from '@material-ui/icons'
import { InputPasswordField } from 'components/FormFields'
import { ResetPasswordData } from '../models'
import Header from './Header'
import { useForm } from 'react-hook-form'

interface Props {
    onSubmit: (data: ResetPasswordData) => void
}

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


const ResetPassword = ({ onSubmit }: Props) => {
    const classes = useStyles()
    const { control, handleSubmit } = useForm<ResetPasswordData>({
        defaultValues: intialResetPasswordData
    })

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
