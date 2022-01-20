import { Box, CircularProgress, IconButton, makeStyles, Typography } from '@material-ui/core'
import { LockOpen } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { useGoogleLogin, useGoogleLogout } from '@toxa23/react-google-login'
import { useAppSelector } from 'app/hooks'
import { ButtonCustom } from 'components/Common/Button'
import { ReactElement, useEffect } from 'react'
import useFacebook from "react-easy-facebook"
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import { clearToken } from 'utils'
import { ReactComponent as Facebook } from '../../../assets/images/facebook.svg'
import { ReactComponent as Google } from '../../../assets/images/google.svg'
import { CheckboxField, InputField, InputPasswordField } from '../../../components/FormFields'
import { selectErr, selectLoading } from '../authSlice'
import { LoginData } from '../models'
import Header from './Header'

interface Props {
    onSubmit: (data: LoginData) => void;
    setRememberMe: (value: boolean) => void;
    onSuccessGG: (response: any) => void;
    onSuccessFB: (response: any) => void;
}

const initialLoginData: LoginData = {
    username: '',
    password: '',
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
        }
    },
    wrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%',

        "& a": {
            color: theme.palette.primary.main
        }
    },
    svg: {
        width: 22,
        height: 22,
    },
    loginBy: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',

        "& > p": {
            marginBottom: -7
        }
    }
}))

function FormLogin({ onSubmit, setRememberMe, onSuccessGG, onSuccessFB }: Props): ReactElement {
    const classes = useStyles()
    const clientId = '643013812637-sjj5ejfidpkjk93pt9l4t3qleplnof1m.apps.googleusercontent.com'
    const appId = '985420175361023'
    const errMessage = useAppSelector(selectErr)

    const loading = useAppSelector(selectLoading)
    const { control, handleSubmit } = useForm<LoginData>({
        defaultValues: initialLoginData
    })
    const err = useAppSelector(selectErr)

    // login with google
    const { signIn } = useGoogleLogin({
        clientId,
        onSuccess: onSuccessGG
    })

    const { signOut } = useGoogleLogout({
        clientId
    })

    // login with facebook
    const { response, login, logout } = useFacebook({
        appId,
        options: {
            scope: "email",
        },
        fields: "id, name, email, picture",
    });

    useEffect(() => {
        onSuccessFB(response)

        return () => {
            signOut()
            logout()
        }
    }, [response])

    useEffect(() => {
        clearToken()
    }, [])

    return (
        <Box className={classes.root}>
            <Header textBtn='ĐĂNG NHẬP' icon={<LockOpen />} />
            {err && <Alert severity="error">{errMessage}</Alert>}
            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField type="text" control={control} name='username' label='Tài khoản' required={true} />
                    <InputPasswordField control={control} label="Mật khẩu" name='password' labelWidth={70} required={true} />

                    <Box>
                        <CheckboxField setValue={setRememberMe} label='Ghi nhớ đăng nhập' />
                    </Box>

                    <Box mt={1}>
                        <ButtonCustom type="submit" sizeBtn="xlarge" fullWidth >
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Đăng nhập
                        </ButtonCustom>
                    </Box>
                </form>

                <Box my={1} className={classes.wrap}>
                    <Link to="/auth/forgot-password">
                        Quên mật khẩu?
                    </Link>

                    <Link to="/auth/register">
                        Bạn chưa có tài khoản? Đăng ký
                    </Link>
                </Box>

                <Box className={classes.loginBy} mt={5} mb={1}>
                    <Typography component='p'>Đăng nhập với:</Typography>

                    <IconButton onClick={() => signIn()}>
                        <Google className={classes.svg} />
                    </IconButton>

                    <IconButton onClick={() => login()}>
                        <Facebook className={classes.svg} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default FormLogin
