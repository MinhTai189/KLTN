import { Box, Button, CircularProgress, IconButton, makeStyles, Typography } from '@material-ui/core'
import { LockOpen } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { useAppSelector } from 'app/hooks'
import React, { ReactElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import { ReactComponent as Google } from '../../../assets/images/google.svg'
import { ReactComponent as Facebook } from '../../../assets/images/facebook.svg'
import { CheckboxField, InputField, InputPasswordField } from '../../../components/FormFields'
import { selectErr, selectLoading } from '../authSlice'
import { LoginData } from '../models'
import Header from './Header'
import { useGoogleLogin, useGoogleLogout } from '@toxa23/react-google-login'
import useFacebook from "react-easy-facebook";

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
        padding: theme.spacing(2, 4),
        backgroundColor: '#fff',
    },
    wrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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


    return (
        <Box className={classes.root}>
            <Header textBtn='ĐĂNG NHẬP' icon={<LockOpen />} />
            {err && <Alert severity="error">Tài khoản hoặc mật khẩu không chính xác!</Alert>}
            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField type="text" control={control} name='username' label='Tài khoản' required={true} />
                    <InputPasswordField control={control} label="Mật khẩu" name='password' labelWidth={70} required={true} />

                    <Box>
                        <CheckboxField setValue={setRememberMe} label='Ghi nhớ đăng nhập' />
                    </Box>

                    <Box mt={1}>
                        <Button type="submit" size="large" variant="contained" color="primary" fullWidth >
                            {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                            Đăng nhập
                        </Button>
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
