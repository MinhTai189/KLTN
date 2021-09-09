import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core'
import { AlternateEmail } from '@material-ui/icons'
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
        padding: theme.spacing(2, 4),
        backgroundColor: '#fff'
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
                        <Button type="submit" variant='contained' fullWidth color='primary' size="large" disabled={loading}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Xác nhận
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ForgotPasswork
