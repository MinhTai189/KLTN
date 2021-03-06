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
    }, [])

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
            <Header textBtn='M???t b?????c cu???i c??ng' icon={<LinearScale />} />

            <Alert severity="info">
                C??n m???t b?????c n???a l?? b???n ???? t???o xong t??i kho???n. H??y th???c hi???n x??c th???c email.
                Ch??ng t??i ???? g???i mail x??c th???c ?????n ?????a ch??? email c???a b???n!!!
            </Alert>

            <Box my={2}>
                <Alert severity="info">
                    {'N???u b???n kh??ng t??m th???y mail x??c th???c. H??y ki???m tra h??m th?? r??c c???a b???n, v?? c?? th??? mail c???a ch??ng t??i n???m ??? ???? :(('}
                </Alert>
            </Box>

            <Box mt={5}>
                <Alert severity="info">
                    N???u b???n kh??ng nh???n ???????c mail x??c th???c ho???c qu?? tr??nh g???i mail b??? l???i. H??y th???c hi???n g???i!
                </Alert>

                <Box className='resent' mt={2}>
                    <Typography className='text'>
                        G???i l???i mail: {count.seconds !== 0 ? count.text : ''}

                        {count.seconds === 0 &&
                            <button
                                className='btn-resent'
                                onClick={handleSubmit}
                            >
                                G???i l???i
                            </button>
                        }
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default VerificationEmail
