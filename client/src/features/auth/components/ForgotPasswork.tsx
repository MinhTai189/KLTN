import { Box, CircularProgress, makeStyles, Typography } from '@material-ui/core'
import { AlternateEmail } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { ButtonCustom } from 'components/Common/Button'
import { InputField } from 'components/FormFields'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { convertSecondIntoMS } from 'utils'
import { ForgotPasswordData } from '../models'
import Header from './Header'

interface Props {
    onSubmit: (data: ForgotPasswordData) => void
    loading: boolean
    sendMailSuccess: boolean
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
        outline: `7px solid ${theme.palette.primary.main}`,
        zIndex: 10,

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 1.5),
        },

        '& .resent': {
            textAlign: 'center',

            '& .btn-resent': {
                background: 'none',
                outline: 'none',
                border: 'none',
                fontSize: '0.9rem',
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                cursor: 'pointer',
            }
        },

        '& .nav-link': {
            '& a': {
                color: theme.palette.primary.main
            }
        }
    },
}))

const ForgotPasswork = ({ onSubmit, loading, sendMailSuccess }: Props) => {
    const classes = useStyles()
    const { control, handleSubmit } = useForm<ForgotPasswordData>({
        defaultValues: initialForgotPassword
    })

    const [count, setCount] = useState({
        seconds: 0,
        text: ''
    })

    useEffect(() => {
        if (sendMailSuccess)
            setCount({ seconds: 90, text: '' })
        else
            setCount({ seconds: 0, text: '' })
    }, [sendMailSuccess])

    useEffect(() => {
        let timeout: number = -1

        if (count.seconds > 0) {
            timeout = window.setTimeout(() => setCount(prev => ({
                seconds: prev.seconds - 1,
                text: convertSecondIntoMS(prev.seconds - 1)
            })), 1000)
        }

        if (count.seconds === 0)
            window.clearTimeout(timeout)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [count])

    return (
        <Box className={classes.root}>
            <Header textBtn='QU??N M???T KH???U' icon={<AlternateEmail />} />

            {sendMailSuccess && <Box my={2}>
                <Alert severity="info">
                    {'N???u b???n kh??ng t??m th???y mail x??c th???c. H??y ki???m tra h??m th?? r??c c???a b???n, v?? c?? th??? mail c???a ch??ng t??i n???m ??? ???? :(('}
                </Alert>
            </Box>}

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField type="email" control={control} name='email' label='Email' required={true} />

                    <Box className='nav-link'>
                        <Link to='/auth/login'>
                            Quay l???i trang ????ng nh???p
                        </Link>
                    </Box>

                    {sendMailSuccess && <Box className='resent' mt={1}>
                        <Typography className='text'>
                            G???i l???i mail sau: {count.seconds !== 0 ? count.text : ''}

                            {count.seconds === 0 && <button type='submit' className='btn-resent'>G???i l???i</button>}
                        </Typography>
                    </Box>}

                    <Box my={2}>
                        <ButtonCustom type="submit" fullWidth sizeBtn="xlarge" disabled={loading && sendMailSuccess}>
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            X??c nh???n
                        </ButtonCustom>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default ForgotPasswork
