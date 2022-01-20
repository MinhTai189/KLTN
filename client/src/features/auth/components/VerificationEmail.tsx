import { Box, makeStyles, Typography } from "@material-ui/core"
import { LinearScale } from "@material-ui/icons"
import { Alert } from '@material-ui/lab'
import { useCallback, useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { convertSecondIntoMS } from "utils"
import Header from './Header'

interface Props {
    sendMailSuccess: boolean
    handleVerificationEmail: (email: string) => void
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
        }
    }
}))

const VerificationEmail = ({ sendMailSuccess, handleVerificationEmail }: Props) => {
    const classes = useStyles()
    const location = useLocation<{ email: string }>()
    const history = useHistory()
    const [count, setCount] = useState({
        seconds: 0,
        text: ''
    })

    const handleSubmit = useCallback(() => {
        if (!location.state?.email) return

        handleVerificationEmail(location.state.email)
    }, [handleVerificationEmail, location.state])

    useEffect(() => {
        if (!location.state?.email) history.push('/')
    }, [location.state, history])

    useEffect(handleSubmit, [handleSubmit, location.state])

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
            <Header textBtn='Một bước cuối cùng' icon={<LinearScale />} />

            <Alert severity="info">
                Còn một bước nữa là bạn đã tạo xong tài khoản. Hãy thực hiện xác thực email.
                Chúng tôi đã gửi mail xác thực đến địa chỉ email của bạn!!!
            </Alert>

            <Box my={2}>
                <Alert severity="info">
                    {'Nếu bạn không tìm thấy mail xác thực. Hãy kiểm tra hòm thư rác của bạn, vì có thể mail của chúng tôi nằm ở đó :(('}
                </Alert>
            </Box>

            <Box mt={5}>
                <Alert severity="info">
                    Nếu bạn không nhận được mail xác thực hoặc quá trình gửi mail bị lỗi. Hãy thực hiện gửi!
                </Alert>

                <Box className='resent' mt={2}>
                    <Typography className='text'>
                        Gửi lại mail: {count.seconds !== 0 ? count.text : ''}

                        {count.seconds === 0 &&
                            <button
                                className='btn-resent'
                                onClick={handleSubmit}
                            >
                                Gửi lại
                            </button>
                        }
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default VerificationEmail
