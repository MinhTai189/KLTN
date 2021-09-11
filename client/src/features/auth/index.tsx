import { Container, makeStyles } from '@material-ui/core';
import { Forward30TwoTone } from '@material-ui/icons';
import axiosClient from 'api/axiosClient';
import { useAppDispatch } from 'app/hooks';
import axios from 'axios';
import { Response } from 'models';
import React, { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authActions } from './authSlice';
import AddiRegister from './components/AddiRegister';
import ForgotPasswork from './components/ForgotPasswork';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import ResetPassword from './components/ResetPassword';
import { AddiRegisterData, ForgotPasswordData, LoginData, RegisterData } from './models';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "#ccc",
    },
}))

export default function Auth() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [formAvatar, setFormAvatar] = useState<FormData>();
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [isLoginGG, setIsLoginGG] = useState(false)

    const [tokenGG, setTokenGG] = useState(null)
    const [tokenFB, setTokenFB] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const [errAvatar, setErrAvatar] = useState('')

    //hanlde login with Google
    const onSuccesGG = (res: any) => {
        if (res) {
            const tokenId = res.tokenId;
            setTokenGG(tokenId)

            axiosClient.post('/login-google', {
                tokenId
            }).then((response: Response<any>) => {
                if (response.success === false) {
                    setIsLoginGG(true)
                    history.push('/auth/additional')
                }
                else {
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
                }
            }).catch((err: any) => {
                dispatch(authActions.loginFailed(err.response.data.message))
            })
        }
    }

    //hanlde login with Facebook
    const onSuccesFB = (res: any) => {
        if (res && res.authResponse) {
            const { accessToken, userID } = res.authResponse;
            setTokenFB({
                accessToken,
                userID
            })

            axiosClient.post('/login-facebook', {
                accessToken,
                userID
            }).then((response: Response<any>) => {
                if (response.success === false) {
                    setIsLoginGG(false)
                    history.push('/auth/additional')
                }
                else {
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
                }
            }).catch((err: any) => {
                dispatch(authActions.loginFailed(err.response.data.message))
            })
        }
    }

    const handleSubmitLogin = (data: LoginData) => {
        dispatch(authActions.login({ ...data, rememberMe }))
    }

    const handleSubmitRegister = async (data: RegisterData) => {
        try {
            setLoading(true)
            const { confirmPassword, ...dataRegister } = data

            if (formAvatar) {
                const reponse: Response<any> = await axiosClient.post('/uploads', formAvatar, { headers: { "Content-type": "multipart/form-data" } })
                dataRegister.avatarUrl = reponse.data
            }

            await axiosClient.post('/register', dataRegister)

            toast.success("Đã đăng ký thành công. Hãy dùng tài khoản mới để đăng nhập!")
            history.push('/auth/login');
            setLoading(false)
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
            await axiosClient.post('/forgot-password', data)
            toast.success("Mã xác nhận đã được gửi đến email của bạn!!!")
            setLoading(false)
        }
        catch (err: any) {
            if (err.response?.data.message)
                toast.error(err.response.data.message)
            setLoading(false)
        }
    }

    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? e.target.files : []

        if (files[0].size > 500 * 1024) {
            setErrAvatar('Kích thước ảnh không được vượt quá 500KB')
        } else {
            const form = new FormData();
            form.append('file', files[0])
            form.append('folder', 'user-avatar')
            setFormAvatar(form)
            setErrAvatar('')
        }
    }

    //additional data for login by FB, GG
    const handleAddiRegister = async (data: AddiRegisterData) => {
        const response: Response<any> = isLoginGG ?
            await axiosClient.post('/register-google', {
                tokenId: tokenGG,
                ...data
            })
            : await axiosClient.post('/register-facebook', {
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
                    <ForgotPasswork onSubmit={handleSubmitForgotPassword} loading={loading} />
                </Route>

                <Route path="/auth/reset-password/:token">
                    <ResetPassword />
                </Route>
            </Switch>
        </Container>
    )
}

