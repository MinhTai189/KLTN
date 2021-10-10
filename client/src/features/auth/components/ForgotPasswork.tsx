import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import { AlternateEmail } from '@material-ui/icons'
import { ButtonCustom } from 'components/Common/Button'
import { InputField } from 'components/FormFields'
import { useForm } from 'react-hook-form'
import { ForgotPasswordData } from '../models'
import Header from './Header'

interface Props {
    onSubmit: (data: ForgotPasswordData) => void
    loading: boolean
}

const initialForgotPassword: ForgotPasswordData = {
    email: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        padding: theme.spacing(3, 4),
        backgroundColor: '#fff',
        outline: `7px solid ${theme.palette.primary.main}`
    },
}))

const ForgotPasswork = ({ onSubmit, loading }: Props) => {
    const classes = useStyles()
    const { control, handleSubmit } = useForm<ForgotPasswordData>({
        defaultValues: initialForgotPassword
    })

    return (
        <Box className={classes.root}>
            <Header textBtn='QUÊN MẬT KHẨU' icon={<AlternateEmail />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField type="email" control={control} name='email' label='Email' required={true} />

                    <Box my={2}>
                        <ButtonCustom type="submit" fullWidth sizeBtn="xlarge" disabled={loading}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Xác nhận
                        </ButtonCustom>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ForgotPasswork
