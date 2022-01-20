import { Container, makeStyles } from '@material-ui/core';
import authApis from 'api/auth';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useUpload } from 'hooks';
import { Response } from 'models';
import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { calculateCreatedTimeHDMY } from 'utils';
import Background from '../../assets/images/background-auth.jpg';
import { authActions, selectCountLoginWrong } from './authSlice';
import AddiRegister from './components/AddiRegister';
import ChangePassword from './components/ChangePassword';
import ConfirmEmail from './components/ConfirmEmail';
import ForgotPasswork from './components/ForgotPasswork';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import ResetPassword from './components/ResetPassword';
import VerificationEmail from './components/VerificationEmail';
import { AddiRegisterData, ForgotPasswordData, LoginData, RegisterData } from './models';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative',

        '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.1)',
        }
    },
}))

export default function Auth() {
    const classes = useStyles();
    const countLoginWrong = useAppSelector(selectCountLoginWrong)

    const history = useHistory();
    const dispatch = useAppDispatch();
    const { upload } = useUpload()

    const [fileAvatar, setFileAvatar] = useState<File | undefined>();
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [isLoginGG, setIsLoginGG] = useState(false)

    const [tokenGG, setTokenGG] = useState(null)
    const [tokenFB, setTokenFB] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const [errAvatar, setErrAvatar] = useState('')
    const [sendMailSuccess, setSendMailSuccess] = useState(false)

    //hanlde login with Google
    const onSuccesGG = async (res: any) => {
        if (res) {
            const tokenId = res.tokenId;
            setTokenGG(tokenId)

            try {
                const response: Response<any> = await authApis.ggLogin(tokenId)

                if (response.success === false) {
                    setIsLoginGG(true)
                    history.push('/auth/additional')
                }
                else {
                    localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken))
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true }));
                }
            } catch (error: any) {
                dispatch(authActions.loginFailed(error.response.data.message))
            }
        }
    }

    //hanlde login with Facebook
    const onSuccesFB = async (res: any) => {
        if (res && res.authResponse) {
            const { accessToken, userID } = res.authResponse;
            setTokenFB({
                accessToken,
                userID
            })

            try {
                const response: Response<any> = await authApis.fbLogin(accessToken, userID)

                if (response.success === false) {
                    setIsLoginGG(false)
                    history.push('/auth/additional')
                }
                else {
                    localStorage.setItem('accessToken', JSON.stringify(accessToken))
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true }));
                }
            } catch (error: any) {
                dispatch(authActions.loginFailed(error.response.data.message))
            }
        }
    }

    const handleSubmitLogin = (data: LoginData) => {
        let preventLogin = localStorage.getItem('preventLogin')

        if (countLoginWrong === 3 || preventLogin) {
            const preventTime = new Date()
            preventTime.setHours(preventTime.getHours() + 3)

            !preventLogin && localStorage.setItem('preventLogin', JSON.stringify(preventTime))

            preventLogin = JSON.parse(localStorage.getItem('preventLogin')!)

            if (new Date(preventLogin!).getTime() >= Date.now()) {
                toast.error(`Bạn đã bị chặn đăng nhập đến ${calculateCreatedTimeHDMY(preventLogin!)}, vì đã đăng nhập sai quá nhiều lần liên tiếp!`)

                return
            } else {
                localStorage.removeItem('preventLogin')
            }
        }

        dispatch(authActions.login({ ...data, rememberMe }))
    }

    const handleSubmitRegister = async (data: RegisterData) => {
        try {
            setLoading(true)
            const { confirmPassword, ...dataRegister } = data

            if (fileAvatar) {
                const response = await upload([fileAvatar], 'user-avatar')
                dataRegister.avatarUrl = response
            }

            await authApis.register(dataRegister)

            setLoading(false)

            toast.success("Đăng ký thành công. Hãy thực hiện xác thực email!")

            history.push({
                pathname: '/auth/verify-email',
                state: {
                    email: data.email
                },
            });
        }
        catch (err: any) {
            if (err.response?.data.message)
                toast.error(err.response.data.message)
            setLoading(false)
        }
    }

    const handleSubmitForgotPassword = async (data: ForgotPasswordData) => {
        try {
            setLoading(true)
            setSendMailSuccess(false)

            await authApis.forgotPassword(data)

            toast.success("Mail xác thực đã được gửi đến email của bạn!!!")

            setLoading(false)
            setSendMailSuccess(true)
        }
        catch (err: any) {
            if (err.response?.data.message)
                toast.error(err.response.data.message)

            setLoading(false)
            setSendMailSuccess(false)
        }
    }

    const handleVerificationEmail = async (email: string) => {
        try {
            setLoading(true)
            setSendMailSuccess(false)

            await authApis.verificationEmail(email)

            toast.success("Mail xác thực đã được gửi đến email của bạn!!!")

            setLoading(false)
            setSendMailSuccess(true)
        } catch (error: any) {
            if (error.response?.data.message)
                toast.error(error.response.data.message)

            setLoading(false)
            setSendMailSuccess(false)
        }
    }

    const handleConfirmEmail = async (token: string) => {
        try {
            setLoading(true)

            await authApis.confirmEmail(token)

            setLoading(false)

            toast.success('Chúc mừng bạn đã xác thực email thành công! Hãy dùng tài khoản mới của bạn để đăng nhập.')
            history.push('/auth/login');
        } catch (error: any) {
            if (error.response?.data.message)
                toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? e.target.files : []

        if (files[0].size > 500 * 1024) {
            setErrAvatar('Kích thước ảnh không được vượt quá 500KB')
        } else {
            setFileAvatar(files[0])
            setErrAvatar('')
        }
    }

    //additional data for login by FB, GG
    const handleAddiRegister = async (data: AddiRegisterData) => {
        const response: Response<any> = isLoginGG ?
            await authApis.registerGG({
                tokenId: tokenGG,
                ...data
            })
            : await authApis.registerFB({
                ...tokenFB,
                ...data
            })

        dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
    }

    return (
        <Container className={classes.root}>
            <Switch>
                <Route path='/auth/login'>
                    <FormLogin onSubmit={handleSubmitLogin} onSuccessGG={onSuccesGG} onSuccessFB={onSuccesFB} setRememberMe={setRememberMe} />
                </Route>

                <Route path="/auth/register">
                    <FormRegister loading={loading} onSubmit={handleSubmitRegister} onChange={handleUploadAvatar}
                        errAvatar={errAvatar} />
                </Route>

                <Route path="/auth/additional">
                    <AddiRegister onSubmit={handleAddiRegister} isLoginGG={isLoginGG} />
                </Route>

                <Route path="/auth/forgot-password">
                    <ForgotPasswork onSubmit={handleSubmitForgotPassword} loading={loading} sendMailSuccess={sendMailSuccess} />
                </Route>

                <Route path="/auth/reset-password/:token">
                    <ResetPassword />
                </Route>

                <Route path="/auth/change-password">
                    <ChangePassword />
                </Route>

                <Route path="/auth/verify-email">
                    <VerificationEmail handleVerificationEmail={handleVerificationEmail} sendMailSuccess={sendMailSuccess} />
                </Route>

                <Route exact path="/auth/confirm-email/:token">
                    <ConfirmEmail handleConfirmEmail={handleConfirmEmail} loading={loading} />
                </Route>
            </Switch>
        </Container>
    )
}

